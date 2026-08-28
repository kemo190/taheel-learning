'use client';
import React from 'react';

export default function FavoriteCourseCard({
  dict,
  title,
  instructor,
  rating,
  price,
  type,
  imageSrc
}) {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-3xl border border-[#D6D6D6] bg-white shadow-lg shadow-[#0b264626] transition-transform hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-[211px] w-full bg-gray-50">
        <img alt={title} loading="lazy" className="h-full w-full object-cover" src={imageSrc} />
        <span className="flex h-fit w-fit gap-2 rounded-full rounded-ss-none rounded-es-none px-3 py-2 text-center text-sm font-bold text-white [&>svg]:size-5 bg-primary-mainBlue absolute start-0 bottom-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          {type}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col items-center px-4 py-5 text-center">
        <h2 className="text-primary-darkBlue text-lg font-bold line-clamp-1">{title}</h2>
        <p className="text-gray-500 text-sm mt-1 mb-3">{dict?.journey?.courseCard?.instructorPrefix || "مع"} {instructor}</p>
        
        <div className="flex w-full justify-between items-center mb-4 px-2">
           <div className="inline-flex items-center gap-1 bg-transparent px-2 py-1">
             <span className="text-xs font-bold text-[#515B6F]">{rating}</span>
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
           </div>
           <span className="text-primary-mainBlue text-lg font-bold">{price} {dict?.journey?.courseCard?.currency || "ج.م"}</span>
        </div>

        {/* Footer Actions */}
        <div className="flex w-full items-center justify-between gap-2 flex-wrap sm:flex-nowrap mt-auto">
          {/* Heart & Cart */}
          <div className="flex shrink-0">
            <button className="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#F8F8FE] text-red-500 hover:bg-red-50 transition-colors me-2 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
            <button className="relative flex items-center justify-center h-8 w-8 rounded-full bg-[#F8F8FE] text-primary-mainBlue hover:bg-blue-50 transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </button>
          </div>
          
          {/* Subscribe Button */}
          <button className="relative inline-flex flex-1 sm:flex-none items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer transition-colors text-primary-mainBlue hover:bg-gray-100 rounded-2xl border border-gray-200 bg-[#F8F8FE] font-medium text-sm h-10 px-4 min-w-[120px]">
            {dict?.journey?.favoriteCard?.subscribeNow || "اشترك الآن"}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-180">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
