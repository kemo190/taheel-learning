'use client';
import React, { useState } from 'react';
import CourseCard from '../courses/CourseCard';

const ArrowLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export default function CoursesSection({ dict, locale }) {
  const isRtl = locale === 'ar';

  // Mapping the dictionary keys to tab IDs
  const categories = [
    { id: 'bestSeller', label: dict.coursesSection.categories.bestSeller },
    { id: 'accounting', label: dict.coursesSection.categories.accounting },
    { id: 'banking', label: dict.coursesSection.categories.banking },
    { id: 'hr', label: dict.coursesSection.categories.hr },
    { id: 'sales', label: dict.coursesSection.categories.sales },
    { id: 'marketing', label: dict.coursesSection.categories.marketing },
    { id: 'audit', label: dict.coursesSection.categories.audit }
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  // Mock data for courses
  const mockCourses = [
    {
      id: 1,
      title: "أساسيات المحاسبة وإعداد التقارير المالية",
      instructor: "مع نخبة من الخبراء",
      image: "/course-placeholder.svg",
      rating: "4.8",
      students: "1.2K",
      price: "450"
    },
    {
      id: 2,
      title: "أساسيات العمل المصرفي وإدارة المخاطر",
      instructor: "مع نخبة من الخبراء",
      image: "/course-placeholder.svg",
      rating: "4.7",
      students: "850",
      price: "500"
    },
    {
      id: 3,
      title: "إدارة الموارد البشرية واستقطاب المواهب",
      instructor: "مع نخبة من الخبراء",
      image: "/course-placeholder.svg",
      rating: "4.9",
      students: "2.1K",
      price: "400"
    }
  ];

  return (
    <section className="py-16 md:py-24 mx-auto max-w-[96%] min-[1410px]:max-w-[1400px]">

      {/* Header Section */}
      <div className="flex flex-col items-start mb-10 text-start">
        <h2 className="text-3xl md:text-[38px] font-extrabold text-[#0b2646] mb-3 tracking-tight">
          {dict.coursesSection.title}
        </h2>
        <p className="text-[#5c6b81] text-[17px] md:text-lg font-medium">
          {dict.coursesSection.subtitle}
        </p>
      </div>

      {/* Categories Navigation */}
      <div className="relative mb-10 border-b border-gray-300 overflow-x-auto scrollbar-hide">
        <div className="flex w-max min-w-full">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`pb-4 px-2 rtl:ml-8 ltr:mr-8 whitespace-nowrap text-[15px] font-bold transition-colors relative ${activeCategory === category.id
                ? 'text-[#0b2646]'
                : 'text-[#5c6b81] hover:text-[#0b2646]'
                }`}
            >
              {category.label}
              {activeCategory === category.id && (
                <div className="absolute bottom-[-1px] rtl:right-0 ltr:left-0 w-full h-[3px] bg-[#0b2646] rounded-t-md"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            dict={dict}
            locale={locale}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center">
        <button className="bg-[#0b2646] hover:bg-[#061528] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-md">
          <span>{dict.coursesSection.viewAllBtn}</span>
          <ArrowLeftIcon className={isRtl ? '' : 'rotate-180'} />
        </button>
      </div>

    </section>
  );
}
