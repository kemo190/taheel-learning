import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SessionPlayer from "@/components/learn/SessionPlayer";
import MarkCompleteButton from "@/components/learn/MarkCompleteButton";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { sessionId } = resolvedParams;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("title_ar")
    .eq("id", sessionId)
    .single();

  return {
    title: session ? `${session.title_ar} | تأهيل التعلم` : "جلسة | تأهيل",
  };
}

export default async function SessionPage({ params }) {
  const resolvedParams = await params;
  const { trackId, sessionId, locale } = resolvedParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the session details
  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("track_id", trackId)
    .single();

  if (!session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">الجلسة غير موجودة</h2>
        <p className="text-gray-500">هذه الجلسة غير متوفرة أو تم حذفها.</p>
      </div>
    );
  }

  // Check if student has completed this session
  const { data: progress } = await supabase
    .from("student_progress")
    .select("id")
    .eq("student_id", user.id)
    .eq("session_id", sessionId)
    .single();

  const isCompleted = !!progress;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f8fbff]">
      <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 lg:p-10 lg:pt-12">
        {/* Breadcrumb / Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0b2646] mb-2 leading-tight">
              {session.order_index}. {session.title_ar}
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {session.duration_min} دقيقة
            </p>
          </div>
          
          <div className="shrink-0">
            <MarkCompleteButton 
              sessionId={session.id} 
              trackId={trackId} 
              locale={locale} 
              isCompleted={isCompleted} 
            />
          </div>
        </div>

        {/* Video Player / Content Area */}
        <div className="mb-10">
          <SessionPlayer session={session} />
        </div>

        {/* Description / Resources Tab */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            عن هذه الجلسة
          </h3>
          <div className="prose prose-blue max-w-none text-gray-600">
            {session.description ? (
              <p className="whitespace-pre-wrap leading-relaxed">{session.description}</p>
            ) : (
              <p className="text-gray-400 italic">لا يوجد وصف مضاف لهذه الجلسة.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
