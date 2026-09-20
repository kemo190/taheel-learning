import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "إدارة الجلسات | تأهيل Admin" };

export default async function SessionsPage({ params, searchParams }) {
  const { locale } = await params;
  const resolved = await searchParams;
  const filterTrack = resolved?.track || null;

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  let query = supabase
    .from("sessions")
    .select("*, tracks(title_ar)")
    .order("order_index", { ascending: true });

  if (filterTrack) {
    query = query.eq("track_id", filterTrack);
  }

  const { data: sessions } = await query;
  
  // Get tracks for the filter dropdown
  const { data: tracks } = await supabase.from("tracks").select("id, title_ar").order("title_ar");

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">إدارة الجلسات (Sessions)</h1>
          <p className="text-gray-500 text-sm mt-1">الدروس والمحاضرات الخاصة بالمسارات.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {tracks && tracks.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <select 
                className="appearance-none w-full bg-white border border-gray-200 text-gray-700 py-2 pl-8 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646] focus:border-transparent transition-shadow cursor-pointer"
                defaultValue={filterTrack || ""}
              >
                <option value="">كل المسارات</option>
                {tracks.map(t => (
                  <option key={t.id} value={t.id}>{t.title_ar}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          )}
          
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0b2646] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#081b33] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#0b2646]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
            إضافة جلسة
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!sessions || sessions.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-gray-300 mb-3" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <p className="text-gray-500 text-sm">لا توجد جلسات مسجلة بعد.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">الترتيب</th>
                  <th className="px-6 py-4">عنوان الجلسة</th>
                  <th className="px-6 py-4">المسار التابع</th>
                  <th className="px-6 py-4">النوع</th>
                  <th className="px-6 py-4">المدة</th>
                  <th className="px-6 py-4">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                      #{session.order_index}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{session.title_ar}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {session.tracks?.title_ar || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                        session.type === 'live' ? 'bg-red-50 text-red-700 border-red-200' :
                        session.type === 'hybrid' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {session.type === 'live' ? 'بث مباشر 🔴' : session.type === 'hybrid' ? 'مدمج (Hybrid)' : 'مسجلة 📼'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {session.duration_min} دقيقة
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${
                        session.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {session.is_active ? 'نشط' : 'مخفي'}
                      </span>
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
