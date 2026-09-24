import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "إدارة المحتوى | تأهيل Admin" };

export default async function TracksPage({ params, searchParams }) {
  const { locale } = await params;
  const resolvedParams = await searchParams;
  const currentTab = resolvedParams?.tab || "all"; // 'all', 'track', 'course'

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  let query = supabase
    .from("tracks")
    .select("*, programs(title_ar)")
    .order("created_at", { ascending: false });

  if (currentTab !== "all") {
    query = query.eq("type", currentTab);
  }

  const { data: tracks } = await query;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">المحتوى التعليمي</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">إدارة جميع المسارات والدورات على منصة تأهيل.</p>
        </div>
        <Link href={`/${locale}/admin/tracks/new`} className="inline-flex items-center justify-center bg-[#0b2646] text-white hover:bg-[#FBBC04] hover:text-[#0b2646] px-8 py-3 text-[15px] font-bold transition-all rounded-sm whitespace-nowrap">
          إضافة محتوى جديد
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        <Link 
          href={`/${locale}/admin/tracks?tab=all`}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === "all" ? "border-[#0b2646] text-[#0b2646]" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
        >
          الكل
        </Link>
        <Link 
          href={`/${locale}/admin/tracks?tab=track`}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === "track" ? "border-[#0b2646] text-[#0b2646]" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
        >
          المسارات فقط
        </Link>
        <Link 
          href={`/${locale}/admin/tracks?tab=course`}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${currentTab === "course" ? "border-[#0b2646] text-[#0b2646]" : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"}`}
        >
          الدورات فقط
        </Link>
      </div>

      {!tracks || tracks.length === 0 ? (
        <div className="bg-white p-16 text-center border border-slate-200 rounded-sm">
          <h3 className="text-[#0b2646] font-extrabold text-lg mb-2">لا يوجد محتوى بعد</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium">لم يتم إضافة أي دورات أو مسارات تدريبية حتى الآن.</p>
          <Link href={`/${locale}/admin/tracks/new`} className="inline-flex items-center gap-2 bg-[#0b2646] text-white px-6 py-3 text-sm font-bold hover:bg-[#FBBC04] hover:text-[#0b2646] transition-colors rounded-sm">
            إضافة المحتوى الأول
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracks.map((track) => (
            <div key={track.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              
              {/* Card Image Area */}
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                {track.image_url ? (
                  <img
                    src={track.image_url}
                    alt={track.title_ar}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-[#0b2646]/5 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#0b2646]/20"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                )}
                
                {/* Badges Overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <span className="bg-[#0b2646] text-[#FBBC04] text-[10px] font-extrabold px-3 py-1.5 rounded-sm shadow-sm border border-[#0b2646]/10">
                    {track.type === "track" ? "مسار متكامل" : "دورة تدريبية"}
                  </span>
                </div>
                
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className={`text-[10px] font-extrabold px-3 py-1.5 rounded-sm shadow-sm border ${track.is_active ? "bg-[#FBBC04] text-[#0b2646] border-[#FBBC04]" : "bg-slate-200 text-slate-500 border-slate-300"}`}>
                    {track.is_active ? "نشط" : "موقوف"}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4 flex-1">
                  <h3 className="font-extrabold text-[#0b2646] text-lg leading-tight mb-1 line-clamp-2" title={track.title_ar}>
                    {track.title_ar}
                  </h3>
                  {track.title_en && (
                    <p className="text-slate-400 text-xs font-medium line-clamp-1">{track.title_en}</p>
                  )}
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">السعر</p>
                    <p className="font-extrabold text-[#0b2646] text-lg">
                      {track.price === 0 ? <span className="text-[#0b2646]">مجاني</span> : `${track.price} ج.م`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link 
                href={`/${locale}/admin/tracks/${track.id}`} 
                className="block w-full py-3.5 bg-slate-50 text-[#0b2646] text-sm font-bold text-center border-t border-slate-200 hover:bg-[#0b2646] hover:text-[#FBBC04] transition-colors group-hover:border-[#0b2646]"
              >
                تعديل المحتوى والمناهج
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}