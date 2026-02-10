import React from "react";
import { supabase } from "../lib/supabaseClient";

export function ResetPasswordPage() {
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState("");
  const [err, setErr] = React.useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);
      setMsg("Password updated. You can login now.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      <h2>Reset Password</h2>

      {err ? <div style={{ marginTop: 12, color: "#ff8aa1" }}>{err}</div> : null}
      {msg ? <div style={{ marginTop: 12, color: "#71f0b2" }}>{msg}</div> : null}

      <form onSubmit={onSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
        <label>
          New Password
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
        </label>

        <button type="submit" disabled={busy || password.length < 8}>
          {busy ? "Updating..." : "Set New Password"}
        </button>
      </form>
    </div>
  );
}
