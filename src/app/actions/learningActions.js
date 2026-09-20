"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Marks a specific session as completed for the authenticated student.
 */
export async function markSessionComplete(sessionId, trackId, locale = "ar") {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify enrollment
    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .select("status")
      .eq("student_id", user.id)
      .eq("track_id", trackId)
      .single();

    if (enrollError || !enrollment || enrollment.status !== "approved") {
      return { success: false, error: "Not enrolled or not approved" };
    }

    // Insert into student_progress
    const { error: progressError } = await supabase
      .from("student_progress")
      .insert({
        student_id: user.id,
        session_id: sessionId,
      });

    if (progressError && progressError.code !== "23505") { // Ignore unique violation (already marked)
      console.error("Error marking session complete:", progressError);
      return { success: false, error: progressError.message };
    }

    revalidatePath(`/${locale}/learn/${trackId}`);
    revalidatePath(`/${locale}/journey`);
    return { success: true };
  } catch (error) {
    console.error("markSessionComplete error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Unmarks a specific session as completed.
 */
export async function unmarkSessionComplete(sessionId, trackId, locale = "ar") {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("student_progress")
      .delete()
      .eq("student_id", user.id)
      .eq("session_id", sessionId);

    if (error) {
      console.error("Error unmarking session complete:", error);
      return { success: false, error: error.message };
    }

    revalidatePath(`/${locale}/learn/${trackId}`);
    revalidatePath(`/${locale}/journey`);
    return { success: true };
  } catch (error) {
    console.error("unmarkSessionComplete error:", error);
    return { success: false, error: error.message };
  }
}
