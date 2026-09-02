import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { getDictionary } from '@/dictionaries/getDictionary';

export const metadata = {
  title: 'Profile - Taheel',
  description: 'User Profile Page',
};

export default async function ProfileLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();

  // Protect the route
  if (!user || error) {
    redirect(`/${locale}/login`);
  }

  // Fetch the profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, certificate_name, avatar_url')
    .eq('id', user.id)
    .single();

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-4">
      <div className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px]">
        {/* Header */}
        <ProfileHeader user={user} profile={profile} locale={locale} dict={dict} />
        
        {children}
      </div>
    </div>
  );
}

// Trigger CodeRabbit review
