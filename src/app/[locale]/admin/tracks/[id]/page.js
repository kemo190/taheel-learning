import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditTrackForm from "@/components/admin/EditTrackForm";

export const metadata = { title: "تعديل المسار | تأهيل Admin" };

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <Link 
          href={`/${locale}/admin/tracks`}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">تعديل مسار</h1>
          <p className="text-gray-500 text-sm mt-1">{track.title_ar}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <EditTrackForm locale={locale} programs={programs} initialData={track} />
      </div>
    </div>
  );
}
