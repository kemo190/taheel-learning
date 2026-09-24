import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import EnrollmentForm from "@/components/courses/EnrollmentForm";
import Link from "next/link";

export const metadata = { title: "تأكيد الاشتراك | تأهيل" };

export default async function EnrollPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login?returnUrl=/${locale}/tracks/${id}/enroll`);

  // Fetch track details
  const { data: track, error } = await supabase
    .from("tracks")
    .select("id, title_ar, price")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !track) {
    return notFound();
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("status")
    .eq("student_id", user.id)
    .eq("track_id", id)
    .single();

  if (existingEnrollment) {
    // If already pending or approved, go back to track page
    redirect(`/${locale}/tracks/${id}`);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}/tracks/${id}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition-colors text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            تراجع عن الاشتراك
          </Link>
          <h1 className="text-3xl font-black text-[#0b2646] mb-2">تأكيد الاشتراك والدفع</h1>
          <p className="text-gray-600">أنت على وشك الاشتراك في مسار <span className="font-bold text-[#0b2646]">"{track.title_ar}"</span></p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-blue-900/5 border border-gray-100">
          <EnrollmentForm locale={locale} track={track} userId={user.id} />
        </div>

      </div>
    </div>
  );
}
