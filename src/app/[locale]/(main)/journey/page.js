import React from "react";
import { getDictionary } from "@/dictionaries/getDictionary";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import JourneyHeader from "@/components/journey/JourneyHeader";
import JourneyTabs from "@/components/journey/JourneyTabs";
import JourneyCourseCard from "@/components/journey/JourneyCourseCard";

import EmptyState from "@/components/journey/EmptyState";
import FavoriteCourseCard from "@/components/journey/FavoriteCourseCard";
import CertificateCard from "@/components/journey/CertificateCard";
const dummyCertificates = [];
const dummyUserStats = {
  achievements: 0,
  learningMinutes: 0,
  liveSessions: 0,
  completedLessons: 0,
};

export default async function JourneyPage({ params, searchParams }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const dict = await getDictionary(locale);
  const supabase = await createClient();

  const resolvedSearchParams = await searchParams;
  const currentTab = resolvedSearchParams?.tab || "in-progress";
  const currentType = resolvedSearchParams?.type || "courses";

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Fetch profile if needed (for display name)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch student enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      *,
      tracks (
        id, title_ar, image_url, delivery_mode, price, rating, learners_count, original_price,
        programs (title_ar),
        track_instructors (
          instructors (bio)
        )
      )
    `)
    .eq("student_id", user.id)
    .eq("status", "approved");

  const safeEnrollments = enrollments || [];

  // Map to UI format and fetch progress for each
  const allEnrolledCourses = await Promise.all(safeEnrollments.map(async (enroll) => {
    const t = enroll.tracks;
    
    // Call the database function to calculate progress percentage
    const { data: progress } = await supabase.rpc("get_track_completion", {
      p_student_id: user.id,
      p_track_id: t.id,
    });

    return {
      id: t.id,
      title: t.title_ar,
      progress: progress || 0,
      imageSrc: t.image_url || '/hero-student.jpg',
      type: t.delivery_mode === 'live' ? 'بث مباشر' : t.delivery_mode === 'hybrid' ? 'مدمج' : 'مسجل تفاعلي',
    };
  }));

  const inProgressCourses = allEnrolledCourses.filter(c => c.progress < 100);
  const completedCourses = allEnrolledCourses.filter(c => c.progress === 100);

  // Fetch real favorites
  const { data: favoriteRecords } = await supabase
    .from("favorites")
    .select(`
      tracks (
        id, title_ar, image_url, delivery_mode, price, rating,
        track_instructors(instructors(bio))
      )
    `)
    .eq("student_id", user.id);

  const favoriteCourses = (favoriteRecords || []).map(f => {
    const t = f.tracks;
    if (!t) return null;
    let instructorName = "تأهيل";
    if (t.track_instructors?.[0]?.instructors?.bio) {
      instructorName = t.track_instructors[0].instructors.bio.split("-")[0].trim();
    }
    return {
      id: t.id,
      title: t.title_ar,
      instructor: instructorName,
      rating: t.rating || 0,
      price: t.price || 0,
      imageSrc: t.image_url || '/hero-student.jpg',
      type: t.delivery_mode === 'live' ? 'بث مباشر' : t.delivery_mode === 'hybrid' ? 'مدمج' : 'مسجل تفاعلي',
    };
  }).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f8fbff] py-10">
      <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
        {/* Header Section */}
        <JourneyHeader
          dict={dict}
          user={user}
          profile={profile}
          locale={locale}
          userStats={{
            achievements: 0,
            learningMinutes: 0,
            liveSessions: 0,
            completedLessons: 0,
          }}
        />

        {/* Main Content Area: Always shows Filters, conditionally shows Grid/EmptyState */}
        <section className="rounded-3xl bg-white p-5 shadow-xl shadow-[#0b264626] xl:p-10 mb-12">
          
          {/* Text Tabs for navigation */}
          <JourneyTabs
            dict={dict}
            locale={locale}
            inProgressCount={inProgressCourses.length}
            completedCount={completedCourses.length}
            favoritesCount={favoriteCourses.length}
            certificatesCount={dummyCertificates.length}
          />
          <div className="space-y-5 rounded-2xl border-gray-300 p-4 xl:p-6">
            {/* Conditionally Render Content Based on Tab and Type */}
            {currentTab === "in-progress" && currentType === "courses" && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch">
                {inProgressCourses.length > 0 ? (
                  inProgressCourses.map((course) => (
                    <JourneyCourseCard
                      key={course.id}
                      id={course.id}
                      dict={dict}
                      locale={locale}
                      title={course.title}
                      progress={course.progress}
                      imageSrc={course.imageSrc}
                      type={course.type}
                    />
                  ))
                ) : (
                  <div className="col-span-full w-full flex justify-center">
                    <EmptyState
                      imageSrc="/empty.png"
                      title=""
                      subtitle="لا توجد مسارات قيد التقدم"
                      description="تصفح مكتبتنا واشترك في المسارات لبدء التعلم."
                      locale={locale}
                    />
                  </div>
                )}
              </div>
            )}

            {currentTab === "in-progress" && currentType === "paths" && (
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

            {currentTab === "favorites" && currentType === "courses" && (
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-primary-mainBlue text-2xl font-bold mb-8">
                  {dict?.journey?.empty?.favoritesCoursesSubtitle ||
                    "المفضلة (الدورات التدريبية)"}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch w-full">
                  {favoriteCourses.map((course) => (
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

            {currentTab === "favorites" && currentType === "paths" && (
              <div className="mt-8 flex flex-col items-center">
                <h2 className="text-primary-mainBlue text-2xl font-bold mb-8">
                  {dict?.journey?.empty?.favoritesPathsSubtitle ||
                    "المفضلة (مسارات)"}
                </h2>
                <EmptyState
                  imageSrc="/empty.png"
                  title=""
                  subtitle={
                    dict?.journey?.empty?.noFavoritePaths ||
                    "لا توجد مسارات مفضلة بعد"
                  }
                  description={
                    dict?.journey?.empty?.noFavoritePathsDesc ||
                    "استكشف مكتبتنا وأضف المسارات إلى مفضلتك."
                  }
                  locale={locale}
                />
              </div>
            )}

            {currentTab === "certificates" && (
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

            {currentTab === "completed" && currentType === "courses" && (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 place-items-center sm:place-items-stretch">
                {completedCourses.length > 0 ? (
                  completedCourses.map((course) => (
                    <JourneyCourseCard
                      key={course.id}
                      id={course.id}
                      dict={dict}
                      locale={locale}
                      title={course.title}
                      progress={course.progress}
                      imageSrc={course.imageSrc}
                      type={course.type}
                    />
                  ))
                ) : (
                  <div className="col-span-full w-full flex justify-center">
                    <EmptyState
                      imageSrc="/empty.png"
                      title=""
                      subtitle="لا توجد مسارات مكتملة بعد"
                      description="أكمل مساراً لتراه هنا."
                      locale={locale}
                    />
                  </div>
                )}
              </div>
            )}

            {currentTab === "completed" && currentType === "paths" && (
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

            {currentTab === "notes" && (
              <div className="mt-8">
                <EmptyState
                  imageSrc="/empty.png"
                  title=""
                  subtitle={
                    dict?.journey?.empty?.notesSubtitle || "لا توجد ملاحظات بعد"
                  }
                  description={
                    dict?.journey?.empty?.notesDesc ||
                    "يمكنك إضافة ملاحظاتك أثناء مشاهدة الدورات للرجوع إليها لاحقاً."
                  }
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

