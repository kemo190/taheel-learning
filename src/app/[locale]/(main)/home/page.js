import React from 'react';
import { getDictionary } from '@/dictionaries/getDictionary';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import UserHomeClient from '@/components/home/UserHomeClient';

export const metadata = {
  title: 'Home | Taheel',
  description: 'Your personal learning dashboard',
};

export default async function UserHomePage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, redirect to login page
  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch user profile if needed
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <main className="min-h-screen">
      <UserHomeClient 
        dict={dict} 
        locale={locale} 
        user={user} 
        profile={profile} 
      />
    </main>
  );
}


// Trigger CodeRabbit review
