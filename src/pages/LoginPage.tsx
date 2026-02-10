// src/pages/LoginPage.tsx
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { IMAGES } from "@/assets/images";
import { ROUTE_PATHS, USER_ROLES } from "@/lib/index";

import { supabase } from "@/lib/supabaseClient";
import { authLogin } from "@/lib/authApi";

type RoleOption = { value: string; label: string };

function pickSafeRedirect(fromPath: string | undefined, uiRole: string | undefined): string {
  if (fromPath && typeof fromPath === "string" && fromPath.startsWith("/")) return fromPath;

  switch ((uiRole || "").toLowerCase()) {
    case "super_admin":
    case "admin":
      return ROUTE_PATHS.ADMIN_DASHBOARD ?? "/admin";
    case "warehouse":
      return ROUTE_PATHS.WAREHOUSE_DASHBOARD ?? "/warehouse";
    case "dispatch":
      return ROUTE_PATHS.DISPATCH_DASHBOARD ?? "/dispatch";
    case "customer_service":
      return ROUTE_PATHS.CS_DASHBOARD ?? "/customer-service";
    case "accountant":
      return ROUTE_PATHS.ACCOUNTING_DASHBOARD ?? "/accounting";
    default:
      return ROUTE_PATHS.RIDER_DASHBOARD ?? "/rider";
  }
}

function normalizeRoleOptions(input: unknown): RoleOption[] {
  if (Array.isArray(input)) {
    if (input.length === 0) return [];
    if (typeof input[0] === "string") return (input as string[]).map((v) => ({ value: v, label: v }));
    return (input as RoleOption[]).filter((x) => x && typeof x.value === "string" && typeof x.label === "string");
  }
  if (input && typeof input === "object") {
    const vals = Object.values(input as Record<string, unknown>);
    if (vals.every((v) => typeof v === "string")) return (vals as string[]).map((v) => ({ value: v, label: v }));
  }
  return [];
}

type LoginForm = { email: string; password: string; role: string };
type SignupForm = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: string;
  department: string;
  branchLocation: string;
};
type ForgotForm = { email: string };

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname as string | undefined;

  const roleOptions = useMemo<RoleOption[]>(() => normalizeRoleOptions(USER_ROLES), []);

  const [activeTab, setActiveTab] = useState<"login" | "signup" | "forgot">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginData, setLoginData] = useState<LoginForm>({ email: "", password: "", role: "" });
  const [signupData, setSignupData] = useState<SignupForm>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    branchLocation: "",
  });
  const [forgotPasswordData, setForgotPasswordData] = useState<ForgotForm>({ email: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const email = loginData.email.trim().toLowerCase();
      const password = loginData.password;
      if (!email || !password) throw new Error("Email and password are required.");

      // send role directly (rider/admin/super_admin/warehouse/etc) OR omit it
      const requestedRole = loginData.role ? loginData.role.trim().toLowerCase() : undefined;

      const { user, session } = await authLogin({ email, password, role: requestedRole });

      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      const { data: profile, error: profileErr } = await supabase
        .from("user_profiles")
        .select("role, status, position, must_change_password")
        .eq("id", user.id)
        .maybeSingle();

      if (profileErr) throw new Error(profileErr.message);

      const uiRole = (profile?.role ?? requestedRole ?? "rider").toString().toLowerCase();

      localStorage.setItem(
        "britium_user",
        JSON.stringify({
          id: user.id,
          email: user.email,
          role: uiRole,
          status: profile?.status ?? "active",
          position: profile?.position ?? null,
          must_change_password: profile?.must_change_password ?? false,
        }),
      );

      // Optional: force password change flow
      if (profile?.must_change_password) {
        setSuccess("Login OK. You must change your password now.");
        setTimeout(() => navigate("/reset-password", { replace: true }), 400);
        return;
      }

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate(pickSafeRedirect(from, uiRole), { replace: true }), 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const email = signupData.email.trim().toLowerCase();
      if (!email) throw new Error("Email is required.");
      if (signupData.password.length < 8) throw new Error("Password must be at least 8 characters long.");
      if (signupData.password !== signupData.confirmPassword) throw new Error("Passwords do not match.");

      const role = signupData.role ? signupData.role.trim().toLowerCase() : "rider";

      const { data, error } = await supabase.auth.signUp({
        email,
        password: signupData.password,
        options: {
          data: {
            role,
            full_name: signupData.fullName,
            phone: signupData.phone,
            department: signupData.department,
            branch_location: signupData.branchLocation,
          },
        },
      });

      if (error) throw new Error(error.message);

      setSuccess(!data.session ? "Sign up successful. Please check your email to confirm." : "Sign up successful. You can login now.");

      setSignupData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: "",
        branchLocation: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const email = forgotPasswordData.email.trim().toLowerCase();
      if (!email) throw new Error("Email is required.");

      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw new Error(error.message);

      setSuccess("Password reset email sent. Please check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-space-navy">
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-20" />
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="particle bg-electric-500"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 10 + 8}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div className="text-center lg:text-left" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8">
              <img
                src={IMAGES?.BRITIUM_LOGO_55 ?? "/images/britium-logo.png"}
                alt="Britium Express"
                className="w-20 h-20 mx-auto lg:mx-0 mb-6 rounded-2xl bg-gradient-to-br from-electric-500/20 to-neon-purple/20 p-3"
              />
              <h1 className="text-5xl font-cyber gradient-text mb-4">ACCESS PORTAL</h1>
              <p className="text-xl text-electric-300 font-modern">Secure login to your dashboard</p>
            </div>
          </motion.div>

          <motion.div className="cyber-card p-8" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between bg-deep-blue/40 rounded-2xl p-2 mb-6">
              <button type="button" onClick={() => setActiveTab("login")} className={`flex-1 py-3 rounded-xl font-cyber transition ${activeTab === "login" ? "bg-white text-space-navy" : "text-electric-200 hover:text-white"}`}>
                Login
              </button>
              <button type="button" onClick={() => setActiveTab("signup")} className={`flex-1 py-3 rounded-xl font-cyber transition ${activeTab === "signup" ? "bg-white text-space-navy" : "text-electric-200 hover:text-white"}`}>
                Sign Up
              </button>
              <button type="button" onClick={() => setActiveTab("forgot")} className={`flex-1 py-3 rounded-xl font-cyber transition ${activeTab === "forgot" ? "bg-white text-space-navy" : "text-electric-200 hover:text-white"}`}>
                Forgot
              </button>
            </div>

            {error && (
              <Alert className="mb-4 border-destructive/30 bg-destructive/10">
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 border-emerald-400/30 bg-emerald-500/10">
                <AlertDescription className="text-emerald-200">{success}</AlertDescription>
              </Alert>
            )}

            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-electric-200 font-modern mb-2">Email Address</label>
                  <input className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={loginData.email} onChange={(e) => setLoginData((s) => ({ ...s, email: e.target.value }))} placeholder="you@company.com" autoComplete="email" />
                </div>

                <div>
                  <label className="block text-electric-200 font-modern mb-2">Password</label>
                  <input type="password" className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={loginData.password} onChange={(e) => setLoginData((s) => ({ ...s, password: e.target.value }))} placeholder="••••••••" autoComplete="current-password" />
                </div>

                <div>
                  <label className="block text-electric-200 font-modern mb-2">Select Role (Optional)</label>
                  <select className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={loginData.role} onChange={(e) => setLoginData((s) => ({ ...s, role: e.target.value }))}>
                    <option value="" className="text-black">No role check</option>
                    {roleOptions.map((r) => (
                      <option key={r.value} value={r.value} className="text-black">
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-4 rounded-2xl font-cyber bg-gradient-to-r from-holographic-pink to-plasma-orange text-white disabled:opacity-60">
                  {isLoading ? "Signing in..." : "Login"}
                </button>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label className="block text-electric-200 font-modern mb-2">Full Name</label>
                  <input className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={signupData.fullName} onChange={(e) => setSignupData((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full name" />
                </div>

                <div>
                  <label className="block text-electric-200 font-modern mb-2">Email Address</label>
                  <input className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={signupData.email} onChange={(e) => setSignupData((s) => ({ ...s, email: e.target.value }))} placeholder="you@company.com" autoComplete="email" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-electric-200 font-modern mb-2">Password</label>
                    <input type="password" className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={signupData.password} onChange={(e) => setSignupData((s) => ({ ...s, password: e.target.value }))} autoComplete="new-password" />
                  </div>
                  <div>
                    <label className="block text-electric-200 font-modern mb-2">Confirm Password</label>
                    <input type="password" className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={signupData.confirmPassword} onChange={(e) => setSignupData((s) => ({ ...s, confirmPassword: e.target.value }))} autoComplete="new-password" />
                  </div>
                </div>

                <div>
                  <label className="block text-electric-200 font-modern mb-2">Role</label>
                  <select className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={signupData.role} onChange={(e) => setSignupData((s) => ({ ...s, role: e.target.value }))}>
                    <option value="" className="text-black">Select role</option>
                    {roleOptions.map((r) => (
                      <option key={r.value} value={r.value} className="text-black">
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-4 rounded-2xl font-cyber bg-gradient-to-r from-electric-500 to-neon-purple text-white disabled:opacity-60">
                  {isLoading ? "Creating..." : "Create Account"}
                </button>
              </form>
            )}

            {activeTab === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div>
                  <label className="block text-electric-200 font-modern mb-2">Email Address</label>
                  <input className="w-full rounded-xl bg-white/10 border border-electric-500/20 px-4 py-3 text-white outline-none" value={forgotPasswordData.email} onChange={(e) => setForgotPasswordData({ email: e.target.value })} placeholder="you@company.com" autoComplete="email" />
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-4 rounded-2xl font-cyber bg-gradient-to-r from-holographic-pink to-plasma-orange text-white disabled:opacity-60">
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button type="button" onClick={() => navigate(ROUTE_PATHS.HOME ?? "/", { replace: true })} className="text-electric-300 hover:text-white font-modern">
                ← Back to Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
