"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAdminSupabase() {
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
  if (authError || !authData?.user) return { supabase: null, error: "Unauthorized" };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", authData.user.id)
    .single();

  if (profileError || profile?.role !== "admin" || !profile?.is_active) return { supabase: null, error: "Forbidden" };

  return { supabase, user: authData.user };
}

export async function createInstructor(formData) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: insertError } = await supabase
    .from("instructors")
    .insert([{
      name: formData.name,
      email: formData.email,
      bio: formData.bio
    }]);

  if (insertError) return { success: false, error: insertError.message };

  revalidatePath("/[locale]/admin/instructors", "page");
  return { success: true };
}

export async function updateInstructor(id, formData) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: updateError } = await supabase
    .from("instructors")
    .update({
      name: formData.name,
      email: formData.email,
      bio: formData.bio
    })
    .eq("id", id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/[locale]/admin/instructors", "page");
  revalidatePath("/[locale]/admin/instructors/[id]", "page");
  return { success: true };
}

export async function deleteInstructor(id) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: deleteError } = await supabase
    .from("instructors")
    .delete()
    .eq("id", id);

  if (deleteError) {
    if (deleteError.code === "23503") {
      return { success: false, error: "لا يمكن حذف هذا المدرب لأنه مرتبط بمسارات أو دورات تدريبية." };
    }
    return { success: false, error: deleteError.message };
  }

  revalidatePath("/[locale]/admin/instructors", "page");
  return { success: true };
}
