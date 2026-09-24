import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditTrackForm from "@/components/admin/EditTrackForm";
import CurriculumBuilder from "@/components/admin/CurriculumBuilder";

export const metadata = { title: "تعديل المحتوى | تأهيل Admin" };

export default async function EditTrackPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  // Fetch track data
  const { data: track, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !track) {
    redirect(`/${locale}/admin/tracks`);
  }

  // Fetch programs for the dropdown
  const { data: programs } = await supabase
    .from("programs")
    .select("id, title_ar")
    .eq("is_active", true);

  // Fetch instructors for the dropdown
  const { data: instructors } = await supabase
    .from("instructors")
    .select("id, name")
    .order("name");

  // Fetch sections if it's a track
  let sections = [];
  let sessions = [];
  if (track.type === "track") {
    const { data: trackSections } = await supabase
      .from("sections")
      .select("*")
      .eq("track_id", id)
      .order("order_index", { ascending: true });
    sections = trackSections || [];

    const { data: trackSessions } = await supabase
      .from("sessions")
      .select("*")
      .eq("track_id", id)
      .order("order_index", { ascending: true });
    sessions = trackSessions || [];
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/admin/tracks`}
            className="w-10 h-10 flex items-center justify-center rounded-sm bg-white border border-slate-200 text-slate-500 hover:text-[#0b2646] hover:border-[#0b2646] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0b2646] tracking-tight">تعديل المحتوى التعليمي</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">{track.title_ar}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-slate-200 p-6 sm:p-8">
        <EditTrackForm locale={locale} trackId={track.id} programs={programs} instructors={instructors} />
      </div>

      {track.type === "track" && (
        <div className="bg-white rounded-sm border border-slate-200 p-6 sm:p-8 mt-6">
           <h2 className="text-xl font-extrabold text-[#0b2646] mb-6">المسار والمناهج (Curriculum)</h2>
           <CurriculumBuilder trackId={track.id} initialSections={sections} initialSessions={sessions} />
        </div>
      )}
    </div>
  );
}