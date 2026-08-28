import React from 'react';
import { getDictionary } from '@/dictionaries/getDictionary';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import JourneyHeader from '@/components/journey/JourneyHeader';
import JourneyStats from '@/components/journey/JourneyStats';
import CoursePathComparison from '@/components/journey/CoursePathComparison';
import JourneyTabsAndFilter from '@/components/journey/JourneyTabsAndFilter';
import JourneyCourseCard from '@/components/journey/JourneyCourseCard';

import EmptyState from '@/components/journey/EmptyState';
import FavoriteCourseCard from '@/components/journey/FavoriteCourseCard';
import CertificateCard from '@/components/journey/CertificateCard';
import { dummyInProgressCourses, dummyCompletedCourses, dummyFavoriteCourses, dummyCertificates, dummyUserStats } from '@/data/dummyCourses';

export default async function JourneyPage({ params, searchParams }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const resolvedSearchParams = await searchParams;
  const currentTab = resolvedSearchParams?.tab || 'in-progress';
  const currentType = resolvedSearchParams?.type || 'courses';

  // Get user session
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch profile if needed (for display name)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-[#f8fbff] py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        {/* Header Section */}
        <JourneyHeader 
          dict={dict} 
          user={user} 
          profile={profile} 
          locale={locale}
          userStats={dummyUserStats}
        />
        
        {/* Stats Section */}
        <JourneyStats 
          dict={dict} 
          locale={locale} 
          currentTab={currentTab} 
          inProgressCount={dummyInProgressCourses.length}
          completedCount={dummyCompletedCourses.length}
          favoritesCount={dummyFavoriteCourses.length}
          certificatesCount={dummyCertificates.length}
        />

        {/* Comparison Section (Always visible as per user request) */}
        <CoursePathComparison dict={dict} locale={locale} />

        {/* Main Content Area: Always shows Filters, conditionally shows Grid/EmptyState */}
        <section className="rounded-3xl bg-white p-5 shadow-xl shadow-[#0b264626] xl:p-10 mb-12">
          <div className="space-y-5 rounded-2xl border-gray-300 p-4 xl:p-6">
            
            {/* Tabs and Filters (Always visible) */}
            <JourneyTabsAndFilter dict={dict} locale={locale} />

            {/* Conditionally Render Content Based on Tab and Type */}
            {currentTab === 'in-progress' && currentType === 'courses' && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch">
                {dummyInProgressCourses.map((course) => (
                  <JourneyCourseCard 
                    key={course.id}
                    dict={dict} 
                    locale={locale} 
                    title={course.title}
                    progress={course.progress}
                    imageSrc={course.imageSrc}
                    type={course.type}
                  />
                ))}
              </div>
            )}
            
            {currentTab === 'in-progress' && currentType === 'paths' && (
              <div className="mt-8">
                 <EmptyState 
                   imageSrc="/empty.png" 
                   title=""
                   subtitle="لا توجد مسارات قيد التقدم" 
                   description="سجل في مسار لبدء رحلتك التعليمية." 
                   locale={locale} 
                 />
              </div>
            )}

            {currentTab === 'favorites' && currentType === 'courses' && (
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-primary-mainBlue text-2xl font-bold mb-8">
                  {dict?.journey?.empty?.favoritesCoursesSubtitle || "المفضلة (الدورات التدريبية)"}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch w-full">
                  {dummyFavoriteCourses.map((course) => (
                    <FavoriteCourseCard 
                      key={course.id}
                      dict={dict}
                      title={course.title}
                      instructor={course.instructor}
                      rating={course.rating}
                      price={course.price}
                      type={course.type}
                      imageSrc={course.imageSrc}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'favorites' && currentType === 'paths' && (
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-primary-mainBlue text-2xl font-bold mb-8">
                  {dict?.journey?.empty?.favoritesPathsSubtitle || "المفضلة (مسارات)"}
                </h2>
                <EmptyState 
                  imageSrc="/empty.png"
                  title=""
                  subtitle={dict?.journey?.empty?.noFavoritePaths || "لا توجد مسارات مفضلة بعد"}
                  description={dict?.journey?.empty?.noFavoritePathsDesc || "استكشف مكتبتنا وأضف المسارات إلى مفضلتك."}
                  locale={locale}
                />
              </div>
            )}

            {currentTab === 'certificates' && (
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-primary-mainBlue text-2xl font-bold mb-8">
                  {dict?.journey?.overview?.certificates || "الشهادات"}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch w-full">
                  {dummyCertificates.map((cert) => (
                    <CertificateCard 
                      key={cert.id}
                      dict={dict}
                      title={cert.title}
                      completionDate={cert.completionDate}
                      imageSrc={cert.imageSrc}
                    />
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'completed' && currentType === 'courses' && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch">
                {dummyCompletedCourses.map((course) => (
                  <JourneyCourseCard 
                    key={course.id}
                    dict={dict} 
                    locale={locale} 
                    title={course.title}
                    progress={course.progress}
                    imageSrc={course.imageSrc}
                    type={course.type}
                  />
                ))}
              </div>
            )}
            
            {currentTab === 'completed' && currentType === 'paths' && (
              <div className="mt-8">
                <EmptyState 
                  imageSrc="/empty.png"
                  title=""
                  subtitle="لا توجد مسارات مكتملة بعد"
                  description="أكمل مساراً لتراه هنا."
                  locale={locale}
                />
              </div>
            )}
            
            {currentTab === 'notes' && (
              <div className="mt-8">
                <EmptyState 
                  imageSrc="/empty.png"
                  title=""
                  subtitle={dict?.journey?.empty?.notesSubtitle || "لا توجد ملاحظات بعد"}
                  description={dict?.journey?.empty?.notesDesc || "يمكنك إضافة ملاحظاتك أثناء مشاهدة الدورات للرجوع إليها لاحقاً."}
                  locale={locale}
                />
              </div>
            )}
            
          </div>
        </section>
      </div>
    </div>
  );
}
