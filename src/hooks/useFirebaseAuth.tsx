import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  firebase_uid: string; // kept for compatibility (we’ll set it = id)
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  status: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  state?: string;
  language_preference: string;
  force_password_change: boolean; // mapped from must_change_password
  last_login_at?: string;
  created_at: string;
  permissions?: any[];
  branches?: any[];
  position?: string;
  branch_location?: string;
  backup_email?: string;
  must_change_password?: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: null; // Firebase removed
  loading: boolean;

  login: (email: string, password: string) => Promise<{
    success: boolean;
    user?: User;
    error?: string;
    force_password_change?: boolean;
  }>;

  register: (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => Promise<{ success: boolean; user?: User; error?: string }>;

  logout: () => Promise<void>;

  updateUserProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;

  isAuthorized: (roles: string[]) => boolean;
  hasPermission: (permission: string, resource: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

function mapProfileToUser(sbUser: SupabaseUser, profile: any | null): User {
  const role = profile?.role ?? "rider";
  const status = profile?.status ?? "active";
  const mustChange = Boolean(profile?.must_change_password ?? profile?.force_password_change ?? false);

  return {
    id: sbUser.id,
    firebase_uid: sbUser.id,
    email: sbUser.email ?? profile?.email ?? "",
    full_name: profile?.full_name ?? sbUser.user_metadata?.full_name ?? "",
    phone: profile?.phone ?? sbUser.user_metadata?.phone,
    role,
    status,
    avatar_url: profile?.avatar_url,
    address: profile?.address,
    city: profile?.city,
    state: profile?.state,
    language_preference: profile?.language_preference ?? "en",
    force_password_change: mustChange,
    must_change_password: mustChange,
    backup_email: profile?.backup_email,
    position: profile?.position ?? profile?.pos,
    branch_location: profile?.branch_location,
    last_login_at: profile?.last_login_at,
    created_at: profile?.created_at ?? new Date().toISOString(),
    permissions: profile?.permissions ?? [],
    branches: profile?.branches ?? [],
  };
}

async function fetchProfile(userId: string) {
  // your DB uses public.user_profiles
  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setFromSession = async (session: Session | null) => {
    if (!session?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const profile = await fetchProfile(session.user.id);
      const u = mapProfileToUser(session.user, profile);
      setUser(u);

      // optional: keep your existing localStorage usage consistent
      localStorage.setItem(
        "britium_user",
        JSON.stringify({
          id: u.id,
          email: u.email,
          role: u.role,
          status: u.status,
          position: u.position ?? null,
          branch_location: u.branch_location ?? null,
          must_change_password: u.must_change_password ?? false,
        })
      );
    } catch (e) {
      console.error("Failed to load profile:", e);
      // Still allow session to exist; set minimal user
      setUser({
        id: session.user.id,
        firebase_uid: session.user.id,
        email: session.user.email ?? "",
        full_name: "",
        role: "rider",
        status: "active",
        language_preference: "en",
        force_password_change: false,
        created_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      await setFromSession(data.session);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await setFromSession(session);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const login: AuthContextType["login"] = async (email, password) => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw new Error(error.message);
      if (!data.session?.user) throw new Error("Login failed: no session returned.");

      const profile = await fetchProfile(data.session.user.id);
      const u = mapProfileToUser(data.session.user, profile);
      setUser(u);

      toast({ title: "Login Successful", description: `Welcome back, ${u.full_name || u.email}!` });

      return { success: true, user: u, force_password_change: u.force_password_change };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Login failed";
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register: AuthContextType["register"] = async (email, password, fullName, phone) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { full_name: fullName, phone } },
      });
      if (error) throw new Error(error.message);

      // If email confirm enabled, session may be null
      return { success: true, user: data.user ? mapProfileToUser(data.user, null) : undefined };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("britium_user");
    setUser(null);
  };

  const updateUserProfile: AuthContextType["updateUserProfile"] = async (data) => {
    try {
      if (!user) return { success: false, error: "Not logged in" };
      const { error } = await supabase.from("user_profiles").update(data).eq("id", user.id);
      if (error) throw error;
      setUser((u) => (u ? { ...u, ...data } : u));
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : "Update failed" };
    }
  };

  const changePassword: AuthContextType["changePassword"] = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      // clear must-change flag
      if (user) {
        await supabase.from("user_profiles").update({ must_change_password: false }).eq("id", user.id);
        setUser((u) => (u ? { ...u, must_change_password: false, force_password_change: false } : u));
      }

      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : "Password change failed" };
    }
  };

  const resetPassword: AuthContextType["resetPassword"] = async (email) => {
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
      if (error) throw error;
      return { success: true };
    } catch (e) {
      return { success: false, error: e instanceof Error ? e.message : "Reset failed" };
    }
  };

  const isAuthorized = (roles: string[]) => {
    if (!user) return false;
    return user.role === "super_admin" || roles.includes(user.role);
  };

  const hasPermission = (_permission: string, _resource: string) => {
    // If you don’t have a permissions model yet, treat admin/super_admin as all-access
    if (!user) return false;
    return user.role === "super_admin" || user.role === "admin";
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      firebaseUser: null,
      loading,
      login,
      register,
      logout,
      updateUserProfile,
      changePassword,
      resetPassword,
      isAuthorized,
      hasPermission,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
