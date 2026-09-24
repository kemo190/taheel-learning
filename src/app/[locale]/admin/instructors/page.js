import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteInstructorButton from "@/components/admin/DeleteInstructorButton";

export const metadata = { title: "إدارة المدربين | تأهيل Admin" };

export default async function InstructorsPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: instructors } = await supabase
    .from("instructors")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">إدارة المدربين</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">إدارة الكادر التعليمي في منصة تأهيل.</p>
        </div>
        <Link
          href={`/${locale}/admin/instructors/new`}
          className="inline-flex items-center justify-center bg-transparent border border-slate-300 hover:border-[#0b2646] hover:bg-slate-50 text-[#0b2646] px-8 py-3 text-[15px] font-bold transition-all rounded-full whitespace-nowrap"
        >
          إضافة مدرب
        </Link>
      </div>

      {/* Instructors Table */}
      {!instructors || instructors.length === 0 ? (
        <div className="bg-white p-16 text-center border border-slate-200 rounded-sm">
          <h3 className="text-[#0b2646] font-extrabold text-lg mb-2">لا يوجد مدربون بعد</h3>
          <p className="text-slate-400 text-sm mb-6 font-medium">لم يتم إضافة أي مدربين للمنصة حتى الآن.</p>
          <Link href={`/${locale}/admin/instructors/new`} className="inline-flex items-center justify-center bg-transparent border border-slate-300 hover:border-[#0b2646] hover:bg-slate-50 text-[#0b2646] px-8 py-3 text-[15px] font-bold transition-all rounded-full whitespace-nowrap">
            إضافة المدرب الأول
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <div key={instructor.id} className="bg-white border border-slate-200 rounded-sm overflow-hidden hover:shadow-lg hover:border-[#0b2646]/30 transition-all duration-300 group flex flex-col relative">
              
              {/* Header: Avatar and Actions */}
              <div className="p-6 flex items-start justify-between border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm bg-[#0b2646]/5 border border-[#0b2646]/10 flex items-center justify-center shrink-0">
                    <span className="text-[#0b2646] font-extrabold text-xl">{instructor.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#0b2646] text-lg leading-tight truncate max-w-[140px]" title={instructor.name}>
                      {instructor.name}
                    </h3>
                    <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mt-1">
                      {new Date(instructor.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Link href={`/${locale}/admin/instructors/${instructor.id}`} className="p-2 text-slate-400 hover:text-[#0b2646] hover:bg-[#0b2646]/5 rounded-sm transition-colors" title="تعديل">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  </Link>
                  <DeleteInstructorButton instructorId={instructor.id} instructorName={instructor.name} />
                </div>
              </div>

              {/* Body: Bio */}
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                  {instructor.bio || "لا توجد نبذة تعريفية مضافة لهذا المدرب حتى الآن."}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}