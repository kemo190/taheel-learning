import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "إدارة الطلاب | تأهيل Admin" };

export default async function StudentsPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0b2646]">إدارة الطلاب</h1>
        <p className="text-gray-500 text-sm mt-1">{students?.length ?? 0} طالب مسجل</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {!students || students.length === 0 ? (
          <div className="p-16 text-center"><p className="text-gray-400">لا يوجد طلاب مسجلون بعد</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">الطالب</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">الهاتف</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">البلد</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">الجنس</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0b2646]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#0b2646] font-bold text-sm">{s.full_name?.charAt(0) || "?"}</span>
                        </div>
                        <p className="font-semibold text-[#0b2646]">{s.full_name || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600" dir="ltr">{s.phone || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{s.country || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{s.gender === "male" ? "ذكر" : s.gender === "female" ? "أنثى" : "—"}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{s.created_at ? new Date(s.created_at).toLocaleDateString("ar-EG") : "—"}</td>
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
