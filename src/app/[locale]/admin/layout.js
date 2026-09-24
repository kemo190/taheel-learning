import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Panel | Taheel",
};

export default async function AdminLayout({ children, params }) {
  const { locale } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect(`/${locale}`);
  }

  return (
    <div className="flex min-h-screen" style={{ background: "linear-gradient(180deg, rgba(251, 188, 4, 0.05) 0%, #ffffff 100%)" }} dir="rtl">
      <AdminSidebar locale={locale} adminName={profile.full_name} />
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-[1400px] mx-auto">{children}</div>
      </main>
    </div>
  );
}
