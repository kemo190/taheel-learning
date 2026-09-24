import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "لوحة التحكم | تأهيل" };

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
      .limit(6),
  ]);

  const statusColor = {
    pending: "text-amber-700 bg-amber-50 border-amber-200",
    approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
    rejected: "text-red-700 bg-red-50 border-red-200",
    cancelled: "text-slate-700 bg-slate-50 border-slate-200",
  };

  const statusLabel = {
    pending: "قيد المراجعة",
    approved: "مقبول",
    rejected: "مرفوض",
    cancelled: "ملغي",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0b2646] tracking-tight">نظرة عامة</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">مرحباً بك، إليك ملخص أداء المنصة لهذا اليوم.</p>
        </div>
      </div>

      {/* Stats - Enterprise Style (Flat, Borders) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-y sm:border border-slate-200 sm:rounded-sm bg-white divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-200">

        <div className="p-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">إجمالي الطلاب</p>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-black text-[#0b2646] leading-none">{studentsCount ?? 0}</p>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">طالب مسجل في المنصة</p>
        </div>

        <div className="p-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">المحتوى النشط</p>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-black text-[#0b2646] leading-none">{tracksCount ?? 0}</p>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">مسار ودورة منشورة</p>
        </div>

        <div className={`p-6 ${(pendingEnrollments ?? 0) > 0 ? "bg-amber-50/30 relative overflow-hidden" : ""}`}>
          {(pendingEnrollments ?? 0) > 0 && (
            <div className="absolute top-0 right-0 w-full h-1 bg-[#FBBC04]" />
          )}
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">طلبات معلقة</p>
          <div className="flex items-end gap-3">
            <p className={`text-5xl font-black leading-none ${(pendingEnrollments ?? 0) > 0 ? "text-amber-600" : "text-[#0b2646]"}`}>
              {pendingEnrollments ?? 0}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-400 font-medium">تحتاج إلى مراجعة</p>
            {(pendingEnrollments ?? 0) > 0 && (
              <Link href={`/${locale}/admin/enrollments`} className="text-xs font-bold text-[#0b2646] hover:text-[#FBBC04] underline underline-offset-2">مراجعة</Link>
            )}
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">الشهادات</p>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-black text-[#0b2646] leading-none">{certificatesCount ?? 0}</p>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">شهادة إتمام ممنوحة</p>
        </div>

      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-extrabold text-[#0b2646] mb-4">وصول سريع</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href={`/${locale}/admin/tracks/new`} className="group flex flex-col p-5 bg-white border border-slate-200 hover:border-[#0b2646] transition-all rounded-sm">
            <div className="w-10 h-10 bg-slate-50 text-[#0b2646] flex items-center justify-center mb-4 group-hover:bg-[#0b2646] group-hover:text-white transition-colors rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-900">إضافة محتوى</p>
            <p className="text-xs text-slate-500 mt-1">إنشاء محتوى تعليمي جديد</p>
          </Link>
          <Link href={`/${locale}/admin/instructors`} className="group flex flex-col p-5 bg-white border border-slate-200 hover:border-[#0b2646] transition-all rounded-sm">
            <div className="w-10 h-10 bg-slate-50 text-[#0b2646] flex items-center justify-center mb-4 group-hover:bg-[#0b2646] group-hover:text-white transition-colors rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-900">المدربون</p>
            <p className="text-xs text-slate-500 mt-1">إدارة كادر التعليم</p>
          </Link>
          <Link href={`/${locale}/admin/enrollments`} className="group flex flex-col p-5 bg-white border border-slate-200 hover:border-[#FBBC04] transition-all rounded-sm relative overflow-hidden">
            <div className="w-10 h-10 bg-slate-50 text-[#0b2646] flex items-center justify-center mb-4 group-hover:bg-[#FBBC04] group-hover:text-[#0b2646] transition-colors rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-900">التسجيلات</p>
            <p className="text-xs text-slate-500 mt-1">مراجعة واعتماد الطلبات</p>
          </Link>
          <Link href={`/${locale}/admin/students`} className="group flex flex-col p-5 bg-white border border-slate-200 hover:border-[#0b2646] transition-all rounded-sm">
            <div className="w-10 h-10 bg-slate-50 text-[#0b2646] flex items-center justify-center mb-4 group-hover:bg-[#0b2646] group-hover:text-white transition-colors rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-900">الطلاب</p>
            <p className="text-xs text-slate-500 mt-1">عرض قائمة المسجلين</p>
          </Link>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-[#0b2646]">أحدث التسجيلات</h2>
          <Link href={`/${locale}/admin/enrollments`} className="text-sm font-bold text-slate-500 hover:text-[#0b2646] transition-colors underline underline-offset-4">
            عرض الكل
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-sm">
          {!recentEnrollments || recentEnrollments.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 font-medium text-sm">لا توجد طلبات تسجيل حتى الآن.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الطالب</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المسار</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المبلغ</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الحالة</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentEnrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-[#0b2646]">{e.profiles?.full_name || "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate">{e.tracks?.title_ar || "—"}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{e.amount_paid ? `${e.amount_paid} ج.م` : "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border rounded-sm ${statusColor[e.status]}`}>
                          {statusLabel[e.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-medium">{new Date(e.created_at).toLocaleDateString("ar-EG")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}