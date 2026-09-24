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
    .select("role")
    .eq("id", authData.user.id)
    .single();

  if (profileError || profile?.role !== "admin") return { supabase: null, error: "Forbidden" };

  return { supabase, user: authData.user };
}

export async function createSession(formData) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: insertError } = await supabase
    .from("sessions")
    .insert([{
      title_ar: formData.title_ar,
      track_id: formData.track_id,
      type: formData.type,
      content_type: formData.content_type || 'video',
      section_id: formData.section_id || null,
      is_preview: formData.is_preview || false,
      duration_min: formData.duration_min,
      is_active: formData.is_active,
      order_index: formData.order_index,
      video_url: formData.video_url || null,
      pdf_url: formData.pdf_url || null,
      text_content: formData.text_content || null
    }]);

  if (insertError) return { success: false, error: insertError.message };

  revalidatePath("/[locale]/admin/sessions", "page");
  return { success: true };
}

export async function updateSession(id, formData) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: updateError } = await supabase
    .from("sessions")
    .update({
      title_ar: formData.title_ar,
      track_id: formData.track_id,
      type: formData.type,
      content_type: formData.content_type || 'video',
      section_id: formData.section_id || null,
      is_preview: formData.is_preview || false,
      duration_min: formData.duration_min,
      is_active: formData.is_active,
      order_index: formData.order_index,
      video_url: formData.video_url || null,
      pdf_url: formData.pdf_url || null,
      text_content: formData.text_content || null
    })
    .eq("id", id);

  if (updateError) return { success: false, error: updateError.message };

  return { success: true };
}

export async function deleteSession(id) {
  const { supabase, error } = await getAdminSupabase();
  if (error) return { success: false, error };

  const { error: deleteError } = await supabase
    .from("sessions")
    .delete()
    .eq("id", id);

  if (deleteError) return { success: false, error: deleteError.message };

  return { success: true };
}
