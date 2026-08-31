import React from 'react';
import { getDictionary } from '@/lib/dictionary';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import UserHomeClient from '@/components/home/UserHomeClient';

export const metadata = {
  title: 'Home | Taheel',
  description: 'Your personal learning dashboard',
};

export default async function UserHomePage({ params: { locale } }) {
  const dict = await getDictionary(locale);
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If not logged in, redirect to login page
  if (!session) {
    redirect(`/${locale}/login`);
  }

  // Fetch user profile if needed
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <main className="min-h-screen bg-[#F8F9FB] pt-28 pb-10">
      <UserHomeClient 
        dict={dict} 
        locale={locale} 
        user={session.user} 
        profile={profile} 
      />
    </main>
  );
}
