"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInFreeTrack(trackId, locale = "ar") {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify track is actually free
    const { data: track, error: trackError } = await supabase
      .from("tracks")
      .select("price")
      .eq("id", trackId)
      .single();

    if (trackError || !track) {
      return { success: false, error: "Track not found" };
    }

    if (track.price > 0) {
      return { success: false, error: "This track is not free" };
    }

    // Check if already enrolled
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id")
      .eq("student_id", user.id)
      .eq("track_id", trackId)
      .single();

    if (existing) {
      return { success: false, error: "Already enrolled" };
    }

    // Insert approved enrollment
    const { error: insertError } = await supabase
      .from("enrollments")
      .insert({
        student_id: user.id,
        track_id: trackId,
        status: "approved",
        amount_paid: 0,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    revalidatePath(`/${locale}/tracks/${trackId}`);
    revalidatePath(`/${locale}/journey`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
