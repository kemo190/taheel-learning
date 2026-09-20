import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">إدارة المدربين</h1>
          <p className="text-gray-500 text-sm mt-1">{instructors?.length ?? 0} مدرب مسجل في المنصة.</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center gap-2 bg-[#0b2646] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#081b33] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#0b2646]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            إضافة مدرب
          </button>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!instructors || instructors.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300 mb-3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            <p className="text-gray-500 text-sm">لا يوجد مدربين مسجلين بعد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">المدرب</th>
                  <th className="px-6 py-4">البريد الإلكتروني</th>
                  <th className="px-6 py-4">النبذة (Bio)</th>
                  <th className="px-6 py-4">تاريخ الإضافة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0b2646] font-bold shrink-0">
                          {instructor.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{instructor.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium" dir="ltr">
                      {instructor.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                      {instructor.bio || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(instructor.created_at).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
