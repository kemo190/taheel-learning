import ProfileTabs from "@/components/profile/ProfileTabs";
import { getDictionary } from "@/dictionaries/getDictionary";
import { createClient } from "@/utils/supabase/server";

export default async function ProfilePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return <div>{dict?.profile?.error?.auth || "Authentication error"}</div>;
  }

  // Fetch the profile data from public.profiles
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return (
      <div>{dict?.profile?.error?.loadProfile || "Error loading profile"}</div>
    );
  }

  return (
    <ProfileTabs locale={locale} profile={profile} user={user} dict={dict} />
  );
}

// Trigger CodeRabbit review
