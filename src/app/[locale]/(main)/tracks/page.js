import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "المسارات التدريبية | تأهيل" };

export default async function TracksPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch active tracks
  const { data: tracks, error } = await supabase
    .from("tracks")
    .select("*, programs(title_ar)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tracks:", error);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black text-[#0b2646] mb-4">
            المسارات التدريبية المتاحة
          </h1>
          <p className="text-lg text-gray-600">
            اختر المسار الذي يناسب طموحك وابدأ رحلتك نحو احتراف سوق العمل.
          </p>
        </div>

        {/* Tracks Grid */}
        {(!tracks || tracks.length === 0) ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300 mb-4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h3 className="text-xl font-bold text-[#0b2646] mb-2">لا توجد مسارات متاحة حالياً</h3>
            <p className="text-gray-500">جاري الإعداد لإطلاق الدفعات القادمة، ترقبونا قريباً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tracks.map((track) => (
              <Link key={track.id} href={`/${locale}/tracks/${track.id}`} className="group block h-full">
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group-hover:-translate-y-1">
                  
                  {/* Card Image Area */}
                  <div className="relative h-48 bg-gradient-to-br from-[#0b2646] to-[#113a69] overflow-hidden">
                    {track.image_url ? (
                      <img src={track.image_url} alt={track.title_ar} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern></defs>
                          <rect width="100%" height="100%" fill="url(#grid)"/>
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Delivery Mode Badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {track.delivery_mode === "live" ? "🔴 بث مباشر" : track.delivery_mode === "hybrid" ? "مدمج" : "مسجل تفاعلي"}
                    </div>
                    {/* Program Badge */}
                    {track.programs && (
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {track.programs.title_ar}
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-[#0b2646] mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {track.title_ar}
                    </h3>
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-grow">
                      {track.description_ar || "لا يوجد وصف حالياً لهذا المسار. اضغط لمعرفة المزيد."}
                    </p>

                    {/* Meta Info (Rating, Learners, Duration) */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-6 pt-4 border-t border-gray-50">
                      {track.rating > 0 && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                          {track.rating}
                        </div>
                      )}
                      {track.learners_count > 0 && (
                        <div className="flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                          {track.learners_count}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        {track.original_price && track.price > 0 && (
                          <div className="text-xs text-gray-400 line-through mb-0.5">{track.original_price} ج.م</div>
                        )}
                        <div className="font-black text-2xl text-[#0b2646]">
                          {track.price === 0 ? (
                            <span className="text-emerald-600">مجاناً</span>
                          ) : (
                            <span>{track.price} <span className="text-sm text-gray-500 font-medium">ج.م</span></span>
                          )}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#0b2646] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="stroke-blue-600 group-hover:stroke-white transition-colors" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
