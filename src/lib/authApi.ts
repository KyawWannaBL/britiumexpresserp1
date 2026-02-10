import { supabase } from "@/lib/supabaseClient";

export type AuthLoginInput = {
  email: string;
  password: string;
  role?: string; // optional role check against user_profiles.role
};

export async function authLogin({ email, password, role }: AuthLoginInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw new Error(error.message);
  if (!data.user || !data.session) throw new Error("Login failed: no session returned.");

  // OPTIONAL: client-side role check (matches your provisioning roles like: rider/admin/super_admin/warehouse/...)
  if (role) {
    const { data: profile, error: pErr } = await supabase
      .from("user_profiles") // <-- your real table
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();

    if (pErr) throw new Error(pErr.message);

    if (profile?.role && profile.role !== role) {
      await supabase.auth.signOut();
      throw new Error("Selected role does not match your account role.");
    }
  }

  return { user: data.user, session: data.session };
}
