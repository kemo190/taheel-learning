'use client';
import React from 'react';
import Link from 'next/link';

export default function FavoriteCourseCard({
  dict,
  locale = 'ar',
  title,
  instructor,
  rating,
  learners,
  price,
  oldPrice,
  discount,
  type,
  imageSrc
}) {
  const isLive = type === "بث مباشر";
  const badgeColor = isLive ? "bg-[#c1131c]" : "bg-[#0b2646]";
  
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[20px] border border-[#D6D6D6] bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image Section */}
      <div className="relative h-[200px] w-full bg-gray-50">
        <img alt={title} loading="lazy" className="h-full w-full object-cover" src={imageSrc} />
        <span className={`flex items-center gap-1.5 h-fit w-fit rounded-full rounded-tr-none rtl:rounded-tl-none rtl:rounded-tr-[20px] rounded-bl-none rtl:rounded-br-none px-4 py-1.5 text-center text-[13px] font-bold text-white [&>svg]:size-4 ${badgeColor} absolute bottom-0 right-0 rtl:right-0 rtl:left-auto ltr:left-auto z-10`}>
          {isLive ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2"></circle>
              <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          )}
          {type}
        </span>
      </div>

      {/* Content Section */}
      <div className="flex flex-col px-4 py-4 w-full flex-1">
        <h2 className="text-[#0b2646] text-lg font-bold line-clamp-1 text-right w-full" dir="rtl">{title}</h2>
        <p className="text-[#5e6c84] text-xs mt-1 mb-4 text-right w-full" dir="rtl">
          {dict?.journey?.courseCard?.instructorPrefix || "مع"} {instructor}
        </p>
        
        <div className="flex w-full justify-between items-center mb-4" dir="rtl">
          {/* Right side (badges) */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D6D6D6] px-2 py-1 text-xs font-bold text-[#0b2646]">
              {Number(rating).toFixed(1)}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-0.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </span>
            <span className="inline-flex items-center rounded-full border border-[#D6D6D6] px-2 py-1 text-xs font-medium text-[#0b2646]">
              {learners} {dict?.userHome?.featuredCourse?.learners || "متعلم"}
            </span>
          </div>
          {/* Left side (price) */}
          <div className="flex items-center gap-1.5" dir="ltr">
            {price === 0 ? (
              <>
                <b className="text-[#0b2646] text-lg font-bold">مجاني</b>
                {oldPrice && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-xs line-through">{oldPrice} ج.م</span>
                    <span className="bg-[#c1131c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">{discount}</span>
                  </div>
                )}
              </>
            ) : (
              <b className="text-[#0b2646] text-lg font-bold">{price} <span className="text-sm font-sans">{dict?.journey?.courseCard?.currency || "ج.م"}</span></b>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex w-full items-center justify-between gap-3 mt-auto pt-2" dir="rtl">
          {/* Subscribe Button */}
          <button className="relative inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer transition-colors text-[#0b2646] hover:bg-[#f0f6ff] rounded-2xl border border-[#eef2f6] bg-[#f8f8fe] font-bold text-[15px] h-11 px-4">
            {dict?.journey?.favoriteCard?.subscribeNow || "اشترك الآن"}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ltr:rotate-180">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>

          {/* Cart & Heart */}
          <div className="flex shrink-0 gap-2 items-center">
            <button className="relative flex items-center justify-center h-11 w-11 rounded-full bg-[#f8f8fe] border border-[#eef2f6] text-[#0b2646] hover:bg-[#f0f6ff] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </button>
            <button className="relative flex items-center justify-center h-11 w-11 rounded-full bg-[#f8f8fe] border border-[#eef2f6] text-[#c1131c] hover:bg-[#fff0f0] transition-colors duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
