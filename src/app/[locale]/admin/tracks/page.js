import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "إدارة المسارات | تأهيل Admin" };

export default async function TracksPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: tracks } = await supabase
    .from("tracks")
    .select("*, programs(title_ar)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0b2646]">إدارة المسارات</h1>
          <p className="text-gray-500 text-sm mt-1">{tracks?.length ?? 0} مسار</p>
        </div>
        <Link href={`/${locale}/admin/tracks/new`} className="flex items-center gap-2 bg-[#0b2646] text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-[#061528] transition-colors shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          إضافة مسار
        </Link>
      </div>

      {!tracks || tracks.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
          <h3 className="text-[#0b2646] font-bold text-lg mb-2">لا توجد مسارات بعد</h3>
          <p className="text-gray-400 text-sm mb-6">ابدأ بإضافة أول مسار تدريبي</p>
          <Link href={`/${locale}/admin/tracks/new`} className="inline-flex items-center gap-2 bg-[#0b2646] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#061528] transition-colors">
            إضافة المسار الأول
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">المسار</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">البرنامج</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">السعر</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">المستوى</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">الحالة</th>
                  <th className="text-right px-6 py-3 text-gray-500 font-medium">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tracks.map((track) => (
                  <tr key={track.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-[#0b2646]">{track.title_ar}</p>
                        <p className="text-gray-400 text-xs">{track.title_en}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{track.programs?.title_ar || "—"}</td>
                    <td className="px-6 py-4 font-semibold text-[#0b2646]">
                      {track.price === 0 ? <span className="text-green-600">مجاني</span> : `${track.price} ج.م`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        track.level === "beginner" ? "bg-green-100 text-green-700" :
                        track.level === "intermediate" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      }`}>
                        {track.level === "beginner" ? "مبتدئ" : track.level === "intermediate" ? "متوسط" : "متقدم"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${track.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {track.is_active ? "نشط" : "موقوف"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/${locale}/admin/tracks/${track.id}`} className="px-3 py-1.5 rounded-lg bg-[#0b2646] text-white text-xs font-semibold hover:bg-[#061528] transition-colors">تعديل</Link>
                        <Link href={`/${locale}/admin/sessions?track=${track.id}`} className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-semibold hover:bg-purple-200 transition-colors">الجلسات</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
