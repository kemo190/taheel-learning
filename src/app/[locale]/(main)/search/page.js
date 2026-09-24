import { createClient } from "@/utils/supabase/server";
import TrackCard from "@/components/courses/TrackCard";

export const metadata = { title: "نتائج البحث | تأهيل" };

export default async function SearchPage({ params, searchParams }) {
  const { locale } = await params;
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";
  
  const supabase = await createClient();

  // Fetch active tracks/courses matching the query
  let supabaseQuery = supabase
    .from("tracks")
    .select("*, programs(title_ar)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`title_ar.ilike.%${query}%,description_ar.ilike.%${query}%`);
  }

  const { data: results, error } = await supabaseQuery;

  if (error) {
    console.error("Error fetching search results:", error);
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl font-extrabold text-[#0b2646] mb-2">
            نتائج البحث
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {query ? `تصفح النتائج المتعلقة بـ "${query}"` : "الرجاء إدخال كلمة بحث."}
          </p>
        </div>

        {/* Results Grid */}
        {(!results || results.length === 0) ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300 mb-4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <h3 className="text-xl font-bold text-[#0b2646] mb-2">لا توجد نتائج مطابقة</h3>
            <p className="text-gray-500">حاول استخدام كلمات مفتاحية مختلفة للبحث.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {results.map((item) => (
              <TrackCard key={item.id} track={item} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
