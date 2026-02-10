// File: src/lib/passwordReset.ts
import { supabase } from "./supabaseClient";

export async function sendPasswordResetEmail(email: string) {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
}
