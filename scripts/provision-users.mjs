import fs from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USERS_CSV_PATH = process.env.USERS_CSV_PATH;

const DEFAULT_PASSWORD = "P@ssw0rd1";

if (!SUPABASE_URL) throw new Error("Missing env: SUPABASE_URL");
if (!SERVICE_ROLE_KEY) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
if (!USERS_CSV_PATH) throw new Error("Missing env: USERS_CSV_PATH");

function decodeJwtPayload(jwt) {
  const p = String(jwt).split(".")[1];
  if (!p) return null;
  const b64 = p.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((p.length + 3) % 4);
  try {
    return JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

const jwtPayload = decodeJwtPayload(SERVICE_ROLE_KEY);
if (!jwtPayload || jwtPayload.role !== "service_role") {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is not a service_role key (payload.role != service_role).");
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (c === '"' && next === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }

    if (c === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (c === "\r") continue;

    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += c;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const header = rows.shift()?.map((h) => h.trim().toLowerCase());
  if (!header?.length) return [];

  return rows
    .filter((r) => r.some((v) => String(v ?? "").trim() !== ""))
    .map((r) => {
      const obj = {};
      for (let i = 0; i < header.length; i++) obj[header[i]] = String(r[i] ?? "").trim();
      return obj;
    });
}

function isEmail(s) {
  const v = String(s ?? "").trim().toLowerCase();
  return v.includes("@") && v.split("@")[1]?.includes(".");
}

function deriveEmail(username, displayas) {
  const u = String(username ?? "").trim().toLowerCase();
  const d = String(displayas ?? "").trim().toLowerCase();
  if (isEmail(d)) return d;
  if (isEmail(u)) return u;
  return `${u}@britiumexpress.com`;
}

function inferRolePositionStatus(usernameRaw) {
  const u = String(usernameRaw ?? "").trim().toLowerCase();

  if (u === "md") return { role: "super_admin", position: "super_admin", status: "active" };
  if (u === "admin") return { role: "admin", position: "admin", status: "active" };

  if (u.endsWith("_br")) return { role: "manager", position: "branch_manager", status: "pending" };
  if (u.includes("supervisor") || u.endsWith("_sup") || u === "opt_sup") {
    return { role: "manager", position: "supervisor", status: "pending" };
  }
  if (u.includes("data_registerer") || u.includes("data-register") || u.includes("registerer")) {
    return { role: "customer_service", position: "data_registerer", status: "pending" };
  }

  if (u.startsWith("rider.")) return { role: "rider", position: "rider", status: "active" };
  if (u.startsWith("warehouse")) return { role: "warehouse", position: "warehouse", status: "active" };
  if (u.startsWith("dispatch")) return { role: "dispatch", position: "dispatch", status: "active" };
  if (u.startsWith("cs_")) return { role: "customer_service", position: "customer_service", status: "active" };
  if (u.startsWith("cashier")) return { role: "accountant", position: "accountant", status: "active" };
  if (u.startsWith("hradmin")) return { role: "hr", position: "hr", status: "active" };

  return { role: "rider", position: "rider", status: "active" };
}

async function listAllUsers() {
  const perPage = 1000;
  let page = 1;
  const out = [];
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    out.push(...data.users);
    if (data.users.length < perPage) break;
    page += 1;
  }
  return out;
}

async function ensureProfiles() {
  const { error } = await supabase.from("profiles").select("id").limit(1);
  if (error?.code === "PGRST205") throw new Error("public.profiles not found (PGRST205). Create profiles table first.");
}

await ensureProfiles();

const csvText = await fs.readFile(USERS_CSV_PATH, "utf8");
const records = parseCsv(csvText);

const desiredRaw = records.map((r) => {
  const username = String(r.username ?? "").trim().toLowerCase();
  const email = deriveEmail(r.username, r.displayas).toLowerCase();
  const { role, position, status } = inferRolePositionStatus(username);

  let backup_email = null;
  if (email === "md@britiumexpress.com") backup_email = "mgkyawwanna@gmail.com";
  else if (isEmail(r.recoveryemail)) backup_email = String(r.recoveryemail).trim().toLowerCase();

  return { username, email, role, position, status, backup_email };
});

for (const extra of [
  { username: "rider.yangon02", email: "rider.yangon02@britiumexpress.com", role: "rider", position: "rider", status: "active" },
  { username: "warehouse.yangon01", email: "warehouse.yangon01@britiumexpress.com", role: "warehouse", position: "warehouse", status: "active" },
  { username: "supervisor.yangon01", email: "supervisor.yangon01@britiumexpress.com", role: "manager", position: "supervisor", status: "pending" },
  { username: "data_registerer.yangon01", email: "data_registerer.yangon01@britiumexpress.com", role: "customer_service", position: "data_registerer", status: "pending" },
]) desiredRaw.push({ ...extra, backup_email: null });

const desired = [];
const seen = new Set();
for (const d of desiredRaw) {
  if (!d.email || !d.email.includes("@")) continue;
  if (seen.has(d.email)) continue;
  seen.add(d.email);
  desired.push(d);
}

const existingUsers = await listAllUsers();
const existingByEmail = new Map(existingUsers.map((u) => [String(u.email ?? "").toLowerCase(), u]));

let ok = 0;
let failed = 0;

for (const acct of desired) {
  const tag = `${acct.email} role=${acct.role} pos=${acct.position} status=${acct.status}`;
  try {
    const existing = existingByEmail.get(acct.email);

    if (!existing) {
      console.log("Creating:", tag);
      const { data, error } = await supabase.auth.admin.createUser({
        email: acct.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          username: acct.username,
          role: acct.role,
          position: acct.position,
          status: acct.status,
          backup_email: acct.backup_email,
          must_change_password: true,
        },
      });
      if (error) throw error;

      const { error: pErr } = await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          role: acct.role,
          position: acct.position,
          status: acct.status,
          backup_email: acct.backup_email,
          must_change_password: true,
        },
        { onConflict: "id" },
      );
      if (pErr) throw pErr;

      console.log("Created:", tag);
    } else {
      console.log("Updating:", tag);
      const { error } = await supabase.auth.admin.updateUserById(existing.id, {
        password: DEFAULT_PASSWORD,
        user_metadata: {
          ...(existing.user_metadata ?? {}),
          username: acct.username,
          role: acct.role,
          position: acct.position,
          status: acct.status,
          backup_email: acct.backup_email,
          must_change_password: true,
        },
      });
      if (error) throw error;

      const { error: pErr } = await supabase.from("profiles").upsert(
        {
          id: existing.id,
          role: acct.role,
          position: acct.position,
          status: acct.status,
          backup_email: acct.backup_email,
          must_change_password: true,
        },
        { onConflict: "id" },
      );
      if (pErr) throw pErr;

      console.log("Updated:", tag);
    }

    ok += 1;
  } catch (e) {
    failed += 1;
    console.error("FAILED:", tag, "=>", e?.message ?? String(e));
  }
}

console.log(`Done. ok=${ok}, failed=${failed}, default_password=${DEFAULT_PASSWORD}`);
