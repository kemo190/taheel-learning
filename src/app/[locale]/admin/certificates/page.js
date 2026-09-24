import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import IssueCertificateForm from "@/components/admin/IssueCertificateForm";

export const metadata = { title: "إدارة الشهادات | تأهيل Admin" };

export default async function CertificatesPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Fetch all students (role = 'student')
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "student")
    .order("full_name");

  // Fetch all active tracks
  const { data: tracks } = await supabase
    .from("tracks")
    .select("id, title_ar")
    .eq("is_active", true)
    .order("title_ar");

  // Fetch issued certificates
  const { data: certificates } = await supabase
    .from("certificates")
    .select(`
      id,
      certificate_code,
      issued_at,
      profiles:student_id(full_name, email),
      tracks:track_id(title_ar)
    `)
    .order("issued_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">إدارة الشهادات</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">إصدار واستعراض الشهادات الممنوحة للطلاب.</p>
        </div>
      </div>

      {/* Issue Form */}
      <div className="bg-white p-6 border border-slate-200 rounded-sm">
        <h2 className="text-lg font-extrabold text-[#0b2646] mb-6 border-b border-slate-200 pb-4">إصدار شهادة جديدة</h2>
        <IssueCertificateForm locale={locale} students={students || []} tracks={tracks || []} />
      </div>

      {/* Certificates Table */}
      <div className="bg-white border border-slate-200 rounded-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h2 className="font-extrabold text-[#0b2646]">الشهادات الصادرة</h2>
          <span className="bg-[#0b2646]/10 text-[#0b2646] border border-[#0b2646]/20 text-[11px] uppercase tracking-wider font-bold px-3 py-1 rounded-sm">
            {certificates?.length || 0} شهادة
          </span>
        </div>

        {!certificates || certificates.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-slate-400 font-medium text-sm">لم يتم إصدار أي شهادات بعد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">رمز الشهادة</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">الطالب</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">المسار التدريبي</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">تاريخ الإصدار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-mono text-xs">
                      {cert.certificate_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-[#0b2646]">{cert.profiles?.full_name || "—"}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {cert.tracks?.title_ar || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-medium">
                      {new Date(cert.issued_at).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' })}
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