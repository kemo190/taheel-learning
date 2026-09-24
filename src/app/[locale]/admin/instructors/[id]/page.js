import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditInstructorForm from "@/components/admin/EditInstructorForm";

export const metadata = { title: "تعديل بيانات المدرب | تأهيل Admin" };

export default async function EditInstructorPage({ params }) {
  const { locale, id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/${locale}/login`);

  const { data: instructor } = await supabase
    .from("instructors")
    .select("*")
    .eq("id", id)
    .single();

  if (!instructor) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0b2646]">تعديل بيانات المدرب</h1>
          <p className="text-slate-500 text-sm mt-1.5 font-medium">تعديل معلومات وتفاصيل المدرب</p>
        </div>
      </div>
      <div className="bg-white rounded-sm p-8 border border-slate-200">
        <EditInstructorForm locale={locale} instructor={instructor} />
      </div>
    </div>
  );
}
