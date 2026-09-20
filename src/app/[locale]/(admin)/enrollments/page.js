import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import EnrollmentStatusButtons from "@/components/admin/EnrollmentStatusButtons";

export const metadata = {
  title: "طلبات التسجيل | لوحة تحكم تأهيل",
};

export default async function AdminEnrollmentsPage() {
  const supabase = await createClient();

  // 1. Verify admin role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") return notFound();

  // 2. Fetch enrollments with related track info
  // Sorting by created_at DESC so newest are first
  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select(`
      id,
      status,
      payment_receipt_url,
      created_at,
      notes,
      student_id,
      tracks(title_ar, price)
    `)
    .order("created_at", { ascending: false });

  let safeEnrollments = enrollments || [];

  if (safeEnrollments.length > 0) {
    // 3. Fetch profiles separately because enrollments.student_id references auth.users, not profiles directly
    const studentIds = safeEnrollments.map((e) => e.student_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, phone")
      .in("id", studentIds);

    // Merge profiles into enrollments
    safeEnrollments = safeEnrollments.map((enroll) => ({
      ...enroll,
      profiles: profiles?.find((p) => p.id === enroll.student_id) || null,
    }));
  }

  // Grouping
  const pending = safeEnrollments.filter(e => e.status === "pending");
  const others = safeEnrollments.filter(e => e.status !== "pending");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">طلبات التسجيل والإيصالات</h1>
        <p className="text-gray-500">مراجعة طلبات الاشتراك للطلاب وتفعيل حساباتهم بعد التأكد من الدفع.</p>
      </div>

      {/* Pending Enrollments Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            ⏳
          </span>
          طلبات بانتظار المراجعة ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            لا توجد طلبات جديدة بانتظار المراجعة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 rounded-r-xl">تاريخ الطلب</th>
                  <th className="py-3 px-4">الطالب</th>
                  <th className="py-3 px-4">رقم الهاتف</th>
                  <th className="py-3 px-4">المسار المطلوب</th>
                  <th className="py-3 px-4">الإيصال</th>
                  <th className="py-3 px-4 rounded-l-xl">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pending.map(enroll => {
                  const receiptUrl = enroll.payment_receipt_url
                    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/receipts/${enroll.payment_receipt_url}`
                    : null;

                  return (
                    <tr key={enroll.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 text-gray-500">
                        {new Date(enroll.created_at).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900">{enroll.profiles?.full_name || "بدون اسم"}</div>
                        <div className="text-xs text-gray-500">{enroll.profiles?.email}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600 dir-ltr text-right">
                        {enroll.profiles?.phone || "غير محدد"}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-blue-600">{enroll.tracks?.title_ar}</div>
                        <div className="text-xs text-gray-500">{enroll.tracks?.price} ج.م</div>
                      </td>
                      <td className="py-4 px-4">
                        {receiptUrl ? (
                          <a
                            href={receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                            عرض الإيصال
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">لا يوجد إيصال</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <EnrollmentStatusButtons enrollmentId={enroll.id} currentStatus={enroll.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Processed Enrollments Section */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
            ✓
          </span>
          الطلبات السابقة
        </h2>

        {others.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            لا توجد طلبات سابقة.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4 rounded-r-xl">تاريخ الطلب</th>
                  <th className="py-3 px-4">الطالب</th>
                  <th className="py-3 px-4">المسار المطلوب</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 rounded-l-xl">ملاحظات الإدارة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {others.map(enroll => (
                  <tr key={enroll.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4 text-gray-500">
                      {new Date(enroll.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900">{enroll.profiles?.full_name || "بدون اسم"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-blue-600">{enroll.tracks?.title_ar}</div>
                    </td>
                    <td className="py-4 px-4">
                      <EnrollmentStatusButtons enrollmentId={enroll.id} currentStatus={enroll.status} />
                    </td>
                    <td className="py-4 px-4 text-gray-500 text-xs max-w-[200px] truncate" title={enroll.notes || ""}>
                      {enroll.notes || "-"}
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
