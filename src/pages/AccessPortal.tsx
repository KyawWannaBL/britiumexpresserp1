import React from "react";
import { authLogin, sendPasswordReset } from "../lib/authApi";

type Tab = "login" | "signup" | "forgot";

export default function AccessPortal() {
  const [tab, setTab] = React.useState<Tab>("login");

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("Delivery Rider");

  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string>(""); // success info
  const [error, setError] = React.useState<string>(""); // error info

  function resetNotices() {
    setMessage("");
    setError("");
  }

  async function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetNotices();
    setBusy(true);
    try {
      await authLogin({ email, password, role });
      setMessage("Login successful.");
      // TODO: navigate to dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function onForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    resetNotices();
    setBusy(true);
    try {
      await sendPasswordReset(email.trim());
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 24 }}>
      <h1>Access Portal</h1>
      <p>Secure login to your dashboard</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <button
          type="button"
          onClick={() => {
            setTab("login");
            resetNotices();
          }}
          disabled={busy}
        >
          Login
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("signup");
            resetNotices();
          }}
          disabled={busy}
        >
          Sign Up
        </button>

        <button
          type="button"
          onClick={() => {
            setTab("forgot");
            resetNotices();
          }}
          disabled={busy}
        >
          Forgot
        </button>
      </div>

      {error ? (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#3b1020" }}>
          <strong style={{ color: "#ff8aa1" }}>{error}</strong>
        </div>
      ) : null}

      {message ? (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: "#0f2d22" }}>
          <strong style={{ color: "#71f0b2" }}>{message}</strong>
        </div>
      ) : null}

      {tab === "login" ? (
        <form onSubmit={onLoginSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <label>
            Email Address
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </label>

          <label>
            Select Role (Optional)
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option>Delivery Rider</option>
              <option>Admin</option>
              <option>Dispatcher</option>
              <option>Warehouse</option>
            </select>
          </label>

          <button type="submit" disabled={busy}>
            {busy ? "Signing in..." : "Access Dashboard"}
          </button>
        </form>
      ) : null}

      {tab === "forgot" ? (
        <form onSubmit={onForgotSubmit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <label>
            Email Address
            <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </label>

          {/* IMPORTANT: no default password hint, no role selection, no secrets */}
          <div style={{ fontSize: 14, opacity: 0.9 }}>
            Enter your email and we’ll send you a password reset link.
          </div>

          <button type="submit" disabled={busy || !email.trim()}>
            {busy ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      ) : null}

      {tab === "signup" ? (
        <div style={{ marginTop: 16 }}>
          <div>Sign up flow goes here.</div>
        </div>
      ) : null}
    </div>
  );
}

