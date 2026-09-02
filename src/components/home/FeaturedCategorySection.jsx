"use client";
import React from "react";
import Link from "next/link";
import FavoriteCourseCard from "@/components/journey/FavoriteCourseCard";

export default function FeaturedCategorySection({
  dict,
  locale = "ar",
  title,
  courses = [],
  categoryName,
  categoryLabel,
}) {
  const isRtl = locale === "ar";

  if (!courses || courses.length === 0) return null;

  return (
    <section className="mx-auto mt-16 w-full max-w-[96%] xl:max-w-[1400px] space-y-6">
      {/* Section Title */}
      <h4
        className="text-[32px] text-[#0b2646] font-bold text-right"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {title}
      </h4>

      {/* Courses Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {courses.map((course) => (
          <FavoriteCourseCard
            key={course.id}
            dict={dict}
            locale={locale}
            title={course.title}
            instructor={course.instructor}
            rating={course.rating}
            learners={course.learners}
            price={course.price}
            oldPrice={course.oldPrice}
            discount={course.discount}
            type={course.type}
            imageSrc={course.imageSrc}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center w-full mt-10 pt-4">
        <Link
          href={`/${locale}/courses?category=${categoryName}`}
          className="inline-flex items-center gap-2 bg-[#0b2646] text-white hover:bg-[#061528] px-8 py-3 rounded-full font-bold text-[15px] transition-colors shadow-sm"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {dict?.userHome?.viewAllCourses}{" "}
          {categoryLabel ? `( ${categoryLabel} )` : ""}
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
  );
}
