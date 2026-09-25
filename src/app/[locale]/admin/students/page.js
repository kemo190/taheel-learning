import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import UserRoleSelect from "@/components/admin/UserRoleSelect";

export const metadata = { title: "إدارة المستخدمين | تأهيل Admin" };

export default async function StudentsPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">إدارة المستخدمين</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">سجل جميع المستخدمين المنضمين للمنصة.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        {!students || students.length === 0 ? (
          <div className="p-16 text-center"><p className="text-slate-400 font-medium">لا يوجد طلاب مسجلون بعد</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الطالب</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الهاتف</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">البلد</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الجنس</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الدور (الصلاحية)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-sm bg-[#0b2646]/10 border border-[#0b2646]/20 flex items-center justify-center shrink-0">
                          <span className="text-[#0b2646] font-extrabold text-sm">{s.full_name?.charAt(0) || "?"}</span>
                        </div>
                        <p className="font-bold text-[#0b2646]">{s.full_name || "—"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium" dir="ltr">{s.phone || "—"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{s.country || "—"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{s.gender === "male" ? "ذكر" : s.gender === "female" ? "أنثى" : "—"}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs font-medium">{s.created_at ? new Date(s.created_at).toLocaleDateString("ar-EG") : "—"}</td>
                    <td className="px-6 py-4">
                      <UserRoleSelect userId={s.id} initialRole={s.role} />
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