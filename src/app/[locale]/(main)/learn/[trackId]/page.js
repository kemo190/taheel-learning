import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function LearnTrackPage({ params }) {
  const resolvedParams = await params;
  const { trackId, locale } = resolvedParams;
  const supabase = await createClient();

  // Fetch the first session for this track
  const { data: session } = await supabase
    .from("sessions")
    .select("id")
    .eq("track_id", trackId)
    .eq("is_active", true)
    .order("order_index", { ascending: true })
    .limit(1)
    .single();

  if (session) {
    redirect(`/${locale}/learn/${trackId}/${session.id}`);
  } else {
    // If no sessions, show a friendly message
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        </div>
        <h2 className="text-2xl font-bold text-[#0b2646] mb-2">قريباً.. محتوى المسار</h2>
        <p className="text-gray-500 max-w-md">
          لم يتم إضافة أي جلسات لهذا المسار بعد. يرجى الانتظار حتى يقوم المدرب بإضافة المحتوى، أو تواصل مع الدعم الفني.
        </p>
      </div>
    );
  }
}
