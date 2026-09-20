"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createProfileServerAction(userId, formData) {
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  // Verify the currently authenticated user
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData?.user) {
    return { success: false, error: "Unauthorized" };
  }

  // Ensure the user is only updating their own profile
  if (authData.user.id !== userId) {
    return { success: false, error: "Forbidden: Cannot update another user's profile" };
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: formData.name,
    country: formData.country,
    governorate: formData.governorate,
    gender: formData.gender,
    phone: formData.phone,
  });

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  return { success: true };
}
