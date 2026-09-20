"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateEnrollmentStatus(enrollmentId, status, notes = "") {
  // Initialize Supabase server client
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {
            // Ignored if called from a Server Component
          }
        },
      },
    }
  );

  // 1. Verify the currently authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { success: false, error: "Unauthorized: You must be logged in." };
  }

  // 2. SECURITY CHECK: Verify the user is an admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    return { success: false, error: "Forbidden: Only admins can perform this action." };
  }

  // 3. Perform the update
  const updatePayload = {
    status: status, // 'approved', 'rejected', etc.
    notes: notes,
    updated_at: new Date().toISOString(),
  };

  if (status === "approved") {
    updatePayload.approved_at = new Date().toISOString();
    updatePayload.approved_by = authData.user.id;
  }

  const { error: updateError } = await supabase
    .from("enrollments")
    .update(updatePayload)
    .eq("id", enrollmentId);

  if (updateError) {
    return { success: false, error: updateError.message };
  }

  // Refresh the UI cache for the enrollments page
  revalidatePath("/[locale]/admin/enrollments", "page");

  return { success: true };
}
