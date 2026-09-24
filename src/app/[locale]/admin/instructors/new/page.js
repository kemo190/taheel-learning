import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import NewInstructorForm from "@/components/admin/NewInstructorForm";

export const metadata = { title: "إضافة مدرب جديد | تأهيل Admin" };

export default async function NewInstructorPage({ params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">إضافة مدرب جديد</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">أضف بيانات المدرب لربطه بالمسارات لاحقاً</p>
        </div>
      </div>
      <div className="bg-white rounded-sm p-8 border border-slate-200">
        <NewInstructorForm locale={locale} />
      </div>
    </div>
  );
}
