"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. First, we verify the current user is an admin using their normal session
async function verifyAdminAuth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch (error) {}
        },
      },
    }
  );

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) return { isAuthorized: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", authData.user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return { isAuthorized: false };
  }

  return { isAuthorized: true, user: authData.user };
}

// 2. Helper to get the Service Role Client (bypasses RLS)
function getServiceRoleSupabase() {
  // Ensure the key exists in .env.local
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.");
  }
  
  // Create client without cookies since we don't need a session for service role
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceKey,
    {
      cookies: {
        getAll() { return []; },
        setAll() { },
      },
    }
  );
}

export async function updateUserRole(userId, newRole) {
  // Check authorization first!
  const { isAuthorized } = await verifyAdminAuth();
  if (!isAuthorized) return { success: false, error: "Forbidden: You are not an active admin." };

  try {
    const supabaseAdmin = getServiceRoleSupabase();

    // Use the admin client to bypass the RLS and the Trigger limitations
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/[locale]/admin/students", "page");
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function toggleUserStatus(userId, isActive) {
  // Check authorization first!
  const { isAuthorized } = await verifyAdminAuth();
  if (!isAuthorized) return { success: false, error: "Forbidden: You are not an active admin." };

  try {
    const supabaseAdmin = getServiceRoleSupabase();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_active: isActive })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };

    revalidatePath("/[locale]/admin/students", "page");
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
