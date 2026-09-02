import React from 'react';
import Image from 'next/image';

const StarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const UsersIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const ArrowLeftIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export default function CourseCard({ course, dict, locale }) {
  const isRtl = locale === 'ar';

  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(11,38,70,0.08)] transition-shadow duration-300 flex flex-col h-full group">

      {/* Image Container */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Interactive Tag */}
        <div className="absolute bottom-0 rtl:right-0 ltr:left-0 bg-[#0b2646] text-white px-4 py-1.5 rtl:rounded-tl-xl ltr:rounded-tr-xl flex items-center gap-1.5 text-sm font-medium">
          <UsersIcon className="w-4 h-4" />
          <span>{dict.coursesSection.course.interactive}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">

        <h3 className="text-[17px] font-bold text-[#0b2646] mb-1.5 line-clamp-2 leading-tight">
          {course.title}
        </h3>

        <p className="text-[13px] text-gray-500 mb-4 font-medium">
          {course.instructor}
        </p>

        {/* Stats Row & Price */}
        <div className="flex justify-between items-end mt-auto pt-2">

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {course.isBestSeller && (
                <span className="bg-[#fff8e1] text-[#f59e0b] border border-[#fde68a] px-2 py-0.5 rounded-full text-[11px] font-bold">
                  {dict.coursesSection.course.bestSeller}
                </span>
              )}
              <div className="flex items-center gap-1 text-[#f59e0b]">
                <span className="text-sm font-bold text-gray-700">{course.rating}</span>
                <StarIcon />
              </div>
            </div>
            <div className="text-[12px] text-gray-500 font-medium">
              {course.students} {dict.coursesSection.course.learners}
            </div>
          </div>

          <div className="text-xl font-bold text-[#0b2646]">
            {course.price} <span className="text-sm">{dict.coursesSection.course.currency}</span>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-4 border-gray-100" />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 border border-gray-200 rounded-xl text-[#0b2646] hover:bg-[#f0f4ff] hover:border-[#0b2646] transition-colors" aria-label="Add to cart">
            <CartIcon />
          </button>

          <button className="flex-1 flex items-center justify-center gap-2 bg-[#f0f4ff] text-[#0b2646] py-2.5 rounded-xl font-bold text-sm hover:bg-[#0b2646] hover:text-white transition-colors border border-[#c4d4fb] hover:border-[#0b2646]">
            <span>{dict.coursesSection.course.subscribe}</span>
            <ArrowLeftIcon className={isRtl ? '' : 'rotate-180'} />
          </button>
        </div>

      </div>
    </div>
  );
}

// Trigger CodeRabbit review
