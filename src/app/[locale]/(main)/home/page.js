import React from "react";
import { getDictionary } from "@/dictionaries/getDictionary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserHomeClient from "@/components/home/UserHomeClient";

export const metadata = {
  title: "Home | Taheel",
  description: "Your personal learning dashboard",
};

export default async function UserHomePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login page
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch user profile if needed
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch all active tracks with their programs and instructors
  const { data: tracks } = await supabase
    .from("tracks")
    .select(`
      *,
      programs(id, title_ar, title_en),
      track_instructors(
        instructors(bio_ar)
      )
    `)
    .eq("is_active", true);

  const safeTracks = tracks || [];

  // Group by program (filtering by title instead of hardcoded IDs so it works dynamically)
  const aiTracks = safeTracks.filter(t => t.programs?.title_en === 'Artificial Intelligence' || t.programs?.title_ar === 'الذكاء الاصطناعي');
  const marketingTracks = safeTracks.filter(t => t.programs?.title_en === 'Marketing & Sales' || t.programs?.title_ar === 'التسويق والمبيعات');
  const generalTracks = safeTracks.filter(t => t.programs?.title_en === 'General Skills' || t.programs?.title_ar === 'مهارات عامة');

  // Favorites (Just display the top rated ones for now)
  const topTracks = [...safeTracks].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <main className="min-h-screen">
      <UserHomeClient
        dict={dict}
        locale={locale}
        user={user}
        profile={profile}
        aiTracks={aiTracks}
        marketingTracks={marketingTracks}
        topTracks={topTracks}
      />
    </main>
  );
}

