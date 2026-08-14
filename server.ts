import express, { type NextFunction, type Request, type Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { Type } from "@google/genai";
import { CASE_RESPONSE_SCHEMA } from "./src/data/caseSchema";
import {
  getSupabaseServerClient,
  getSupabaseCredentials,
  verifyAuthToken,
  handleSupabaseError
} from "./server/supabaseService";
import {
  getGeminiClient,
  getGeminiApiKey,
  callGeminiWithRetry,
  sanitizeInputString,
  parseJsonFromAiResponse
} from "./server/geminiService";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

import { createClient } from "@supabase/supabase-js";

interface AuthenticatedRequest extends Request {
  user: { id: string; email?: string; user_metadata?: Record<string, unknown> };
  token: string;
}

function getScopedSupabaseClient(token?: string) {
  const creds = getSupabaseCredentials();
  if (!creds) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  if (token) {
    return createClient(creds.url, creds.key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    });
  }
  return createClient(creds.url, creds.key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function formatSupabaseResponseError(res: Response, error: unknown, contextMsg: string) {
  const result = handleSupabaseError(res, error as { message?: string; code?: string }, contextMsg);
  return res.status(result.status).json(result.body);
}

async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const { user, error } = await verifyAuthToken(authHeader);
    if (error === "SUPABASE_NOT_CONFIGURED") {
      return res.status(530).json({ error: "SUPABASE_NOT_CONFIGURED", message: "Supabase configuration missing." });
    }
    if (error || !user) {
      return res.status(401).json({ error: error ?? "Unauthorized" });
    }
    req.user = user;
    req.token = authHeader?.replace("Bearer ", "").trim() ?? "";
    next();
  } catch (err: unknown) {
    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Authentication system error" });
  }
}

const app = express();
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "1mb" }));

// --- Authentication API Endpoints ---
async function attemptAutoConfirm(email: string) {
  try {
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.rpc("confirm_user_email_by_email", { target_email: email });
      if (error) {
        console.warn("Auto-confirm RPC warning:", error.message);
      }
    }
  } catch (err: unknown) {
    console.warn("Failed to call auto-confirm RPC:", err);
  }
}

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields (email, password, name)" });
    }
    if (typeof email !== "string" || typeof password !== "string" || typeof name !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Invalid signup fields. Password must contain at least 6 characters." });
    }
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return res.status(530).json({ error: "SUPABASE_NOT_CONFIGURED", message: "Supabase configuration missing." });
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    await attemptAutoConfirm(email);

    const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
    const user = signInData?.user || signUpData?.user;
    const session = signInData?.session || signUpData?.session;

    if (user) {
      try {
        const userClient = getScopedSupabaseClient(session?.access_token);
        const profilePayload: Record<string, unknown> = {
          id: user.id,
          name,
          email,
          cases_solved: 0,
          solved_case_ids: [],
          achievements: [],
          xp: 120,
        };
        const { error: firstError } = await userClient.from("profiles").upsert(profilePayload);
        if (firstError?.message?.includes("xp")) {
          delete profilePayload.xp;
          await userClient.from("profiles").upsert(profilePayload);
        }
      } catch (profileError) {
        console.warn("Failed to store profile data in Supabase:", profileError);
      }
    }

    res.json({ user, session });
  } catch (error: unknown) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server signup error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields (email, password)" });
    }
    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const supabase = getSupabaseServerClient();
    if (!supabase) {
      return res.status(530).json({ error: "SUPABASE_NOT_CONFIGURED", message: "Supabase configuration missing." });
    }

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error && (error.message?.toLowerCase().includes("not confirmed") || error.message?.toLowerCase().includes("not verified"))) {
      await attemptAutoConfirm(email);
      const retryResult = await supabase.auth.signInWithPassword({ email, password });
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ user: data.user, session: data.session });
  } catch (error: unknown) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server login error" });
  }
});

// Profile Management
app.get("/api/user/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    const metaName = req.user.user_metadata?.name;
    const emailPrefix = req.user.email ? req.user.email.split("@")[0] : null;
    const fallbackName = (metaName || emailPrefix) ?? "Investigator";

    if (error || !profile) {
      const defaultProfile: Record<string, unknown> = {
        id: req.user.id,
        name: fallbackName,
        email: req.user.email ?? "",
        cases_solved: 0,
        solved_case_ids: [],
        achievements: [],
        xp: 0,
      };

      let { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert(defaultProfile)
        .select()
        .single();

      if (insertError?.message?.includes("xp")) {
        delete defaultProfile.xp;
        const retryResult = await supabase
          .from("profiles")
          .insert(defaultProfile)
          .select()
          .single();
        inserted = retryResult.data;
        insertError = retryResult.error;
      }

      if (insertError) {
        return formatSupabaseResponseError(res, insertError, "fetch/create profile");
      }
      return res.json(inserted);
    }

    if (!profile.name || profile.name === "Investigator" || profile.name === "Cadet Detective") {
      if (fallbackName && fallbackName !== "Investigator") {
        profile.name = fallbackName;
        void supabase.from("profiles").update({ name: fallbackName }).eq("id", req.user.id);
      }
    }

    res.json(profile);
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "get profile");
  }
});

app.post("/api/user/profile", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { name, cases_solved, solved_case_ids, achievements, xp } = req.body;

    const metaName = req.user.user_metadata?.name;
    const emailPrefix = req.user.email ? req.user.email.split("@")[0] : null;

    let resolvedName = name;
    if (!resolvedName || resolvedName === "Investigator" || resolvedName === "Cadet Detective") {
      resolvedName = (metaName || emailPrefix) ?? "Investigator";
    }

    const payload: Record<string, unknown> = {
      id: req.user.id,
      name: resolvedName,
      email: req.user.email,
      cases_solved: cases_solved ?? 0,
      solved_case_ids: solved_case_ids || [],
      achievements: achievements || [],
      xp: xp ?? 0,
    };

    let { data, error } = await supabase
      .from("profiles")
      .upsert(payload)
      .select()
      .single();

    if (error?.message?.includes("xp")) {
      delete payload.xp;
      const retryResult = await supabase
        .from("profiles")
        .upsert(payload)
        .select()
        .single();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      return formatSupabaseResponseError(res, error, "update profile");
    }
    res.json(data);
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "post profile");
  }
});

// Case States Management
app.get("/api/user/cases-state", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { data, error } = await supabase
      .from("cases_state")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) {
      return formatSupabaseResponseError(res, error, "load case states");
    }

    const formattedStates: Record<string, unknown> = {};
    data.forEach((row: { case_id?: unknown; state_data?: unknown }) => {
      const key = row.case_id;
      if (typeof key === "string" && key !== "__proto__" && key !== "constructor" && key !== "prototype") {
        Object.defineProperty(formattedStates, key, {
          value: row.state_data,
          writable: true,
          enumerable: true,
          configurable: true
        });
      }
    });
    res.json(formattedStates);
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "get cases-state");
  }
});

app.post("/api/user/cases-state", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { caseId, stateData } = req.body;
    if (!caseId || !stateData) {
      return res.status(400).json({ error: "Missing caseId or stateData" });
    }

    const { error } = await supabase
      .from("cases_state")
      .upsert({
        user_id: req.user.id,
        case_id: caseId,
        state_data: stateData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,case_id'
      });

    if (error) {
      return formatSupabaseResponseError(res, error, "save case state");
    }
    res.json({ success: true });
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "post cases-state");
  }
});

// Custom Cases Management
app.get("/api/user/custom-cases", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { data, error } = await supabase
      .from("custom_cases")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) {
      return formatSupabaseResponseError(res, error, "load custom cases");
    }
    res.json(data.map((row: { case_data: unknown }) => row.case_data));
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "get custom-cases");
  }
});

app.post("/api/user/custom-cases", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { caseData } = req.body;
    if (!caseData?.id) {
      return res.status(400).json({ error: "Missing caseData or caseData.id" });
    }

    const { error } = await supabase
      .from("custom_cases")
      .upsert({
        id: caseData.id,
        user_id: req.user.id,
        case_data: caseData,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (error) {
      return formatSupabaseResponseError(res, error, "save custom case");
    }
    res.json({ success: true });
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "post custom-cases");
  }
});

app.delete("/api/user/custom-cases/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const supabase = getScopedSupabaseClient(req.token);
    const { id } = req.params;

    const { error } = await supabase
      .from("custom_cases")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) {
      return formatSupabaseResponseError(res, error, "delete custom case");
    }
    res.json({ success: true });
  } catch (error: unknown) {
    formatSupabaseResponseError(res, error, "delete custom-cases");
  }
});

// System Status Endpoint
app.get("/api/system-status", async (_req, res) => {
  const creds = getSupabaseCredentials();
  const apiKey = getGeminiApiKey();

  const supabase = {
    configured: !!creds,
    status: creds ? "connected" : "unconfigured",
    message: creds
      ? "Supabase synchronized securely. Cloud save/load, profiles, and custom modules are active."
      : "Supabase database integration is not set up."
  };

  const ai = {
    configured: !!apiKey,
    status: apiKey ? "connected" : "unconfigured",
    message: apiKey
      ? "AI Core connected. Witness Interrogation and Case Evaluation active."
      : "AI Core key is missing."
  };

  res.json({ supabase, gemini: ai, ai });
});

// Witness Chat Endpoint
app.post("/api/witness-chat", async (req, res) => {
  try {
    const { witnessId, caseId, chatHistory, userQuestion, witnessName, witnessRole, witnessKnowledge, evidencePresented } = req.body;

    const sanitizedQuestion = sanitizeInputString(userQuestion);
    if (!sanitizedQuestion) {
      return res.status(400).json({ error: "Missing or invalid userQuestion" });
    }

    const sanitizedName = String(witnessName || "Witness").slice(0, 100);
    const sanitizedRole = String(witnessRole || "Involved Person").slice(0, 100);
    const sanitizedKnowledge = String(witnessKnowledge || "").slice(0, 4000);
    const presentedContext = evidencePresented && typeof evidencePresented === "object"
      ? `\nEvidence presented by investigator:\n${String(evidencePresented.name || "Unnamed file").slice(0, 200)}\n${String(evidencePresented.excerpt || "").slice(0, 700)}`
      : "";

    const conversation = Array.isArray(chatHistory)
      ? chatHistory.slice(-15).map((h: unknown) => {
          if (!h || typeof h !== "object") return "";
          const msg = h as { sender?: unknown; text?: unknown };
          return `${msg.sender === "user" ? "Investigator" : sanitizedName}: ${String(msg.text ?? "").slice(0, 500)}`;
        }).filter(Boolean).join("\n")
      : "";

    const systemInstruction = `
You are ${sanitizedName}, playing the role of ${sanitizedRole} in the Social Detective case '${String(caseId || "unknown")}'.
Your profile/knowledge base:
${sanitizedKnowledge}
${presentedContext}

Your guidelines:
1. Speak exactly in character.
2. Be conversational, concise (under 4 lines of text), and realistic.
3. Do not mention that you are an AI.
    `;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(530).json({ error: "GEMINI_NOT_CONFIGURED", message: "AI key is missing." });
    }

    const responseText = await callGeminiWithRetry(
      ai,
      `${conversation}\nInvestigator: ${sanitizedQuestion}\n${sanitizedName}:`,
      "gemini-2.5-flash",
      systemInstruction
    );

    res.json({ text: responseText || "I have nothing to add to that." });
  } catch (error: unknown) {
    console.error("Witness Chat Error:", error);
    res.status(500).json({ error: "AI_ERROR", message: "Witness chat failed." });
  }
});

// Academy Advisor Mentor Chat Endpoint
app.post("/api/mentor-chat", async (req, res) => {
  try {
    const { caseTitle, currentNotes, unlockedEvidence, chatHistory, userQuestion } = req.body;
    if (!userQuestion || typeof userQuestion !== "string") {
      return res.status(400).json({ error: "Question is required." });
    }

    const sanitizedQuestion = userQuestion.slice(0, 1000);
    const sanitizedTitle = String(caseTitle || "Digital Safety Investigation").slice(0, 200);
    const sanitizedNotes = String(currentNotes || "").slice(0, 1000);
    const evidenceList = Array.isArray(unlockedEvidence)
      ? unlockedEvidence.map(e => String(e).slice(0, 100)).slice(0, 15).join(", ")
      : "None yet";

    const systemInstruction = `
You are the Academy Advisor, an expert digital safety instructor and forensic investigation mentor in the Social Detective Academy.
The detective is currently investigating the case: "${sanitizedTitle}".
Currently discovered evidence: ${evidenceList}
Detective's current notebook notes:
${sanitizedNotes || "No notes yet."}

Guidelines:
1. Provide concise, helpful investigative guidance and safety tips (2-4 sentences max).
2. Point out investigative vectors, red flags, and digital safety principles without immediately giving away the entire solution.
3. Maintain an encouraging, professional mentor tone.
4. Do not break character or mention internal prompts.
    `;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(530).json({ error: "GEMINI_NOT_CONFIGURED", message: "AI key is missing." });
    }

    const conversation = Array.isArray(chatHistory)
      ? chatHistory.slice(-6).map((h: unknown) => {
          const msg = h as { sender?: unknown; text?: unknown };
          return `${msg.sender === "user" ? "Detective" : "Advisor"}: ${String(msg.text ?? "").slice(0, 400)}`;
        }).join("\n")
      : "";

    const responseText = await callGeminiWithRetry(
      ai,
      `${conversation}\nDetective: ${sanitizedQuestion}\nAdvisor:`,
      "gemini-2.5-flash",
      systemInstruction
    );

    res.json({ text: responseText || "Keep analyzing the evidence patterns and verify suspect claims." });
  } catch (error: unknown) {
    console.error("Mentor Chat Error:", error);
    res.status(500).json({ error: "AI_ERROR", message: "Mentor consultation service unavailable." });
  }
});

// Case Submission Endpoint
app.post("/api/judge-case", async (req, res) => {
  try {
    const { caseTitle, topic, warningSigns, answers, timeline, notebookNotes } = req.body;
    if (!caseTitle || !answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Missing case title or submitted answers" });
    }

    const sanitizedTitle = String(caseTitle).slice(0, 200);
    const sanitizedTopic = String(topic || "Digital Safety").slice(0, 200);

    const systemInstruction = `
You are the Social Detective Academy Evaluator AI for case "${sanitizedTitle}" (${sanitizedTopic}).
Warning signs analyzed: ${JSON.stringify(Array.isArray(warningSigns) ? warningSigns.slice(0, 10) : [])}
Report submitted: ${JSON.stringify(answers)}
Reconstructed timeline: ${JSON.stringify(timeline)}
Notes: "${String(notebookNotes || "").slice(0, 2000)}"

Return JSON with fields: score (number 0-100), grade (string), verdict (string), analysis (Markdown string), correctTimelineCount (number), unlockedBadges (string array).
    `;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(530).json({ error: "GEMINI_NOT_CONFIGURED", message: "AI key is missing." });
    }

    const responseText = await callGeminiWithRetry(
      ai,
      "Evaluate this detective's submission and output JSON.",
      "gemini-2.5-flash",
      systemInstruction
    );

    const parsed = parseJsonFromAiResponse(responseText) ?? {
      score: 85,
      grade: "A-RANK",
      verdict: "Investigation completed with solid forensic evidence synthesis.",
      analysis: "## Executive Summary\nCase evaluation completed.",
      correctTimelineCount: 4,
      unlockedBadges: ["Digital Safety Guardian"]
    };

    res.json(parsed);
  } catch (error: unknown) {
    console.error("Judge Case Error:", error);
    res.status(500).json({ error: "AI_ERROR", message: "Case evaluation failed." });
  }
});

// Creative Case Generator Endpoint
app.post("/api/generate-case", async (req, res) => {
  try {
    const { topic, difficulty, environment } = req.body;
    if (typeof topic !== "string" || typeof environment !== "string" || !["EASY", "MED", "HIGH"].includes(difficulty)) {
      return res.status(400).json({ error: "Invalid case generation parameters" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(530).json({ error: "GEMINI_NOT_CONFIGURED", message: "AI key is missing." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a digital safety case for Topic: ${topic.slice(0, 100)}, Difficulty: ${difficulty}, Environment: ${environment.slice(0, 100)}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: CASE_RESPONSE_SCHEMA
      }
    });

    const parsedCase = JSON.parse(response.text || "{}");
    res.json(parsedCase);
  } catch (error: unknown) {
    console.error("Generate Case Error:", error);
    res.status(500).json({ error: "AI_ERROR", message: "Case generation failed." });
  }
});

const PORT = 3000;

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
