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
    <div className="bg-white border border-slate-200 overflow-hidden flex flex-col" style={{boxShadow: "0 4px 24px rgba(11,38,70,0.08)"}}>
      
      {/* Top Accent Bar */}
      <div className="h-1 bg-[#FBBC04] w-full"></div>

      {track.promo_video_url ? (
        <PromoVideoModal videoUrl={track.promo_video_url} imageUrl={track.image_url} title={track.title_ar} />
      ) : track.image_url ? (
        <div className="relative aspect-video bg-slate-50 border-b border-slate-100 flex items-center justify-center">
          <Image src={track.image_url} alt={track.title_ar} fill className="object-cover" unoptimized />
        </div>
      ) : (
        <div className="relative aspect-video bg-[#0b2646]"></div>
      )}

      <div className="p-5 flex flex-col gap-4">
        {/* Price */}
        {track.price > 0 && (
          <div className="flex flex-col items-center justify-center py-4 border-b border-slate-100 gap-1 text-center">
            <p className="text-[12px] font-bold text-slate-500 tracking-widest uppercase">سعر الاشتراك</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-[2.5rem] font-black text-[#0b2646] leading-none">{track.price}</span>
              <span className="text-lg font-bold text-slate-500">ج.م</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">دفعة واحدة · وصول مدى الحياة</p>
          </div>
        )}

        {/* CTA Button */}
        {!user ? (
          <Link href={`/${locale}/login?returnUrl=/${locale}/tracks/${id}`} className="flex items-center justify-center w-full bg-[#FBBC04] text-[#0b2646] py-3.5 font-black text-base hover:bg-[#e0a800] transition-colors">
            تسجيل الدخول للاشتراك
          </Link>
        ) : enrollmentStatus === 'approved' ? (
          <div className="flex flex-col gap-2.5">
            <div className="border border-slate-200 p-2.5 text-center">
              <span className="font-bold text-slate-600 text-[13px]">✓ أنت مشترك في هذا المحتوى</span>
            </div>
            <Link href={`/${locale}/journey`} className="flex items-center justify-center w-full bg-[#0b2646] text-white py-3.5 font-black text-base hover:bg-[#081b33] transition-colors">
              إكمال التعلم &larr;
            </Link>
          </div>
        ) : enrollmentStatus === 'pending' ? (
          <div className="border border-slate-200 p-3 text-center">
            <h3 className="font-bold text-slate-700 text-[13px] mb-0.5">طلبك قيد المراجعة</h3>
            <p className="text-slate-500 text-[11px] font-medium leading-tight">سيتم تفعيل حسابك فور التأكد من إيصال الدفع.</p>
          </div>
        ) : track.price === 0 ? (
          <FreeEnrollButton trackId={track.id} locale={locale} />
        ) : (
          <Link href={`/${locale}/tracks/${id}/enroll`} className="flex items-center justify-center w-full bg-[#FBBC04] text-[#0b2646] py-3.5 font-black text-base hover:bg-[#e0a800] transition-colors">
            اشترك الآن
          </Link>
        )}

        {/* Includes section */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h4 className="font-black text-[#0b2646] text-[12px] tracking-widest uppercase">هذا المحتوى يشمل</h4>
          <ul className="space-y-2.5">
            <li className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <span className="text-[#FBBC04] font-black">—</span>
              <span>وصول كامل مدى الحياة</span>
            </li>
            <li className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <span className="text-[#FBBC04] font-black">—</span>
              <span>شهادة إتمام معتمدة</span>
            </li>
            <li className="flex items-center gap-2.5 text-[13px] font-medium text-slate-600">
              <span className="text-[#FBBC04] font-black">—</span>
              <span>ضمان جودة المحتوى</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-transparent" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* HEADER SECTION (CLEAN LIGHT THEME) */}
      <div className="pt-10 pb-20 lg:py-16 relative overflow-hidden" style={{backgroundImage: "url('/images/track-hero-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fffdf0]/90 via-[#fff8db]/80 to-white/60 pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 relative">
            <div className="w-full lg:w-[67%] flex flex-col gap-6">
              
              {/* Breadcrumbs & Badge */}
              <div className="flex flex-wrap items-center gap-3">
                 <span className="bg-[#FBBC04] text-[#0b2646] px-3 py-1.5 text-xs font-black tracking-wider shadow-sm">
                    {track.type === 'track' ? 'مسار كامل' : 'دورة تدريبية'}
                 </span>
                 <nav className="flex text-sm text-slate-500 font-bold gap-2 items-center">
                    <Link href={`/${locale}`} className="hover:text-[#0b2646] transition-colors">الرئيسية</Link>
                    <span className="text-slate-400">/</span>
                    <Link href={`/${locale}/tracks`} className="hover:text-[#0b2646] transition-colors">المسارات والدورات</Link>
                 </nav>
              </div>
              
              {/* Title & Desc */}
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl lg:text-[2rem] font-black text-[#0b2646] leading-[1.3] tracking-tight">
                  {track.title_ar}
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-3xl">
                  {track.description_ar}
                </p>
              </div>
              
              {/* Meta Data - Infographic Style */}
              <div className="flex flex-wrap items-center gap-12 mt-2 pt-4">
                <div>
                   <p className="text-[13px] text-slate-500 font-bold mb-1">المدة الإجمالية</p>
                   <div className="flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                     <p className="text-[#0b2646] font-black text-xl">{durationText}</p>
                   </div>
                </div>
                
                <div>
                   <p className="text-[13px] text-slate-500 font-bold mb-1">محتوى الدورة</p>
                   <div className="flex items-center gap-2">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                     <p className="text-[#0b2646] font-black text-xl">{sessions?.length || 0} <span className="font-black text-xl text-[#0b2646]">محاضرة</span></p>
                   </div>
                </div>
              </div>

            </div>

            {/* Desktop sidebar placeholder to reserve space in Hero */}
            <div className="hidden lg:block lg:w-[29%] relative ms-auto">
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 relative">
          
          <div className="w-full lg:w-[67%] flex flex-col gap-12 py-8 lg:py-12">
            
            {/* Mobile Sidebar (Shows only on small screens) */}
            <div className="lg:hidden w-full relative z-10">
              {renderSidebarContent()}
            </div>

            {/* What you will learn */}
            {track.what_you_will_learn && track.what_you_will_learn.length > 0 && (
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">ماذا سأتعلم</h2>
                  <span className="text-sm font-medium text-slate-500">ملخص لأهم النقاط:</span>
                </div>
                <div className="columns-1 md:columns-2 gap-x-8 space-y-3 pt-1">
                {track.what_you_will_learn.map((item, i) => (
                  <div key={i} className="flex gap-2.5 items-start break-inside-avoid mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" className="shrink-0 mt-0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span className="text-slate-600 font-medium text-[15px] leading-relaxed">{item}</span>
                  </div>
                ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">
                {track.type === 'course' ? 'محتوى الدورة' : 'محتوى المسار'}
              </h2>
              <CourseCurriculum sections={sections} sessions={sessions} type={track.type} trackDuration={durationText} />
            </div>

            {/* Two Column Layout: Audience & Instructor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-2">
              
              {/* Target Audience / Requirements */}
              {track.target_audience && track.target_audience.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">
                      لمن {track.type === 'track' ? 'هذا المسار' : 'هذه الدورة'}
                    </h2>
                    <span className="text-sm font-medium text-slate-500">مناسب جداً لـ:</span>
                  </div>
                  <div className="flex flex-col gap-y-3 pt-1">
                  {track.target_audience.map((item, i) => (
                    <div key={i} className="flex gap-2.5 items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBC04" className="shrink-0 mt-0.5" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      <span className="text-slate-600 font-medium text-[15px] leading-relaxed">{item}</span>
                    </div>
                  ))}
                  </div>
                </div>
              )}

              {/* Instructor */}
              {instructor && (
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0b2646]">المدرب</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-[#0b2646] text-lg">{instructor.name}</p>
                    <span className="text-slate-300">-</span>
                    {instructor.bio ? (
                      <p className="text-slate-500 font-medium">{instructor.bio}</p>
                    ) : (
                      <p className="text-slate-400 font-medium">مدرب معتمد</p>
                    )}
                  </div>
                </div>
              )}
              
            </div>
            
          </div>
          
          {/* Desktop Sticky Sidebar (The Course Card) */}
          <div className="hidden lg:block lg:w-[29%] relative ms-auto">
            <div className="sticky top-28 -mt-[400px] z-20 pb-20">
              {renderSidebarContent()}
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}

