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
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">طلبات التسجيل</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">مراجعة واعتماد طلبات الانضمام للمسارات التدريبية.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-sm w-fit">
        {statusTabs.map((tab) => (
          <a key={tab.key} href={`/${locale}/admin/enrollments?status=${tab.key}`}
            className={`px-5 py-2 text-sm font-bold transition-all rounded-sm ${
              filterStatus === tab.key ? "bg-white text-[#0b2646] shadow-sm" : "text-slate-500 hover:text-[#0b2646]"
            }`}>
            {tab.label}
          </a>
        ))}
      </div>

      {!safeEnrollments || safeEnrollments.length === 0 ? (
        <div className="bg-white p-16 text-center border border-slate-200 rounded-sm">
          <p className="text-slate-400 font-medium">لا توجد طلبات في هذه الحالة</p>
        </div>
      ) : (
        <div className="space-y-4">
          {safeEnrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-sm p-6 border border-slate-200 transition-all hover:border-[#0b2646]/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-extrabold text-[#0b2646] text-lg">{enrollment.profiles?.full_name || "—"}</h3>
                    <span className="text-slate-300">|</span>
                    <span className="text-slate-600 font-bold">{enrollment.tracks?.title_ar || "—"}</span>
                  </div>
                  <div className="flex items-center gap-5 text-sm text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> <span dir="ltr">{enrollment.profiles?.phone || "—"}</span></span>
                    <span className="flex items-center gap-1.5"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> {enrollment.profiles?.country || "—"}</span>
                    <span className="flex items-center gap-1.5 font-bold"><span className="text-[#0b2646]">{enrollment.amount_paid ? `${enrollment.amount_paid} ج.م` : "—"}</span></span>
                    <span className="flex items-center gap-1.5 text-xs"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> {new Date(enrollment.created_at).toLocaleDateString("ar-EG")}</span>
                  </div>
                  {enrollment.notes && (
                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm mt-3">
                      <p className="text-sm text-slate-600"><span className="font-bold text-slate-800">ملاحظات:</span> {enrollment.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {enrollment.payment_receipt_url_signed ? (
                    <a href={enrollment.payment_receipt_url_signed} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-sm border-2 border-[#0b2646] text-[#0b2646] text-sm font-bold hover:bg-[#0b2646] hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                      </svg>
                      عرض الإيصال
                    </a>
                  ) : (
                    <span className="px-5 py-2.5 rounded-sm bg-slate-100 text-slate-400 text-sm font-bold border-2 border-slate-100">لا يوجد إيصال</span>
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