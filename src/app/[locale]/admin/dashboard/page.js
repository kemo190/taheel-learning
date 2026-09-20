import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "لوحة التحكم | تأهيل Admin" };

export default async function AdminDashboardPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const [
    { count: studentsCount },
    { count: tracksCount },
    { count: pendingEnrollments },
    { count: certificatesCount },
    { data: recentEnrollments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("tracks").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("certificates").select("*", { count: "exact", head: true }),
    supabase
      .from("enrollments")
      .select("id, status, created_at, amount_paid, profiles(full_name), tracks(title_ar)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const statusColor = {
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    cancelled: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const statusLabel = {
    pending: "قيد المراجعة",
    approved: "مقبول",
    rejected: "مرفوض",
    cancelled: "ملغي",
  };

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Clean Corporate Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-1">نظرة عامة على أداء المنصة والنشاطات الأخيرة.</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${locale}/admin/tracks/new`} className="inline-flex items-center justify-center gap-2 bg-[#0b2646] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#081b33] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#0b2646]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            إضافة مسار
          </Link>
        </div>
      </div>

      {/* Enterprise Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">إجمالي الطلاب</h3>
            <span className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-900">{studentsCount ?? 0}</p>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">المسارات النشطة</h3>
            <span className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-900">{tracksCount ?? 0}</p>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {(pendingEnrollments ?? 0) > 0 && (
            <div className="absolute top-0 right-0 w-1 h-full bg-orange-500"></div>
          )}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">طلبات للتسجيل</h3>
            <span className={`p-2 rounded-lg ${(pendingEnrollments ?? 0) > 0 ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-semibold text-gray-900">{pendingEnrollments ?? 0}</p>
            {(pendingEnrollments ?? 0) > 0 && (
              <Link href={`/${locale}/admin/enrollments`} className="text-xs font-medium text-orange-600 hover:underline">المراجعة الآن &larr;</Link>
            )}
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">الشهادات الممنوحة</h3>
            <span className="p-2 bg-gray-50 rounded-lg text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg>
            </span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-900">{certificatesCount ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Clean Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">أحدث طلبات التسجيل</h2>
          <Link href={`/${locale}/admin/enrollments`} className="text-sm font-medium text-[#0b2646] hover:text-[#081b33]">
            عرض الكل
          </Link>
        </div>
        
        {!recentEnrollments || recentEnrollments.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300 mb-3" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
            <p className="text-gray-500 text-sm">لا توجد طلبات تسجيل حتى الآن.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">الطالب</th>
                  <th className="px-6 py-3">المسار</th>
                  <th className="px-6 py-3">المبلغ</th>
                  <th className="px-6 py-3">الحالة</th>
                  <th className="px-6 py-3">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentEnrollments.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{e.profiles?.full_name || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {e.tracks?.title_ar || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {e.amount_paid ? `${e.amount_paid} ج.م` : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${statusColor[e.status]}`}>
                        {statusLabel[e.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(e.created_at).toLocaleDateString("ar-EG")}
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
