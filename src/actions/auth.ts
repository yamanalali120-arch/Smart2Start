"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Admin: Create a new user with username format vorname.nachname.brillee
 */
export async function createUser(formData: {
  email: string;
  username: string;
  displayName: string;
  role: "admin" | "learner";
}) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return { error: "Nicht authentifiziert." };
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Keine Admin-Berechtigung." };
  }

  // Use admin client to create user (bypasses RLS)
  const adminClient = createAdminClient();

  // Create auth user with temporary password
  const tempPassword = `Welcome_${Date.now().toString(36)}!`;
  const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
    email: formData.email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      username: formData.username,
      display_name: formData.displayName,
      role: formData.role,
    },
  });

  if (createError) {
    return { error: createError.message };
  }

  if (!newUser.user) {
    return { error: "Benutzer konnte nicht erstellt werden." };
  }

  // Send password reset email so user can set their own password
  const { error: resetError } = await adminClient.auth.admin.generateLink({
    type: "recovery",
    email: formData.email,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/set-password`,
    },
  });

  if (resetError) {
    console.error("Reset email error:", resetError);
  }

  revalidatePath("/admin/users");

  return {
    success: true,
    message: `Benutzer ${formData.username} wurde erstellt. Eine E-Mail zum Setzen des Passworts wurde gesendet.`,
    tempPassword,
  };
}

/**
 * Get all users (admin only)
 */
export async function getUsers() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Nicht authentifiziert.", data: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return { error: "Keine Admin-Berechtigung.", data: null };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { error: error.message, data: null };
  return { error: null, data };
}
