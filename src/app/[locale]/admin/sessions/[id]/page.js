import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditSessionForm from "@/components/admin/EditSessionForm";

export const metadata = { title: "تعديل الجلسة | تأهيل Admin" };

export default async function EditSessionPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (!session) return notFound();

  const { data: tracks } = await supabase
    .from("tracks")
    .select("id, title_ar")
    .order("title_ar");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0b2646]">تعديل الجلسة</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">تعديل بيانات وتفاصيل الجلسة</p>
      </div>
      <div className="bg-white rounded-sm p-8 border border-slate-200">
        <EditSessionForm locale={locale} tracks={tracks || []} session={session} />
      </div>
    </div>
  );
}
