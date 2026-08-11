import { createClient, SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseCredentials(): { url: string; key: string } | null {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url, key };
}

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;
  const creds = getSupabaseCredentials();
  if (!creds) return null;
  supabaseClient = createClient(creds.url, creds.key, {
    auth: { persistSession: false }
  });
  return supabaseClient;
}

export function handleSupabaseError(res: unknown, error: { message?: string; code?: string }, contextMsg: string) {
  const errMsg = (error?.message || "").toLowerCase();
  const isTableMissing =
    error?.code === "42P01" ||
    errMsg.includes("relation") ||
    errMsg.includes("does not exist") ||
    errMsg.includes("42p01");

  if (isTableMissing) {
    console.warn(`[SUPABASE NOTICE] Database table missing during ${contextMsg}. Run SUPABASE_SCHEMA.sql.`);
    return {
      status: 200,
      body: {
        warning: "TABLE_MISSING",
        message: "Database tables are not provisioned yet.",
        profile: null,
        casesState: {}
      }
    };
  }

  console.error(`[SUPABASE ERROR] ${contextMsg}:`, error);
  return {
    status: 500,
    body: { error: error?.message || "Database operation failed." }
  };
}

export async function verifyAuthToken(authHeader?: string): Promise<{ user: { id: string; email?: string } | null; error: string | null }> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { user: null, error: "SUPABASE_NOT_CONFIGURED" };
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return { user: null, error: "Missing or invalid authorization token" };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: "Unauthorized access or expired session token" };
  }

  return { user, error: null };
}
