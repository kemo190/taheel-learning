import { createClient } from '@/utils/supabase/server';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { getDictionary } from '@/dictionaries/getDictionary';

export default async function ProfilePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();
  
  // Get the user ID (Layout already protected the route so we know user exists)
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch the profile data from public.profiles
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return (
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          {locale === 'ar' ? 'خطأ في جلب البيانات' : 'Error fetching data'}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          {locale === 'ar' ? 'عذراً، حدث خطأ أثناء جلب بيانات الملف الشخصي. يرجى المحاولة مرة أخرى لاحقاً.' : 'Sorry, an error occurred while fetching profile data. Please try again later.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ProfileTabs 
        locale={locale} 
        profile={profile} 
        userId={user.id} 
        dict={dict}
      />
    </div>
  );
}
