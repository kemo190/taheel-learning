"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  dummyInProgressCourses,
  dummyFavoriteCourses,
  dummyAICourses,
  dummyMarketingCourses,
} from "@/data/dummyCourses";
import JourneyCourseCard from "@/components/journey/JourneyCourseCard";
import FavoriteCourseCard from "@/components/journey/FavoriteCourseCard";
import FeaturedCourse from "./FeaturedCourse";
import FeaturedCategorySection from "./FeaturedCategorySection";

export default function UserHomeClient({ dict, locale, user, profile }) {
  const isRtl = locale === "ar";

  // Safe default name if profile isn't fully loaded
  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    (isRtl ? "صديقي" : "Friend");

  return (
    <div
      className="w-full max-w-[1400px] mx-auto pb-16 pt-6 px-4 md:px-0"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* 1. Welcome Banner (Hero After Login) */}
      <section
        className="mx-auto w-full max-w-[96%] xl:max-w-[1400px] rounded-[30px] flex flex-col md:flex-row ltr:md:flex-row-reverse items-center justify-evenly gap-6 bg-cover bg-center bg-no-repeat px-8 max-md:py-8 relative overflow-hidden"
        style={{ backgroundImage: 'url("/hero_after_login.jpg")' }}
      >
        <div className="flex md:basis-[547px] flex-col gap-4 relative z-10 p-6 md:p-8 text-center items-center justify-center">
          <h1 className="text-white text-3xl md:text-[40px] font-bold leading-snug w-full">
            {dict?.userHome?.bannerTitle}
          </h1>
          <h2 className="text-white/90 max-w-[414px] text-lg font-medium leading-relaxed w-full">
            {dict?.userHome?.bannerSubtitle}
          </h2>
          <Link
            href={`/${locale}/courses`}
            className="relative inline-flex w-full items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer rounded-2xl text-lg font-bold transition-colors bg-white text-[#0b2646] hover:bg-gray-100 h-[3.125rem] px-[1.5rem] py-3 mt-4"
          >
            {dict?.userHome?.subscribeNow}
          </Link>
        </div>
        <Image
          alt="Hero Illustration"
          width={584}
          height={414}
          className="mt-auto hidden max-w-[50%] scale-x-[-1] md:block h-auto"
          src="/person-before-login.webp"
          priority
        />
      </section>

      {/* 2. Featured Course (اختيارنا الأفضل لك) */}
      <FeaturedCourse dict={dict} locale={locale} />

      {/* 3. Your Favorites (المفضلة لديك) */}
      <section className="mx-auto mt-16 w-full max-w-[96%] xl:max-w-[1400px] space-y-6">
        <h4
          className="text-[32px] text-[#0b2646] font-bold text-start"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {dict?.userHome?.favoritesTitle}
        </h4>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {dummyFavoriteCourses.map((course) => (
            <FavoriteCourseCard
              key={course.id}
              dict={dict}
              locale={locale}
              title={course.title}
              instructor={course.instructor}
              rating={course.rating}
              learners={course.learners}
              price={course.price}
              type={course.type}
              imageSrc={course.imageSrc}
            />
          ))}
        </div>

        <div
          className="flex justify-start w-full mt-6"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 text-[#0b2646] font-bold text-[15px] hover:underline transition-all"
          >
            {dict?.userHome?.viewAllCourses}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={isRtl ? "rotate-180" : ""}
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* 4. AI Skills Section */}
      <FeaturedCategorySection
        dict={dict}
        locale={locale}
        title={dict?.userHome?.aiSkillsTitle}
        categoryName="ai"
        categoryLabel={dict?.profile?.form?.workFields?.ai}
        courses={dummyAICourses}
      />

      {/* 5. Marketing Skills Section */}
      <FeaturedCategorySection
        dict={dict}
        locale={locale}
        title={dict?.userHome?.marketingSkillsTitle}
        categoryName="marketing"
        categoryLabel={dict?.profile?.form?.workFields?.marketing}
        courses={dummyMarketingCourses}
      />
    </div>
  );
}
