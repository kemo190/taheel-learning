import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

import { getDictionary } from "@/dictionaries/getDictionary";

export const metadata = {
  title: "Profile - Taheel",
  description: "User Profile Page",
};

export default async function ProfileLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Protect the route
  if (!user || error) {
    redirect(`/${locale}/login`);
  }

  // Fetch the profile data
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, certificate_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="w-full bg-transparent">
      {children}
    </div>
  );
}

