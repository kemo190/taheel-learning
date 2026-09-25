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

export async function createSection(formData) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: insertError } = await supabase
    .from("sections")
    .insert([{
      title_ar: formData.title_ar,
      track_id: formData.track_id,
      order_index: formData.order_index || 0,
    }]);

  if (insertError) return { success: false, error: insertError.message };

  revalidatePath("/[locale]/admin/tracks/[id]", "page");
  return { success: true };
}

export async function updateSection(id, formData) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: updateError } = await supabase
    .from("sections")
    .update({
      title_ar: formData.title_ar,
      order_index: formData.order_index || 0,
    })
    .eq("id", id);

  if (updateError) return { success: false, error: updateError.message };

  revalidatePath("/[locale]/admin/tracks/[id]", "page");
  return { success: true };
}

export async function deleteSection(id) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: deleteError } = await supabase
    .from("sections")
    .delete()
    .eq("id", id);

  if (deleteError) return { success: false, error: deleteError.message };

  revalidatePath("/[locale]/admin/tracks/[id]", "page");
  return { success: true };
}
