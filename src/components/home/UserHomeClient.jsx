"use client";

import React from 'react';
import Link from 'next/link';
import { dummyInProgressCourses, dummyFavoriteCourses } from '@/data/dummyCourses';
import JourneyCourseCard from '@/components/journey/JourneyCourseCard';
import FavoriteCourseCard from '@/components/journey/FavoriteCourseCard';

export default function UserHomeClient({ dict, locale, user, profile }) {
  const isRtl = locale === 'ar';
  
  // Safe default name if profile isn't fully loaded
  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || (isRtl ? 'صديقي' : 'Friend');

  return (
    <div className="w-full max-w-[1400px] mx-auto py-8 px-4 md:px-0" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 1. Welcome Banner */}
      <section className="mb-12 rounded-3xl bg-[#0b2646] overflow-hidden relative shadow-xl shadow-[#0b264640]">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="2" fill="#ffffff"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)"/>
          </svg>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white flex-1 text-center md:text-start">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {dict?.userHome?.welcome} <span className="text-[#3b82f6]">{firstName}</span>!
            </h1>
            <p className="text-base md:text-lg text-gray-300 md:w-3/4 leading-relaxed font-medium">
              {dict?.userHome?.welcomeSubtitle}
            </p>
          </div>
          
          <div className="shrink-0 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full p-6 border border-white/20 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rocket">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
              <path d="m12 15-3-3a22 22 0 0 1 3.86-8.99c.39-.46 1-.58 1.5-.27l3.6 2.4c.54.36.63 1.13.19 1.63A22 22 0 0 1 15 12z"/>
              <path d="m15 12-3-3a22 22 0 0 0-8.99 3.86c-.46.39-.58 1-.27 1.5l2.4 3.6c.36.54 1.13.63 1.63.19A22 22 0 0 0 12 15z"/>
              <path d="m22 2-7 7"/>
              <path d="m16 9 3 3"/>
            </svg>
          </div>
        </div>
      </section>

      {/* 2. Continue Learning Section */}
      {dummyInProgressCourses.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#0b2646] flex items-center gap-2 md:gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3b82f6]">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {dict?.userHome?.continueLearning}
            </h2>
            <Link href={`/${locale}/journey`} className="text-[#3b82f6] font-bold text-sm hover:underline flex items-center gap-1 shrink-0">
              {dict?.userHome?.viewAll}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-180">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show only the first 2 in-progress courses for the home dashboard */}
            {dummyInProgressCourses.slice(0, 2).map((course) => (
              <JourneyCourseCard 
                key={course.id}
                title={course.title}
                progress={course.progress}
                type={course.type}
                imageSrc={course.imageSrc}
                dict={dict}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. Recommended Courses */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-[#0b2646] flex items-center gap-2 md:gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#3b82f6]">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
            </svg>
            {dict?.userHome?.recommendedCourses}
          </h2>
          <Link href={`/${locale}/courses`} className="text-[#3b82f6] font-bold text-sm hover:underline flex items-center gap-1 shrink-0">
            {dict?.userHome?.viewAll}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-180">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyFavoriteCourses.map((course) => (
            <FavoriteCourseCard 
              key={course.id}
              title={course.title}
              instructor={course.instructor}
              rating={course.rating}
              price={course.price}
              imageSrc={course.imageSrc}
              type={course.type}
              dict={dict}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* 4. Learning Paths Promo */}
      <section className="rounded-3xl bg-gradient-to-r from-blue-50 to-[#EEF2FF] border border-[#DEDEDE] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="flex-1 text-center md:text-start">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#3b82f6] text-sm font-bold mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>
            </svg>
            {dict?.userHome?.learningPaths}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0b2646] mb-3">
            {dict?.userHome?.learningPaths}
          </h2>
          <p className="text-[#4b5563] text-base md:text-lg mb-6">
            {dict?.userHome?.explorePaths}
          </p>
          <Link href={`/${locale}/paths`} className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-[#0b2646] text-white font-bold hover:bg-[#061528] transition-colors shadow-lg">
            {dict?.userHome?.viewAll}
          </Link>
        </div>
        <div className="shrink-0 hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        </div>
      </section>

    </div>
  );
}
