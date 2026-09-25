import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import FreeEnrollButton from "@/components/courses/FreeEnrollButton";
import CourseCurriculum from "@/components/courses/CourseCurriculum";
import PromoVideoModal from "@/components/courses/PromoVideoModal";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: track } = await supabase.from("tracks").select("title_ar").eq("id", id).single();
  return { title: track ? `${track.title_ar} | تأهيل` : "المحتوى | تأهيل" };
}

export default async function TrackDetailsPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

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

  if (error || !track) return notFound();

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

  let durationText = "0 ساعة";
  if (track.duration_weeks) {
    durationText = formatHours(track.duration_weeks);
  } else {
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

  const { data: { user } } = await supabase.auth.getUser();
  let enrollmentStatus = null; 

  if (user) {
    const { data: enrollment } = await supabase
      .from("enrollments")
      .select("status")
      .eq("student_id", user.id)
      .eq("track_id", id)
      .single();
    if (enrollment) enrollmentStatus = enrollment.status;
  }

  const trackInstructor = track?.track_instructors?.[0]?.instructors;
  const instructor = trackInstructor ? {
    name: trackInstructor.name || "مدرب معتمد",
    role: "مدرب معتمد",
    bio: trackInstructor.bio,
    image: trackInstructor.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(trackInstructor.name)}&background=0b2646&color=fff`
  } : null;

  const isRtl = locale === "ar";

  const renderSidebarContent = () => (
    <div className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col">
      {track.promo_video_url ? (
        <PromoVideoModal videoUrl={track.promo_video_url} imageUrl={track.image_url} title={track.title_ar} />
      ) : track.image_url ? (
        <div className="relative aspect-video bg-slate-50 border-b border-slate-200 flex items-center justify-center">
          <Image src={track.image_url} alt={track.title_ar} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="relative aspect-video bg-[#0b2646]"></div>
      )}

      <div className="p-5 flex flex-col gap-4">
        <div className="text-3xl font-black text-[#0b2646] flex items-baseline gap-1.5">
          {track.price === 0 ? "مجاناً" : (
            <>
              {track.price} <span className="text-lg font-bold text-slate-500">ج.م</span>
            </>
          )}
        </div>
        
        {!user ? (
          <Link href={`/${locale}/login?returnUrl=/${locale}/tracks/${id}`} className="flex items-center justify-center w-full bg-[#FBBC04] text-[#0b2646] py-3 rounded-none font-black hover:bg-[#e0a800] transition-colors text-base border-2 border-[#FBBC04]">
            تسجيل الدخول للاشتراك
          </Link>
        ) : enrollmentStatus === 'approved' ? (
          <div className="flex flex-col gap-2.5">
            <div className="bg-transparent border border-slate-200 p-2.5 text-center">
              <span className="font-extrabold text-[#0b2646] text-[13px]">أنت مشترك في هذا المحتوى</span>
            </div>
            <Link href={`/${locale}/journey`} className="flex items-center justify-center w-full bg-[#0b2646] text-white py-3 rounded-none font-bold hover:bg-[#081b33] transition-colors text-base">
              إكمال التعلم &larr;
            </Link>
          </div>
        ) : enrollmentStatus === 'pending' ? (
          <div className="bg-orange-50 border border-orange-200 p-3 text-center">
            <h3 className="font-extrabold text-orange-800 text-[13px] mb-0.5">طلبك قيد المراجعة</h3>
            <p className="text-orange-600 text-[11px] font-medium leading-tight">سيتم تفعيل حسابك فور التأكد من إيصال الدفع.</p>
          </div>
        ) : track.price === 0 ? (
          <FreeEnrollButton trackId={track.id} locale={locale} />
        ) : (
          <Link href={`/${locale}/tracks/${id}/enroll`} className="flex items-center justify-center w-full bg-[#FBBC04] text-[#0b2646] py-3 rounded-none font-black hover:bg-[#e0a800] transition-colors text-base border-2 border-[#FBBC04]">
            اشترك الآن
          </Link>
        )}
        
        <div className="space-y-3 pt-4 mt-1 border-t border-slate-100">
          <h4 className="font-bold text-[#0b2646] text-[13px]">هذا المحتوى يشمل:</h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2.5 text-[13.5px] font-medium text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b2646" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>وصول كامل مدى الحياة</span>
            </li>
            <li className="flex items-center gap-2.5 text-[13.5px] font-medium text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b2646" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>شهادة إتمام معتمدة</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-transparent" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* HEADER SECTION (LIGHT WARM THEME) */}
      <div className="pt-6 pb-8 lg:py-10 bg-gradient-to-b from-[#fff8db] to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            <div className="w-full lg:w-[60%] flex flex-col gap-5">
              
              {/* Breadcrumbs */}
              <nav className="flex text-sm text-slate-500 font-medium gap-2 items-center">
                <Link href={`/${locale}`} className="hover:text-[#0b2646] transition-colors">الرئيسية</Link>
                <span className="text-slate-400">/</span>
                <Link href={`/${locale}/tracks`} className="hover:text-[#0b2646] transition-colors">المسارات والدورات</Link>
                <span className="text-slate-400">/</span>
                <span className="text-[#0b2646] font-medium">{track.type === 'track' ? 'مسار كامل' : 'دورة تدريبية'}</span>
              </nav>
              
              {/* Title & Desc */}
              <div className="space-y-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b2646] leading-[1.3] tracking-tight">
                  {track.title_ar}
                </h1>
                <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-3xl">
                  {track.description_ar}
                </p>
              </div>
              
              {/* Meta Data */}
              <div className="flex flex-wrap items-center gap-8 mt-2 pt-6 border-t border-slate-200">

                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-[#0b2646] font-bold text-sm">المدة: {durationText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span className="text-[#0b2646] font-bold text-sm">{sessions?.length || 0} محاضرة</span>
                </div>
              </div>

            </div>

            {/* Desktop sidebar placeholder to reserve space in Hero */}
            <div className="hidden lg:block lg:w-[35%] relative ms-auto">
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          <div className="w-full lg:w-[60%] flex flex-col gap-12 py-8 lg:py-12">
            
            {/* Mobile Sidebar (Shows only on small screens) */}
            <div className="lg:hidden w-full relative z-10">
              {renderSidebarContent()}
            </div>

            {/* What you will learn */}
            {track.what_you_will_learn && track.what_you_will_learn.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">ما ستتعلمه</h2>
                <div className="border border-slate-200 bg-white p-6 sm:p-8 rounded-none">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {track.what_you_will_learn.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="shrink-0 mt-1 text-slate-500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span className="text-slate-600 text-sm font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            )}

            {/* Curriculum */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">محتوى الدورة</h2>
              <CourseCurriculum sections={sections} sessions={sessions} type={track.type} trackDuration={durationText} />
            </div>

            {/* Two Column Layout: Audience & Instructor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-2">
              
              {/* Target Audience / Requirements */}
              {track.target_audience && track.target_audience.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">
                    لمن {track.type === 'track' ? 'هذا المسار' : 'هذه الدورة'}؟
                  </h2>
                  <ul className="list-disc list-inside space-y-2.5 text-slate-700 font-medium text-[15px]">
                    {track.target_audience.map((item, i) => (
                      <li key={i} className="leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructor */}
              {instructor && (
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">المدرب</h2>
                  <div className="text-slate-700 font-medium text-[15px] space-y-1">
                    <p className="font-bold text-[#0b2646] text-lg">{instructor.name}</p>
                    {instructor.bio ? (
                      <p className="leading-relaxed">
                        {instructor.bio}
                      </p>
                    ) : (
                      <p className="text-slate-400">لا توجد نبذة عن المدرب حالياً.</p>
                    )}
                  </div>
                </div>
              )}
              
            </div>
            
          </div>
          
          {/* Desktop Sticky Sidebar (The Course Card) */}
          <div className="hidden lg:block lg:w-[35%] relative ms-auto">
            <div className="sticky top-28 -mt-[280px] z-20 pb-20">
              {renderSidebarContent()}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}
