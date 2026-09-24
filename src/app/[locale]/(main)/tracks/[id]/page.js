import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import FreeEnrollButton from "@/components/courses/FreeEnrollButton";
import CourseCurriculum from "@/components/courses/CourseCurriculum";
import PromoVideoModal from "@/components/courses/PromoVideoModal";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: track } = await supabase.from("tracks").select("title_ar").eq("id", id).single();
  return { title: track ? `${track.title_ar} | تأهيل` : "المحتوى | تأهيل" };
}

export default async function TrackDetailsPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

  // Fetch track details with its program and instructor
  const { data: track, error } = await supabase
    .from("tracks")
    .select(`
      *,
      programs(title_ar),
      track_instructors(
        instructors(
          id,
          name,
          bio,
          avatar_url
        )
      )
    `)
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error || !track) {
    return notFound();
  }

  // Fetch sections and sessions for this track
  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("track_id", id)
    .order("order_index", { ascending: true });

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("track_id", id)
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  // Helper functions for Arabic pluralization
  const formatHours = (hours) => {
    if (hours === 0) return "0 ساعة";
    if (hours === 1) return "ساعة واحدة";
    if (hours === 2) return "ساعتين";
    if (hours >= 3 && hours <= 10) return `${hours} ساعات`;
    return `${hours} ساعة`;
  };

  const formatMinutes = (mins) => {
    if (mins === 0) return "";
    if (mins === 1) return "دقيقة واحدة";
    if (mins === 2) return "دقيقتين";
    if (mins >= 3 && mins <= 10) return `${mins} دقائق`;
    return `${mins} دقيقة`;
  };

  // Calculate total duration (Read directly from Admin panel as requested)
  let durationText = "0 ساعة";
  if (track.duration_weeks) {
    durationText = formatHours(track.duration_weeks);
  } else {
    // Fallback just in case
    const totalMinutes = sessions?.reduce((acc, curr) => acc + (curr.duration_min || 0), 0) || 0;
    if (totalMinutes > 0) {
      if (totalMinutes < 60) {
        durationText = formatMinutes(totalMinutes);
      } else {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        durationText = `${formatHours(hours)}${mins > 0 ? ` و ${formatMinutes(mins)}` : ''}`;
      }
    }
  }

  // Check if user is logged in to check enrollment status
  const { data: { user } } = await supabase.auth.getUser();
  let enrollmentStatus = null; 

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

  // Get the linked instructor
  const trackInstructor = track?.track_instructors?.[0]?.instructors;
  
  const instructor = trackInstructor ? {
    name: trackInstructor.name || "مدرب معتمد",
    role: trackInstructor.bio || "خبير استراتيجي ومدرب معتمد",
    image: trackInstructor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(trackInstructor.name)}&background=0b2646&color=fff`
  } : null;

  const isRtl = locale === "ar";

  const renderSidebarContent = () => (
    <div className="bg-white rounded-none shadow-none border border-slate-200 overflow-hidden">
      {/* Promo Video Area or Image */}
      {track.promo_video_url ? (
        <PromoVideoModal 
          videoUrl={track.promo_video_url} 
          imageUrl={track.image_url} 
          title={track.title_ar} 
        />
      ) : track.image_url ? (
        <div className="relative aspect-video bg-slate-100 flex items-center justify-center border-b border-slate-200">
          <img src={track.image_url} alt={track.title_ar} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative aspect-video bg-gradient-to-br from-[#0b2646] to-[#1a3a60]"></div>
      )}

      <div className="p-6 sm:p-8">
        <div className="space-y-4 mb-8">
          <h4 className="font-extrabold text-[#0b2646] text-sm">هذا المحتوى يشمل:</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="font-bold">المدة:</span> {durationText}
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span className="font-bold">عدد المحاضرات:</span> {sessions?.length || 0}
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              وصول كامل مدى الحياة
            </li>
            <li className="flex items-center gap-3 text-sm font-medium text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              شهادة إتمام معتمدة
            </li>
          </ul>
        </div>

        <hr className="my-6 border-gray-100" />

        <div className="text-center mb-6">
          <div className="text-2xl font-extrabold text-[#0b2646]">
            {track.price === 0 ? "مجاناً" : `${track.price} ج.م`}
          </div>
        </div>
        
        {!user ? (
          <div className="text-center">
            <Link href={`/${locale}/login?returnUrl=/${locale}/tracks/${id}`} className="block w-full bg-[#FBBC04] text-[#0b2646] text-center py-3 rounded-none font-bold hover:bg-[#e0a800] transition-all text-base shadow-none">
              تسجيل الدخول للاشتراك
            </Link>
          </div>
        ) : enrollmentStatus === 'approved' ? (
          <div className="text-center bg-white p-5 rounded-none">
            <h3 className="font-extrabold text-[#0b2646] mb-3">أنت مشترك في هذا المحتوى!</h3>
            <Link href={`/${locale}/journey`} className="block w-full bg-[#0b2646] text-white py-3 rounded-none font-bold hover:bg-[#081b33] transition-colors text-base shadow-none">
              إكمال التعلم &larr;
            </Link>
          </div>
        ) : enrollmentStatus === 'pending' ? (
          <div className="text-center bg-white border-none p-4 rounded-none">
            <h3 className="font-extrabold text-orange-800 mb-1">طلبك قيد المراجعة</h3>
            <p className="text-orange-600 text-xs font-medium">سيتم تفعيل حسابك فور التأكد من إيصال الدفع.</p>
          </div>
        ) : track.price === 0 ? (
          <FreeEnrollButton trackId={track.id} locale={locale} />
        ) : (
          <Link href={`/${locale}/tracks/${id}/enroll`} className="block w-full bg-[#FBBC04] text-[#0b2646] text-center py-3 rounded-none font-bold hover:bg-[#e0a800] transition-all text-base shadow-none">
            اشترك الآن
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-white relative pb-20" dir={isRtl ? "rtl" : "ltr"}>
      {/* Absolute Background to simulate Hero full-width band */}
      <div 
        className="absolute top-0 left-0 right-0 h-[500px] w-full border-b border-gray-100 z-0 overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(251, 188, 4, 0.05) 0%, #ffffff 100%)" }}
      >
        {/* Abstract Background shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FBBC04]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FBBC04]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 relative z-10">
        <Link href={`/${locale}/tracks`} className="inline-flex items-center gap-2 text-slate-500 hover:text-[#0b2646] mb-8 transition-colors text-sm font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          العودة للمحتوى
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-between">
          
          {/* Left Column (Hero Content + Syllabus) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-12">
            
            {/* Hero Content Area */}
            <div className="order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b2646] leading-[1.4] tracking-tight mb-4">
                {track.title_ar}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl">
                {track.description_ar}
              </p>
              
              {instructor && (
                <div className="flex flex-col gap-1 border-t border-gray-100 pt-6 mt-6">
                  <span className="text-slate-400 text-sm font-bold">المدرب</span>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="text-[#0b2646] font-extrabold text-lg">{instructor.name}</p>
                    {instructor.role && instructor.role !== "خبير استراتيجي ومدرب معتمد" && (
                      <span className="text-slate-500 text-sm font-medium">({instructor.role})</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE ONLY Sidebar */}
            <div className="order-2 lg:hidden w-full">
              {renderSidebarContent()}
            </div>

            {/* Bottom Section: Curriculum and Audience */}
            <div className="order-3 space-y-12">
              {/* Curriculum Accordion */}
              <div className="w-full">
                <CourseCurriculum sections={sections} sessions={sessions} type={track.type} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start mt-8">
                {/* What you will learn */}
                {track.what_you_will_learn && track.what_you_will_learn.length > 0 && (
                  <div className="space-y-6 w-full">
                    <h2 className="text-2xl font-extrabold text-[#0b2646]">ماذا ستتعلم في هذا المحتوى؟</h2>
                    <div className="grid grid-cols-1 gap-y-4">
                      {track.what_you_will_learn.map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" className="shrink-0 mt-0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          <span className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Target Audience */}
                {track.target_audience && track.target_audience.length > 0 && (
                  <div className="space-y-6 w-full">
                    <h2 className="text-2xl font-extrabold text-[#0b2646]">
                      لمن {track.type === 'track' ? 'هذا المسار' : 'هذه الدورة'}؟
                    </h2>
                    <div className="grid grid-cols-1 gap-y-4">
                      {track.target_audience.map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" className="shrink-0 mt-0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          <span className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - DESKTOP ONLY Sidebar */}
          <div className="hidden lg:block lg:w-[35%] lg:-mt-10">
            <div className="sticky top-28 z-20">
              {renderSidebarContent()}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
