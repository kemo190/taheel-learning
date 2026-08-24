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

  return (
    <div className="bg-[#f8fafc] min-h-screen py-10 px-4">
      <div className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px]">
        {/* Header */}
        <ProfileHeader user={user} locale={locale} dict={dict} />
        
        {children}
      </div>
    </div>
  );
}
