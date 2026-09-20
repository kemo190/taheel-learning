import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import FreeEnrollButton from "@/components/journey/FreeEnrollButton";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: track } = await supabase.from("tracks").select("title_ar").eq("id", id).single();
  return { title: track ? `${track.title_ar} | تأهيل` : "المسار | تأهيل" };
}

export default async function TrackDetailsPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

  // Fetch track details with its program
  const { data: track, error } = await supabase
    .from("tracks")
    .select("*, programs(title_ar)")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !track) {
    return notFound();
  }

  // Fetch sessions for this track
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("track_id", id)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  // Check if user is logged in to check enrollment status
  const { data: { user } } = await supabase.auth.getUser();
  let enrollmentStatus = null; // null = not enrolled, 'pending' = waiting, 'approved' = enrolled

  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("status")
      .eq("student_id", user.id)
      .eq("track_id", id)
      .single();
    
    if (enrollment) {
      enrollmentStatus = enrollment.status;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-[#0b2646] text-white pt-20 pb-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href={`/${locale}/tracks`} className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-8 transition-colors text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            العودة للمسارات
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {track.programs?.title_ar || "مسار عام"}
                </span>
                <span className="bg-white/10 text-white border border-white/20 text-xs font-bold px-3 py-1 rounded-full">
                  {track.level === "beginner" ? "مبتدئ" : track.level === "intermediate" ? "متوسط" : "متقدم"}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                {track.title_ar}
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed mb-6">
                {track.description_ar}
              </p>
              
              <div className="flex items-center gap-6 text-sm font-medium text-blue-200">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {track.duration_weeks ? `${track.duration_weeks} أسابيع` : "غير محدد"}
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  {sessions?.length || 0} جلسات
                </div>
              </div>
            </div>

            {/* Floating Action Card */}
            <div className="bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-gray-900 w-full md:w-80 shrink-0 md:translate-y-8">
              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <p className="text-gray-500 text-sm font-medium mb-1">استثمارك في مستقبلك</p>
                <div className="text-4xl font-black text-[#0b2646]">
                  {track.price === 0 ? "مجاناً" : `${track.price} ج.م`}
                </div>
              </div>
              
              {!user ? (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">يجب تسجيل الدخول للتمكن من الاشتراك في المسار.</p>
                  <Link href={`/${locale}/login?returnUrl=/${locale}/tracks/${id}`} className="block w-full bg-[#0b2646] text-white text-center py-3.5 rounded-xl font-bold hover:bg-[#081b33] transition-colors">
                    تسجيل الدخول للاشتراك
                  </Link>
                </div>
              ) : enrollmentStatus === 'approved' ? (
                <div className="text-center bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="font-bold text-emerald-800 mb-1">أنت مشترك في هذا المسار!</h3>
                  <Link href={`/${locale}/journey`} className="text-emerald-600 text-sm font-semibold hover:underline">
                    الذهاب إلى رحلتي &larr;
                  </Link>
                </div>
              ) : enrollmentStatus === 'pending' ? (
                <div className="text-center bg-orange-50 border border-orange-100 p-4 rounded-xl">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <h3 className="font-bold text-orange-800 mb-1">طلبك قيد المراجعة</h3>
                  <p className="text-orange-600 text-xs">سيتم تفعيل حسابك فور التأكد من إيصال الدفع.</p>
                </div>
              ) : track.price === 0 ? (
                <FreeEnrollButton trackId={track.id} locale={locale} />
              ) : (
                <Link href={`/${locale}/tracks/${id}/enroll`} className="block w-full bg-blue-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5">
                  اشترك الآن
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Content (Syllabus) */}
          <div className="md:col-span-2 space-y-12">
            
            {/* Syllabus */}
            <div>
              <h2 className="text-2xl font-bold text-[#0b2646] mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                </div>
                محتوى المسار (Syllabus)
              </h2>
              
              {!sessions || sessions.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center">
                  <p className="text-gray-500">لم يتم إضافة جلسات لهذا المسار بعد.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div key={session.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center font-black text-gray-400 shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{session.title_ar}</h4>
                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                          <span className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {session.duration_min} دقيقة
                          </span>
                          <span className="flex items-center gap-1">
                            {session.type === 'live' ? '🔴 بث مباشر' : session.type === 'hybrid' ? 'مدمج' : '📼 مسجلة'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-6">
              <h3 className="font-bold text-[#0b2646] mb-4">ماذا ستتعلم؟</h3>
              <ul className="space-y-3">
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" className="shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-gray-600 text-sm">فهم المبادئ الأساسية في {track.title_ar}</span>
                </li>
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" className="shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-gray-600 text-sm">التطبيق العملي من خلال مشاريع حقيقية</span>
                </li>
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" className="shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-gray-600 text-sm">الحصول على شهادة معتمدة بعد الإتمام</span>
                </li>
                <li className="flex gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" className="shrink-0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-gray-600 text-sm">تفعيل حساب التوظيف للتقديم على الشركات</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
