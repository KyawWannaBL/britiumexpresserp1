import { createClient } from "jsr:@supabase/supabase-js@2";
import { SignJWT, importPKCS8 } from "npm:jose@5.9.6";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function env(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

async function createGoogleAccessToken(args: {
  clientEmail: string;
  privateKeyPem: string;
  scope: string;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const jwt = await new SignJWT({
    scope: args.scope,
  })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(args.clientEmail)
    .setSubject(args.clientEmail)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(await importPKCS8(args.privateKeyPem, "RS256"));

  const form = new URLSearchParams();
  form.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  form.set("assertion", jwt);

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Google token error: ${resp.status} ${t}`);
  }

  const data = (await resp.json()) as { access_token: string };
  return data.access_token;
}

function fsString(v: unknown) {
  return { stringValue: String(v ?? "") };
}
function fsBool(v: unknown) {
  return { booleanValue: Boolean(v) };
}
function fsNull() {
  return { nullValue: null };
}

async function upsertFirestoreUserDoc(args: {
  projectId: string;
  accessToken: string;
  uid: string;
  doc: Record<string, unknown>;
}): Promise<void> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${args.projectId}` +
    `/databases/(default)/documents/users/${encodeURIComponent(args.uid)}`;

  const fields: Record<string, unknown> = {
    email: fsString(args.doc.email),
    full_name: fsString(args.doc.full_name),
    phone: fsString(args.doc.phone),
    role: fsString(args.doc.role),
    status: fsString(args.doc.status),
    branch_location: fsString(args.doc.branch_location),
    department: fsString(args.doc.department),
    position: args.doc.position ? fsString(args.doc.position) : fsNull(),
    force_password_change: fsBool(args.doc.force_password_change),
    backup_email: args.doc.backup_email ? fsString(args.doc.backup_email) : fsNull(),
    updated_at: { timestampValue: new Date().toISOString() },
  };

  const resp = await fetch(url, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${args.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`Firestore write failed: ${resp.status} ${t}`);
  }
}

async function createFirebaseCustomToken(args: {
  projectId: string;
  clientEmail: string;
  privateKeyPem: string;
  uid: string;
  claims?: Record<string, unknown>;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const aud =
    "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";

  const payload: Record<string, unknown> = {
    uid: args.uid,
  };
  if (args.claims && Object.keys(args.claims).length) {
    payload.claims = args.claims;
  }

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(args.clientEmail)
    .setSubject(args.clientEmail)
    .setAudience(aud)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(await importPKCS8(args.privateKeyPem, "RS256"));

  return token;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { status: 200, headers: corsHeaders });
  if (req.method !== "POST") return json(405, { error: "Method not allowed" });

  try {
    const jwt = bearer(req);
    if (!jwt) return json(401, { error: "Missing Authorization Bearer token" });

    const SUPABASE_URL = env("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");

    const FIREBASE_PROJECT_ID = env("FIREBASE_PROJECT_ID");
    const FIREBASE_CLIENT_EMAIL = env("FIREBASE_CLIENT_EMAIL");
    const FIREBASE_PRIVATE_KEY = env("FIREBASE_PRIVATE_KEY").replaceAll("\\n", "\n");

    const sbAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });

    const { data: userRes, error: userErr } = await sbAdmin.auth.getUser(jwt);
    if (userErr || !userRes.user) return json(401, { error: "Invalid Supabase token" });

    const u = userRes.user;

    // Read your profile table (adjust here if your table name differs)
    const { data: prof, error: profErr } = await sbAdmin
      .from("user_profiles")
      .select("role,status,branch_location,department,position,pos,full_name,phone,force_password_change,must_change_password,backup_email")
      .eq("id", u.id)
      .maybeSingle();

    if (profErr) return json(500, { error: profErr.message });

    const role = (prof?.role as string | undefined) ?? (u.user_metadata?.role as string | undefined) ?? "rider";
    const status = (prof?.status as string | undefined) ?? "active";
    const position = (prof?.position as string | undefined) ?? (prof?.pos as string | undefined) ?? null;

    const forcePasswordChange = Boolean(prof?.force_password_change ?? prof?.must_change_password ?? true);

    const backupEmail =
      (u.email?.toLowerCase() === "md@britiumexpress.com")
        ? "mgkyawwanna@gmail.com"
        : (prof?.backup_email as string | undefined);

    // 1) Ensure Firestore /users/{uid} exists (uid = Supabase uuid)
    const googleAccessToken = await createGoogleAccessToken({
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKeyPem: FIREBASE_PRIVATE_KEY,
      scope: "https://www.googleapis.com/auth/datastore",
    });

    await upsertFirestoreUserDoc({
      projectId: FIREBASE_PROJECT_ID,
      accessToken: googleAccessToken,
      uid: u.id,
      doc: {
        email: u.email ?? "",
        full_name: prof?.full_name ?? (u.user_metadata?.full_name ?? ""),
        phone: prof?.phone ?? (u.user_metadata?.phone ?? ""),
        role,
        status,
        branch_location: prof?.branch_location ?? (u.user_metadata?.branch_location ?? ""),
        department: prof?.department ?? (u.user_metadata?.department ?? ""),
        position,
        force_password_change: forcePasswordChange,
        backup_email: backupEmail,
      },
    });

    // 2) Mint Firebase custom token so client can sign in
    const customToken = await createFirebaseCustomToken({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKeyPem: FIREBASE_PRIVATE_KEY,
      uid: u.id,
      claims: { role, status, position },
    });

    return json(200, { firebase_custom_token: customToken, uid: u.id });
  } catch (e) {
    return json(500, { error: e instanceof Error ? e.message : String(e) });
  }
});