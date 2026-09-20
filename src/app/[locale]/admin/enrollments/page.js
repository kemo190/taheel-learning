import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import EnrollmentActions from "@/components/admin/EnrollmentActions";

export const metadata = { title: "طلبات التسجيل | تأهيل Admin" };

export default async function EnrollmentsPage({ params, searchParams }) {
  const { locale } = await params;
  const resolved = await searchParams;
  const filterStatus = resolved?.status || "pending";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, tracks(title_ar, price)")
    .eq("status", filterStatus)
    .order("created_at", { ascending: false });

  let safeEnrollments = enrollments || [];

  if (safeEnrollments.length > 0) {
    const studentIds = safeEnrollments.map((e) => e.student_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone, country")
      .in("id", studentIds);

    // Create signed URLs for all receipts
    safeEnrollments = await Promise.all(safeEnrollments.map(async (enroll) => {
      let signedUrl = null;
      if (enroll.payment_receipt_url) {
        const { data } = await supabase.storage
          .from("receipts")
          .createSignedUrl(enroll.payment_receipt_url, 60 * 60); // 1 hour valid
        
        if (data?.signedUrl) {
          signedUrl = data.signedUrl;
        }
      }

      return {
        ...enroll,
        payment_receipt_url_signed: signedUrl,
        profiles: profiles?.find((p) => p.id === enroll.student_id) || null,
      };
    }));
  }

  const statusTabs = [
    { key: "pending",   label: "قيد المراجعة" },
    { key: "approved",  label: "مقبول" },
    { key: "rejected",  label: "مرفوض" },
    { key: "cancelled", label: "ملغي" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0b2646]">طلبات التسجيل</h1>
        <p className="text-gray-500 text-sm mt-1">مراجعة الإيصالات والموافقة على تسجيلات الطلاب</p>
      </div>

      <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 w-fit">
        {statusTabs.map((tab) => (
          <a key={tab.key} href={`/${locale}/admin/enrollments?status=${tab.key}`}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              filterStatus === tab.key ? "bg-[#0b2646] text-white shadow" : "text-gray-500 hover:text-[#0b2646]"
            }`}>
            {tab.label}
          </a>
        ))}
      </div>

      {!safeEnrollments || safeEnrollments.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <p className="text-gray-400">لا توجد طلبات في هذه الحالة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {safeEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-[#0b2646] text-base">{enrollment.profiles?.full_name || "—"}</h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500 text-sm">{enrollment.tracks?.title_ar || "—"}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                    <span>📞 {enrollment.profiles?.phone || "—"}</span>
                    <span>🌍 {enrollment.profiles?.country || "—"}</span>
                    <span>💰 {enrollment.amount_paid ? `${enrollment.amount_paid} ج.م` : "لم يُحدد"}</span>
                    <span>📅 {new Date(enrollment.created_at).toLocaleDateString("ar-EG")}</span>
                  </div>
                  {enrollment.notes && (
                    <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-1.5 mt-2">📝 {enrollment.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {enrollment.payment_receipt_url_signed ? (
                    <a href={enrollment.payment_receipt_url_signed} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#0b2646] text-[#0b2646] text-sm font-semibold hover:bg-[#0b2646] hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      الإيصال
                    </a>
                  ) : (
                    <span className="px-4 py-2 rounded-xl bg-gray-100 text-gray-400 text-sm">لا يوجد إيصال</span>
                  )}
                  {filterStatus === "pending" && (
                    <EnrollmentActions enrollmentId={enrollment.id} locale={locale} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
