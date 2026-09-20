import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CourseSidebar from "@/components/learn/CourseSidebar";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { trackId, locale } = resolvedParams;
  const supabase = await createClient();

  const { data: track } = await supabase
    .from("tracks")
    .select("title_ar, title_en")
    .eq("id", trackId)
    .single();

  return {
    title: track ? `${track.title_ar} | تأهيل التعلم` : "التعلم | تأهيل",
  };
}

export default async function LearnLayout({ children, params }) {
  const resolvedParams = await params;
  const { trackId, locale } = resolvedParams;
  const supabase = await createClient();

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // 2. Verify Enrollment (must be approved, or user must be admin)
  // Check if user is admin first
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  let isEnrolled = false;
  if (!isAdmin) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("status")
      .eq("student_id", user.id)
      .eq("track_id", trackId)
      .single();

    if (enrollment && enrollment.status === "approved") {
      isEnrolled = true;
    }
  } else {
    isEnrolled = true; // Admin has access
  }

  // If not enrolled and not admin, kick them out
  if (!isEnrolled) {
    redirect(`/${locale}/journey`);
  }

  // 3. Fetch Track Data and Sessions
  const { data: track } = await supabase
    .from("tracks")
    .select("id, title_ar, title_en")
    .eq("id", trackId)
    .single();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, title_ar, duration_min, order_index")
    .eq("track_id", trackId)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  const safeSessions = sessions || [];

  // 4. Fetch User Progress
  const { data: progress } = await supabase
    .from("student_progress")
    .select("session_id")
    .eq("student_id", user.id);

  // Filter progress to only include sessions in this track
  const sessionIds = safeSessions.map(s => s.id);
  const completedSessionIds = (progress || [])
    .map(p => p.session_id)
    .filter(id => sessionIds.includes(id));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-right" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar - Right aligned due to RTL */}
      <CourseSidebar 
        track={track}
        sessions={safeSessions}
        completedSessionIds={completedSessionIds}
        locale={locale}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full lg:w-auto">
        {children}
      </main>
    </div>
  );
}
