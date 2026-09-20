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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0b2646]">إضافة مسار جديد</h1>
        <p className="text-gray-500 text-sm mt-1">أضف مسار تدريبي جديد للمنصة</p>
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <NewTrackForm locale={locale} programs={programs || []} />
      </div>
    </div>
  );
}
