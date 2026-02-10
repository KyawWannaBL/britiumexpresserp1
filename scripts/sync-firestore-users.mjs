// File: scripts/sync-firestore-users.mjs
/**
 * Sync users from Users.csv into:
 *  - Firebase Auth (email/password)
 *  - Firestore /users/{uid} document (role/status/branch_location/position/etc)
 *
 * Required env:
 *  - USERS_CSV_PATH="D:\Britium Express\logistics_platform (4)\Users.csv"
 *  - FIREBASE_SERVICE_ACCOUNT_PATH="D:\path\to\firebase-service-account.json"
 *
 * Optional env:
 *  - DEFAULT_PASSWORD="P@ssw0rd1"
 *  - BACKUP_EMAIL_SUPER_ADMIN="mgkyawwanna@gmail.com"
 *  - SUPER_ADMIN_EMAIL="md@britiumexpress.com"
 *  - DRY_RUN="1" (no writes)
 *  - PURGE="1" + PURGE_CONFIRM="YES" (dangerous: deletes Firebase Auth users not in CSV, limited by domain)
 *  - PURGE_DOMAIN="britiumexpress.com"
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import admin from "firebase-admin";
import { parse } from "csv-parse/sync";

function env(name, fallback = undefined) {
  const v = process.env[name];
  return v == null || v === "" ? fallback : v;
}

function requireEnv(name) {
  const v = env(name);
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function normalizeEmail(v) {
  return String(v ?? "").trim().toLowerCase();
}

function normalizeRole(v) {
  const r = String(v ?? "").trim().toLowerCase();
  // accepted by your rules: super_admin, admin, manager, accountant, warehouse, rider, dispatch,
  // customer_service, hr, qa, bi_analyst
  const allowed = new Set([
    "super_admin",
    "admin",
    "manager",
    "accountant",
    "warehouse",
    "rider",
    "dispatch",
    "customer_service",
    "hr",
    "qa",
    "bi_analyst",
  ]);
  return allowed.has(r) ? r : "rider";
}

function normalizeStatus(v) {
  const s = String(v ?? "").trim().toLowerCase();
  // rules require status == "active" for access
  if (s === "active") return "active";
  if (s === "pending") return "pending";
  if (s === "disabled") return "disabled";
  return "active";
}

function normalizePosition(v) {
  const p = String(v ?? "").trim().toLowerCase();
  // your “under admin” positions
  const allowed = new Set(["branch_manager", "supervisor", "data_registerer"]);
  return allowed.has(p) ? p : null;
}

function pickField(row, keys) {
  for (const k of keys) {
    if (row[k] != null && String(row[k]).trim() !== "") return row[k];
  }
  return "";
}

function loadCsvUsers(csvPath) {
  const raw = fs.readFileSync(csvPath, "utf8");

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    trim: true,
  });

  // Normalize column names (case/spacing tolerant)
  const normalized = records.map((r) => {
    const row = {};
    for (const [k, v] of Object.entries(r)) {
      row[String(k).trim().toLowerCase().replace(/\s+/g, "_")] = v;
    }
    return row;
  });

  const users = [];
  for (const row of normalized) {
    const email = normalizeEmail(pickField(row, ["email", "user_email", "username"]));
    if (!email) continue;

    const fullName = String(pickField(row, ["full_name", "name", "fullname"])).trim();
    const phone = String(pickField(row, ["phone", "mobile"])).trim();
    const branchLocation = String(pickField(row, ["branch_location", "branch", "location"])).trim();
    const department = String(pickField(row, ["department", "dept"])).trim();

    // role/position/status can be in different columns in your CSV
    const role = normalizeRole(pickField(row, ["role", "user_role"]));
    const status = normalizeStatus(pickField(row, ["status", "user_status"]));
    const position = normalizePosition(pickField(row, ["position", "pos"]));

    users.push({
      email,
      full_name: fullName,
      phone,
      branch_location: branchLocation,
      department,
      role,
      status,
      position,
    });
  }

  // Force super admin settings if present
  const superAdminEmail = normalizeEmail(env("SUPER_ADMIN_EMAIL", "md@britiumexpress.com"));
  const backupEmail = normalizeEmail(env("BACKUP_EMAIL_SUPER_ADMIN", "mgkyawwanna@gmail.com"));

  for (const u of users) {
    if (u.email === superAdminEmail) {
      u.role = "super_admin";
      u.status = "active";
      u.backup_email = backupEmail;
    }
  }

  return users;
}

function initFirebase() {
  const serviceAccountPath = requireEnv("FIREBASE_SERVICE_ACCOUNT_PATH");
  const abs = path.resolve(serviceAccountPath);
  if (!fs.existsSync(abs)) throw new Error(`Service account JSON not found: ${abs}`);

  const serviceAccount = JSON.parse(fs.readFileSync(abs, "utf8"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return {
    auth: admin.auth(),
    db: admin.firestore(),
  };
}

async function upsertAuthUser(auth, email, password, disabled) {
  try {
    const existing = await auth.getUserByEmail(email);
    const updated = await auth.updateUser(existing.uid, {
      password, // resets password every run (matches your requirement)
      disabled,
    });
    return { uid: updated.uid, op: "updated" };
  } catch (err) {
    if (String(err?.code ?? "").includes("auth/user-not-found")) {
      const created = await auth.createUser({
        email,
        password,
        emailVerified: true, // avoids email verification blocker for ops accounts
        disabled,
      });
      return { uid: created.uid, op: "created" };
    }
    throw err;
  }
}

async function upsertFirestoreUser(db, uid, payload) {
  await db.collection("users").doc(uid).set(payload, { merge: true });
}

async function purgeUsersNotInCsv(auth, allowedEmailsSet) {
  const purge = env("PURGE") === "1";
  if (!purge) return { purged: 0 };

  if (env("PURGE_CONFIRM") !== "YES") {
    throw new Error('PURGE is enabled but PURGE_CONFIRM is not "YES". Refusing to delete users.');
  }

  const domain = String(env("PURGE_DOMAIN", "britiumexpress.com")).toLowerCase();
  let nextPageToken = undefined;
  let purged = 0;

  do {
    const res = await auth.listUsers(1000, nextPageToken);
    nextPageToken = res.pageToken;

    for (const u of res.users) {
      const email = normalizeEmail(u.email);
      if (!email) continue;
      if (!email.endsWith(`@${domain}`)) continue;

      if (!allowedEmailsSet.has(email)) {
        await auth.deleteUser(u.uid);
        purged += 1;
        console.log(`Purged Firebase Auth user: ${email} uid=${u.uid}`);
      }
    }
  } while (nextPageToken);

  return { purged };
}

async function main() {
  const csvPath = requireEnv("USERS_CSV_PATH");
  const password = env("DEFAULT_PASSWORD", "P@ssw0rd1");
  const dryRun = env("DRY_RUN") === "1";

  const users = loadCsvUsers(csvPath);
  if (users.length === 0) throw new Error("No users found in CSV (check header names like email/role/status).");

  const allowedEmails = new Set(users.map((u) => u.email));

  const { auth, db } = initFirebase();

  if (!dryRun) {
    const purgeRes = await purgeUsersNotInCsv(auth, allowedEmails);
    if (purgeRes.purged) console.log(`Purge complete. purged=${purgeRes.purged}`);
  } else {
    console.log("DRY_RUN=1 (no writes, no purge).");
  }

  let ok = 0;
  let failed = 0;

  for (const u of users) {
    const disabled = u.status !== "active";

    const firestorePayload = {
      email: u.email,
      full_name: u.full_name ?? "",
      phone: u.phone ?? "",
      role: u.role,
      status: u.status,
      branch_location: u.branch_location ?? "",
      department: u.department ?? "",
      position: u.position ?? null, // for branch_manager/supervisor/data_registerer
      force_password_change: true,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (u.backup_email) firestorePayload.backup_email = u.backup_email;

    try {
      console.log(`Syncing: ${u.email} role=${u.role} status=${u.status} pos=${u.position ?? ""}`);

      if (dryRun) {
        ok += 1;
        continue;
      }

      const { uid, op } = await upsertAuthUser(auth, u.email, password, disabled);

      // Ensure Firestore user doc is keyed by Firebase UID (so rules work)
      await upsertFirestoreUser(db, uid, {
        ...firestorePayload,
        firebase_uid: uid,
        last_login_at: null,
      });

      console.log(`${op.toUpperCase()}: ${u.email} uid=${uid}`);
      ok += 1;
    } catch (e) {
      console.error(`FAILED: ${u.email}`, e?.message ?? e);
      failed += 1;
    }
  }

  console.log(`Done. ok=${ok}, failed=${failed}, default_password=${password}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
