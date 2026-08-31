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
      category: 'accounting',
      isBestSeller: true,
      title: dict.coursesSection.mockCourses.accounting.title,
      instructor: dict.coursesSection.mockCourses.accounting.instructor,
      image: "/course-placeholder.svg",
      rating: "4.8",
      students: "1.2K",
      price: "450"
    },
    {
      id: 2,
      category: 'banking',
      isBestSeller: true,
      title: dict.coursesSection.mockCourses.banking.title,
      instructor: dict.coursesSection.mockCourses.banking.instructor,
      image: "/course-placeholder.svg",
      rating: "4.7",
      students: "850",
      price: "500"
    },
    {
      id: 3,
      category: 'hr',
      isBestSeller: true,
      title: dict.coursesSection.mockCourses.hr.title,
      instructor: dict.coursesSection.mockCourses.hr.instructor,
      image: "/course-placeholder.svg",
      rating: "4.9",
      students: "2.1K",
      price: "400"
    },
    {
      id: 4,
      category: 'sales',
      isBestSeller: false,
      title: dict.coursesSection.mockCourses.sales.title,
      instructor: dict.coursesSection.mockCourses.sales.instructor,
      image: "/course-placeholder.svg",
      rating: "4.6",
      students: "1.5K",
      price: "550"
    },
    {
      id: 5,
      category: 'marketing',
      isBestSeller: false,
      title: dict.coursesSection.mockCourses.marketing.title,
      instructor: dict.coursesSection.mockCourses.marketing.instructor,
      image: "/course-placeholder.svg",
      rating: "4.8",
      students: "3.2K",
      price: "350"
    },
    {
      id: 6,
      category: 'audit',
      isBestSeller: false,
      title: dict.coursesSection.mockCourses.audit.title,
      instructor: dict.coursesSection.mockCourses.audit.instructor,
      image: "/course-placeholder.svg",
      rating: "4.7",
      students: "900",
      price: "600"
    }
  ];

  const filteredCourses = mockCourses.filter((course) => {
    if (activeCategory === 'bestSeller') return course.isBestSeller;
    return course.category === activeCategory;
  });

  const activeCategoryLabel = categories.find(c => c.id === activeCategory)?.label;

  return (
    <section className="w-full overflow-hidden py-16 md:py-24 mx-auto max-w-[96%] min-[1410px]:max-w-[1400px]" dir={isRtl ? 'rtl' : 'ltr'}>

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
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              dict={dict}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="w-full bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center min-h-[300px] mb-12">
          <div className="text-gray-300 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-2.5V19.5z"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {dict.coursesSection.noCoursesTitle}
          </h3>
          <p className="text-gray-500 text-center max-w-md">
            {dict.coursesSection.noCoursesDesc}
          </p>
        </div>
      )}

      {/* View All Button */}
      <div className="flex justify-center px-4 md:px-0">
        <a href={`/${locale}/courses`} className="w-full sm:w-auto bg-[#0b2646] hover:bg-[#061528] text-white px-8 py-3.5 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-colors shadow-md">
          <span>{dict.coursesSection.viewAllBtn} {activeCategoryLabel ? `( ${activeCategoryLabel} )` : ''}</span>
          <ArrowLeftIcon className={isRtl ? '' : 'rotate-180'} />
        </a>
      </div>

    </section>
  );
}
