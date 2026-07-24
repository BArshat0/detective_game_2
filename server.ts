import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { CASE_RESPONSE_SCHEMA } from "./src/data/caseSchema";

dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

import { createClient } from "@supabase/supabase-js";

// Supabase Lazy Initialization with validation (scoped per-request to support Row-Level Security)
let supabaseClient: any = null;

function getSupabaseUserClient(token?: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }
  if (token) {
    return createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });
  }
  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
}

function getSupabase() {
  if (!supabaseClient) {
    supabaseClient = getSupabaseUserClient();
  }
  return supabaseClient;
}

// Error helper for missing tables (PG code 42P01)
function handleSupabaseError(error: any, res: any, contextMsg: string) {
  console.error(`Supabase error during ${contextMsg}:`, error);
  if (error && (error.code === "42P01" || (error.message && error.message.includes("relation") && error.message.includes("does not exist")))) {
    return res.status(400).json({
      error: "SUPABASE_TABLES_MISSING",
      message: "The required tables are not set up in your Supabase database. Please create 'profiles', 'custom_cases', and 'cases_state' tables using the provided SQL schema in your Supabase SQL Editor.",
    });
  }
  return res.status(500).json({
    error: "SUPABASE_ERROR",
    message: "A database query error occurred while processing your request.",
  });
}

// Auth Middleware
async function requireAuth(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing authentication token" });
    }
    const token = authHeader.split(" ")[1];
    const supabase = getSupabase();
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
    req.user = user;
    req.token = token; // Store token for user-scoped queries
    next();
  } catch (error: any) {
    if (error.message === "SUPABASE_NOT_CONFIGURED") {
      return res.status(530).json({ error: "SUPABASE_NOT_CONFIGURED", message: "Supabase has not been configured in the environment variables yet." });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication system error" });
  }
}

const app = express();
app.disable("x-powered-by");

// Add security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

app.use(express.json({ limit: "1mb" }));

// --- Supabase Authentication & Storage API Endpoints ---

// Helper function to programmatically trigger email confirmation via Postgres RPC
async function attemptAutoConfirm(email: string) {
  try {
    const supabase = getSupabase();
    // Try calling the RPC to auto-confirm the email (created in our database schema)
    const { error } = await supabase.rpc("confirm_user_email_by_email", { target_email: email });
    if (error) {
      console.warn("Auto-confirm RPC warning (might not exist yet):", error.message);
    } else {
      console.log(`Auto-confirm RPC called successfully for: ${email}`);
    }
  } catch (err: any) {
    console.warn("Failed to call auto-confirm RPC (expected if the RPC hasn't been added to Supabase yet):", err?.message || err);
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
    const supabase = getSupabase();
    
    // Sign up with Supabase - no verification link option passed
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (signUpError) {
      return res.status(400).json({ error: signUpError.message });
    }

    // Call the auto-confirm RPC immediately to make sure they are confirmed
    await attemptAutoConfirm(email);

    // Verify authentication from the database immediately and sign it in if verified
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    const user = signInData?.user || signUpData?.user;
    const session = signInData?.session || signUpData?.session;

    if (user) {
      // Store the profile data in Supabase profiles table
      try {
        const userClient = getSupabaseUserClient(session?.access_token);
        const profilePayload: any = {
          id: user.id,
          name,
          email,
          cases_solved: 0,
          solved_case_ids: [],
          achievements: [],
          xp: 120,
        };
        const { error: firstError } = await userClient.from("profiles").upsert(profilePayload);
        if (firstError && firstError.message && firstError.message.includes("xp")) {
          delete profilePayload.xp;
          await userClient.from("profiles").upsert(profilePayload);
        }
      } catch (profileError) {
        console.warn("Failed to automatically store profile data in Supabase profiles table:", profileError);
      }
    }

    res.json({ user, session });
  } catch (error: any) {
    if (error.message === "SUPABASE_NOT_CONFIGURED") {
      return res.status(530).json({ error: "SUPABASE_NOT_CONFIGURED", message: "Supabase configuration missing." });
    }
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
    const supabase = getSupabase();
    
    // First attempt to sign in
    let { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    // If the error indicates unconfirmed email, attempt to confirm via RPC and retry
    if (error && (error.message?.toLowerCase().includes("not confirmed") || error.message?.toLowerCase().includes("not verified"))) {
      console.log(`Detected unconfirmed email for: ${email}. Attempting auto-confirm via RPC...`);
      await attemptAutoConfirm(email);
      
      // Retry sign in
      const retryResult = await supabase.auth.signInWithPassword({ email, password });
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ user: data.user, session: data.session });
  } catch (error: any) {
    if (error.message === "SUPABASE_NOT_CONFIGURED") {
      return res.status(530).json({ error: "SUPABASE_NOT_CONFIGURED", message: "Supabase configuration missing." });
    }
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server login error" });
  }
});

// Profile Management
app.get("/api/user/profile", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error || !profile) {
      // Lazy-create profile if not found but table exists
      const defaultProfile: any = {
        id: req.user.id,
        name: req.user.user_metadata?.name || req.user.email?.split("@")[0] || "Investigator",
        email: req.user.email || "",
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
      
      if (insertError && insertError.message && insertError.message.includes("xp")) {
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
        return handleSupabaseError(insertError, res, "fetch/create profile");
      }
      return res.json(inserted);
    }
    res.json(profile);
  } catch (error: any) {
    handleSupabaseError(error, res, "get profile");
  }
});

app.post("/api/user/profile", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
    const { name, cases_solved, solved_case_ids, achievements, xp } = req.body;
    
    const payload: any = {
      id: req.user.id,
      name: name && name !== "Cadet Detective" ? name : (req.user.user_metadata?.name || req.user.email?.split("@")[0] || "Investigator"),
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

    if (error && error.message && error.message.includes("xp")) {
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
      return handleSupabaseError(error, res, "update profile");
    }
    res.json(data);
  } catch (error: any) {
    handleSupabaseError(error, res, "post profile");
  }
});

// Case States Management
app.get("/api/user/cases-state", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
    const { data, error } = await supabase
      .from("cases_state")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) {
      return handleSupabaseError(error, res, "load case states");
    }

    const formattedStates: Record<string, any> = {};
    data.forEach((row: any) => {
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
  } catch (error: any) {
    handleSupabaseError(error, res, "get cases-state");
  }
});

app.post("/api/user/cases-state", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
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
      return handleSupabaseError(error, res, "save case state");
    }
    res.json({ success: true });
  } catch (error: any) {
    handleSupabaseError(error, res, "post cases-state");
  }
});

// Custom Cases Management
app.get("/api/user/custom-cases", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
    const { data, error } = await supabase
      .from("custom_cases")
      .select("*")
      .eq("user_id", req.user.id);

    if (error) {
      return handleSupabaseError(error, res, "load custom cases");
    }
    res.json(data.map((row: any) => row.case_data));
  } catch (error: any) {
    handleSupabaseError(error, res, "get custom-cases");
  }
});

app.post("/api/user/custom-cases", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
    const { caseData } = req.body;
    if (!caseData || !caseData.id) {
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
      return handleSupabaseError(error, res, "save custom case");
    }
    res.json({ success: true });
  } catch (error: any) {
    handleSupabaseError(error, res, "post custom-cases");
  }
});

app.delete("/api/user/custom-cases/:id", requireAuth, async (req: any, res) => {
  try {
    const supabase = getSupabaseUserClient(req.token);
    const { id } = req.params;

    const { error } = await supabase
      .from("custom_cases")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id);

    if (error) {
      return handleSupabaseError(error, res, "delete custom case");
    }
    res.json({ success: true });
  } catch (error: any) {
    handleSupabaseError(error, res, "delete custom-cases");
  }
});

const PORT = 3000;

// Initialize Gemini API lazily to prevent startup crashes if key is missing
let aiClient: any = null;

function getGemini() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_NOT_CONFIGURED");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Retry helper for handling temporary model unavailability or high-demand (503) errors with exponential backoff
async function callGeminiWithRetry(fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> {
  try {
    return await fn();
  } catch (error: any) {
    const errorStr = JSON.stringify(error) || error?.toString() || "";
    const isRetryable = 
      errorStr.includes("503") || 
      errorStr.includes("UNAVAILABLE") || 
      errorStr.includes("high demand") || 
      errorStr.includes("temporary") ||
      (error?.status === 503) ||
      (error?.code === 503);

    if (isRetryable && retries > 0) {
      console.warn(`Gemini error (503/UNAVAILABLE) encountered. Retrying in ${delay}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callGeminiWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

// Helper to handle Gemini errors gracefully in the backend
function handleGeminiError(error: any, res: any, contextMsg: string) {
  console.error(`Gemini error during ${contextMsg}:`, error);
  if (error && (error.message === "GEMINI_NOT_CONFIGURED" || error.message?.includes("API_KEY"))) {
    return res.status(530).json({
      error: "GEMINI_NOT_CONFIGURED",
      message: "The Gemini AI Core is not configured yet. Please enter the GEMINI_API_KEY in the Secrets panel on Google AI Studio.",
    });
  }
  return res.status(500).json({
    error: "AI_ERROR",
    message: "Failed to perform AI analysis. The system is temporarily unavailable.",
  });
}

interface ServiceStatus {
  configured: boolean;
  status: string;
  message: string;
}

// Check Supabase Configuration Status
async function checkSupabaseStatus(): Promise<ServiceStatus> {
  const status = {
    configured: false,
    status: "unconfigured",
    message: "Supabase database integration is not set up."
  };

  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
    if (url && key) {
      // Test key and URL actively
      const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      const { error: testErr } = await client.from("profiles").select("id").limit(1);
      
      if (testErr) {
        if (testErr.message && testErr.message.includes("Invalid API key")) {
          status.configured = false;
          status.status = "error";
          status.message = "Supabase API key validation failed. Please check your SUPABASE_KEY in Secrets.";
        } else if (testErr.code === "PGRST116" || testErr.code === "PGRST301") {
          // PGRST116 means row not found (which is fine, database is alive!)
          status.configured = true;
          status.status = "connected";
          status.message = "Supabase synchronized securely. Cloud save/load, profiles, and custom modules are fully active.";
        } else if (testErr.code === "42P01") {
          // Table does not exist
          status.configured = true;
          status.status = "error";
          status.message = "Connected to Supabase, but some database tables (profiles, custom_cases, or cases_state) are missing. Please run the SQL schema in your Supabase SQL Editor.";
        } else {
          status.configured = true;
          status.status = "connected";
          status.message = `Supabase connected (Status note: ${testErr.message || testErr.code})`;
        }
      } else {
        status.configured = true;
        status.status = "connected";
        status.message = "Supabase synchronized securely. Cloud save/load, profiles, and custom modules are fully active.";
      }
    } else {
      status.configured = false;
      status.status = "offline";
      status.message = "Supabase database keys are not configured. Guest accounts and custom case creation are saved locally in this browser tab only.";
    }
  } catch (err: any) {
    status.configured = false;
    status.status = "error";
    status.message = `Database connection error: ${err.message || err}`;
  }

  return status;
}

// Check Gemini Configuration Status
async function checkGeminiStatus(): Promise<ServiceStatus> {
  const status = {
    configured: false,
    status: "unconfigured",
    message: "Gemini AI Core is not set up."
  };

  try {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      if (key.length < 10) {
        status.configured = false;
        status.status = "error";
        status.message = "The GEMINI_API_KEY appears invalid. Please configure a valid key in Secrets.";
      } else {
        try {
          getGemini();
          status.configured = true;
          status.status = "connected";
          status.message = "Gemini AI Core connected. Case Evaluation, Witness Interrogation, and AI Game Architect are active.";
        } catch (gemErr: any) {
          status.configured = false;
          status.status = "error";
          status.message = `AI Core initialization error: ${gemErr.message || gemErr}`;
        }
      }
    } else {
      status.configured = false;
      status.status = "offline";
      status.message = "GEMINI_API_KEY is not configured. Witness chat and case evaluations will fall back to local offline backup simulation.";
    }
  } catch (err: any) {
    status.configured = false;
    status.status = "error";
    status.message = `AI Core configuration error: ${err.message || err}`;
  }

  return status;
}

// System Status Endpoint (checks configurations gracefully in the backend)
app.get("/api/system-status", async (req, res) => {
  const supabase = await checkSupabaseStatus();
  const gemini = await checkGeminiStatus();
  res.json({ supabase, gemini });
});

// Helper to format chat history for LLM prompt ingestion
function formatChatHistory(chatHistory: any[], userLabel = "Investigator", otherLabel: string): string {
  const history = Array.isArray(chatHistory) ? chatHistory : [];
  return history.map((h: any) => `${h.sender === "user" ? userLabel : otherLabel}: ${h.text || ""}`).join("\n");
}

// 1. Witness Chat Endpoint
app.post("/api/witness-chat", async (req, res) => {
  try {
    const { witnessId, caseId, chatHistory, userQuestion, witnessName, witnessRole, witnessKnowledge } = req.body;

    if (!userQuestion) {
      return res.status(400).json({ error: "Missing userQuestion" });
    }

    const conversation = formatChatHistory(chatHistory, "Investigator", witnessName);

    const systemInstruction = `
You are ${witnessName}, playing the role of ${witnessRole} in the Social Detective case '${caseId}'.
Your profile/knowledge base:
${witnessKnowledge}

Your guidelines:
1. Speak exactly in character, maintaining your role.
2. If you are a suspect who is defensive or guilty, be evasive but let slip small, subtle clues if the investigator presents logical arguments, mentions discovered evidence, or presses you.
3. Keep your answers conversational, concise (under 4 lines of text), and realistic.
4. Do not mention that you are an AI or reading a prompt.
5. If the user refers to specific evidence related to you (e.g. your chat records, social posts), react appropriately (nervousness, defensive explanation, or surprise).
    `;

    const ai = getGemini();
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${conversation}\nInvestigator: ${userQuestion}\n${witnessName}:`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    }));

    const reply = response.text || "I... I have nothing to say to that.";
    res.json({ text: reply.trim() });
  } catch (error: any) {
    return handleGeminiError(error, res, "Witness Interrogation");
  }
});

// 2. Mentor Chat Endpoint
app.post("/api/mentor-chat", async (req, res) => {
  try {
    const { caseTitle, currentNotes, unlockedEvidence, chatHistory, userQuestion } = req.body;

    if (typeof userQuestion !== "string" || !userQuestion.trim()) {
      return res.status(400).json({ error: "Missing userQuestion" });
    }
    const conversation = formatChatHistory(chatHistory, "Investigator", "Lead Mentor");

    const systemInstruction = `
You are the Social Detective Academy Advisor, an expert in social safety and online crime prevention. Your job is to guide investigators solving the social crime case: "${caseTitle}".
Current unlocked evidence titles: ${JSON.stringify(unlockedEvidence)}
User's investigation notebook notes: "${currentNotes}"

Your guidelines:
1. Provide highly encouraging, friendly, and clever guidance.
2. NEVER give away the final answers or the complete solution. Instead, ask probing questions or suggest what to look at next (e.g. "Have you examined the conversation timestamps?", "Look closely at the profile handles or dates", "Maybe you should interview the witness again and ask about the source").
3. Connect the clues to real-world Digital Safety and Social Awareness lessons (e.g., explaining how catfishing works, the psychological dynamics of online peer pressure, or how echo chambers accelerate viral rumors).
4. Keep responses highly scannable, engaging, and professional. Use brief paragraphs.
    `;

    const ai = getGemini();
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${conversation}\nInvestigator: ${userQuestion}\nLead Mentor:`,
      config: {
        systemInstruction,
        temperature: 0.6,
      },
    }));

    const reply = response.text || "Keep digging, detective! Every detail counts.";
    res.json({ text: reply.trim() });
  } catch (error: any) {
    return handleGeminiError(error, res, "Mentor Drone Chat");
  }
});

// 3. Case Submission & Evaluation (Judge AI) Endpoint
app.post("/api/judge-case", async (req, res) => {
  try {
    const { caseTitle, topic, warningSigns, manipulationTechniques, answers, timeline, notebookNotes } = req.body;
    if (!caseTitle || !answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Missing case title or submitted answers" });
    }

    const systemInstruction = `
You are the Social Detective Academy Evaluator AI. Your role is to critically evaluate an investigator's submitted findings for the social safety case: "${caseTitle}" (Topic: ${topic}).
Warning Signs that should have been analyzed: ${JSON.stringify(warningSigns)}
Psychological Manipulation techniques in play: ${JSON.stringify(manipulationTechniques)}

User's submitted answers to key questions: ${JSON.stringify(answers)}
User's reconstructed timeline of events: ${JSON.stringify(timeline)}
User's investigation notes: "${notebookNotes}"

You must analyze their submission:
1. Calculate a final score from 0 to 100 based on the correctness of their answers and the correctness of their reconstructed timeline.
2. Provide a grade (S-RANK for 95-100, A-RANK for 80-94, B-RANK for 65-79, C-RANK for below 65).
3. Draft a precise, highly engaging, and educational "Digital Safety & Social Awareness Evaluation Report" in Markdown. This report must explain:
   - How the social manipulation or fraud worked step-by-step.
   - The psychological manipulation triggers used (urgency, isolation, validation, fear, etc.) and how the victim was influenced.
   - Practical, real-world warning signs they can use to avoid falling victim to similar crimes.
4. Award a list of specific badges based on their case resolution (e.g. "Scam Prevention Guardian", "Empathy Advocate", "Disinformation Fact-Checker").
    `;

    const ai = getGemini();
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Evaluate this detective's submission and output a detailed evaluation in JSON format.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Calculated numeric score out of 100." },
            grade: { type: Type.STRING, description: "S-RANK, A-RANK, B-RANK, or C-RANK." },
            verdict: { type: Type.STRING, description: "A one-sentence cinematic summary verdict of their performance." },
            analysis: { type: Type.STRING, description: "A detailed educational breakdown of the attack vector, manipulation techniques, and safe habits in elegant Markdown." },
            correctTimelineCount: { type: Type.INTEGER, description: "How many of the timeline nodes are placed correctly." },
            unlockedBadges: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of cool badge names awarded for solving this case."
            }
          },
          required: ["score", "grade", "verdict", "analysis", "correctTimelineCount", "unlockedBadges"]
        }
      },
    }));

    const parsedResult = JSON.parse(response.text || "{}");
    res.json(parsedResult);
  } catch (error: any) {
    return handleGeminiError(error, res, "Case Submission Assessment");
  }
});

// 4. Creative Case Generator (Creative Mode) Endpoint
app.post("/api/generate-case", async (req, res) => {
  try {
    const { topic, difficulty, environment } = req.body;
    if (typeof topic !== "string" || typeof environment !== "string" || !["EASY", "MED", "HIGH"].includes(difficulty)) {
      return res.status(400).json({ error: "Invalid case generation parameters" });
    }

    const systemInstruction = `
You are the Master Social Detective Case Designer.
Your task is to generate a fully complete, logically sound, highly interactive, and extremely educational digital safety/social crime case of difficulty level '${difficulty}' dealing with the topic of '${topic}' situated in the environment '${environment}'.

The returned case must perfectly conform to the requested JSON schema.
Ensure:
1. The case has a unique alphanumeric id (e.g. 'case_custom_1029').
2. Visual assets can use elegant Unsplash photography links related to social interaction, school life, families, or communities.
3. Include 2-3 detailed, distinct Evidences (one can be an image, others can be chat logs, social feeds, emails).
4. Include 2 interactive Witness characters with fully detailed 'promptKnowledge' representing their testimony, quirks, and hidden clues.
5. Create a logically correct timeline of 3-4 steps that the player will reconstruct.
6. Create 3 Clues that correspond to discovering the evidences.
7. Create a 'solution' containing 2-3 precise questions with 4 choices each, a correct answer (matching one of the choices exactly), and an educational explanation.
8. Define a 'location' containing 2-3 hotspots that reveal locked or unlocked evidence.
9. Naming & Presentation Rules:
   - Case Titles must be story-driven and curiosity-inducing (e.g., "The Fake Scholarship Trap", "The Midnight Voice Call") rather than generic terms.
   - Evidence Names must be realistic document/media titles (e.g., "Scholarship Award Email", "WhatsApp Group Chat Transcript", "Audio Spectrograph Report") rather than filenames like "evidence1.txt".
   - Include realistic category, dateCollected, source, and importance fields on every evidence item.
10. Write the story, metadata, and questions with premium professional quality, highlighting psychological manipulation and social influence vectors.
    `;

    const ai = getGemini();
    const response = await callGeminiWithRetry(() => ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: `Generate a new case for Topic: ${topic}, Difficulty: ${difficulty}, Environment: ${environment}.`,
       config: {
         systemInstruction,
         responseMimeType: "application/json",
         responseSchema: CASE_RESPONSE_SCHEMA
       }
     }));

    const parsedCase = JSON.parse(response.text || "{}");
    res.json(parsedCase);
  } catch (error: any) {
    return handleGeminiError(error, res, "AI Architect Game Generation");
  }
});

// Serve frontend assets
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
