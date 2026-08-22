import { createClient } from '@/utils/supabase/server';
import ProfileForm from '@/components/profile/ProfileForm';

export default async function ProfilePage({ params }) {
  const { locale } = params;
  const supabase = await createClient();
  
  // Get the user ID (Layout already protected the route so we know user exists)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the profile data from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="w-full">
      <ProfileForm 
        initialData={profile} 
        locale={locale} 
        userId={user.id} 
      />
    </div>
  );
}
