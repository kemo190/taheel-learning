import { createClient } from "@/utils/supabase/server";
import TrackCard from "@/components/courses/TrackCard";

export const metadata = { title: "الدورات التدريبية | تأهيل" };

export default async function CoursesPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  // Fetch active courses (only individual courses)
  const { data: courses, error } = await supabase
    .from("tracks")
    .select("*, programs(title_ar)")
    .eq("is_active", true)
    .eq("type", "course")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h1 className="text-2xl font-extrabold text-[#0b2646] mb-2">
            الدورات التدريبية المتاحة
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            اكتسب مهارات جديدة مع مجموعة من الدورات المتخصصة والمكثفة.
          </p>
        </div>

        {/* Courses Grid */}
        {(!courses || courses.length === 0) ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto text-gray-300 mb-4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <h3 className="text-xl font-bold text-[#0b2646] mb-2">لا توجد دورات متاحة حالياً</h3>
            <p className="text-gray-500">جاري الإعداد لإضافة دورات جديدة قريباً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {courses.map((course) => (
              <TrackCard key={course.id} track={course} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
