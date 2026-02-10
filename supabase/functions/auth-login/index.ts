import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { email, password, role } = await req.json();

    if (!email || !password) return json({ error: "Email and password are required" }, 400);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // 1) Sign-in using anon client
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });

    const { data: signIn, error: signInError } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signIn.user || !signIn.session) {
      return json({ error: signInError?.message ?? "Invalid credentials" }, 401);
    }

    // 2) Load profile using service role (reliable even if RLS blocks)
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: profile, error: profileErr } = await adminClient
      .from("user_profiles")
      .select("role, status, must_change_password")
      .eq("id", signIn.user.id)
      .maybeSingle();

    if (profileErr) return json({ error: profileErr.message }, 500);
    if (!profile) return json({ error: "Profile not found" }, 403);

    if (profile.status && profile.status !== "active") {
      return json({ error: "Account is not active" }, 403);
    }

    // 3) Optional role check
    if (role) {
      const profileRole = profile.role as string | null;

      // super_admin can pass any selected role; otherwise must match
      if (profileRole !== "super_admin" && profileRole !== role) {
        return json({ error: "Selected role does not match your account role" }, 403);
      }
    }

    return json({
      user: signIn.user,
      session: signIn.session,
      profile: {
        role: profile.role,
        status: profile.status,
        must_change_password: profile.must_change_password,
      },
    });
  } catch (e) {
    return json({ error: e?.message ?? "Unexpected error" }, 500);
  }
});
