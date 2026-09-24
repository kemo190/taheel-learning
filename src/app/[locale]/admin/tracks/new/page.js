import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewTrackForm from "@/components/admin/NewTrackForm";

export const metadata = { title: "إضافة مسار جديد | تأهيل Admin" };

export default async function NewTrackPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: programs } = await supabase
    .from("programs")
    .select("id, title_ar")
    .eq("is_active", true)
    .order("title_ar");

  const { data: instructors } = await supabase
    .from("instructors")
    .select("id, name")
    .order("name");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0b2646]">إضافة مسار جديد</h1>
        <p className="text-slate-500 text-sm mt-1.5 font-medium">أضف مسار تدريبي جديد للمنصة</p>
      </div>
      <div className="bg-white rounded-sm p-8 border border-slate-200">
        <NewTrackForm locale={locale} programs={programs || []} instructors={instructors || []} />
      </div>
    </div>
  );
}
