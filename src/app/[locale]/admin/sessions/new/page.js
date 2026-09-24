import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewSessionForm from "@/components/admin/NewSessionForm";

export const metadata = { title: "إضافة جلسة جديدة | تأهيل Admin" };

export default async function NewSessionPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: tracks } = await supabase
    .from("tracks")
    .select("id, title_ar")
    .eq("is_active", true)
    .order("title_ar");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0b2646]">إضافة جلسة جديدة</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">أضف جلسة أو محاضرة جديدة لمسار تدريبي</p>
      </div>
      <div className="bg-white rounded-sm p-8 border border-slate-200">
        <NewSessionForm locale={locale} tracks={tracks || []} />
      </div>
    </div>
  );
}
