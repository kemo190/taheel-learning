import { getDictionary } from "@/dictionaries/getDictionary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AccountDashboardClient from "@/components/profile/AccountDashboardClient";

export const metadata = {
  title: "حسابي | Taheel",
  description: "Your unified account dashboard",
};

export default async function ProfilePage({ params, searchParams }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const resolvedSearchParams = await searchParams;
  const initialTab = resolvedSearchParams?.tab || "tracks";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch the profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch student enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      *,
      tracks (
        id, title_ar, image_url, delivery_mode, price, rating, learners_count, original_price,
        programs (title_ar),
        track_instructors (
          instructors (bio)
        )
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "approved");

  const safeEnrollments = enrollments || [];

  // Map to UI format and fetch progress for each
  const allEnrolledCourses = await Promise.all(safeEnrollments.map(async (enroll) => {
    const t = enroll.tracks;
    
    // Calculate progress percentage
    const { data: progress } = await supabase.rpc("get_track_completion", {
      p_student_id: user.id,
      p_track_id: t.id,
    });

    let instructorName = "تأهيل";
    if (t?.track_instructors?.[0]?.instructors?.bio) {
      instructorName = t.track_instructors[0].instructors.bio.split("-")[0].trim();
    }

    return {
      id: t?.id,
      title: t?.title_ar,
      progress: progress || 0,
      imageSrc: t?.image_url || '/hero-student.jpg',
      type: t?.delivery_mode === 'live' ? 'بث مباشر' : t?.delivery_mode === 'hybrid' ? 'مدمج' : 'مسجل تفاعلي',
      instructor: instructorName
    };
  }));

  const inProgressCourses = allEnrolledCourses.filter(c => c.progress < 100);
  const completedCourses = allEnrolledCourses.filter(c => c.progress === 100);

  // Fetch favorites
  const { data: favoriteRecords } = await supabase
    .from("favorites")
    .select(`
      tracks (
        id, title_ar, image_url, delivery_mode, price, rating,
        track_instructors(instructors(bio))
      )
    `)
    .eq("student_id", user.id);

  const favoriteCourses = (favoriteRecords || []).map(f => {
    const t = f.tracks;
    if (!t) return null;
    let instructorName = "تأهيل";
    if (t.track_instructors?.[0]?.instructors?.bio) {
      instructorName = t.track_instructors[0].instructors.bio.split("-")[0].trim();
    }
    return {
      id: t.id,
      title: t.title_ar,
      instructor: instructorName,
      rating: t.rating || 0,
      price: t.price || 0,
      imageSrc: t.image_url || '/hero-student.jpg',
      type: t.delivery_mode === 'live' ? 'بث مباشر' : t.delivery_mode === 'hybrid' ? 'مدمج' : 'مسجل تفاعلي',
    };
  }).filter(Boolean);

  // Dummy certificates for now (can map from DB later)
  const certificates = [];

  return (
    <AccountDashboardClient 
      locale={locale} 
      dict={dict} 
      user={user} 
      profile={profile}
      initialTab={initialTab}
      inProgressCourses={inProgressCourses}
      completedCourses={completedCourses}
      favoriteCourses={favoriteCourses}
      certificates={certificates}
    />
  );
}
