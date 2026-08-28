'use client';
import React from 'react';

export default function JourneyCourseCard({ 
  title = "السرد القصصي",
  type = "مسجل تفاعلى",
  progress = 0,
  imageSrc = "https://new-eyouth-learning-website.s3.us-east-2.amazonaws.com/media/courses-media/stoytelling/thumbnail/Storytelling.webp?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA3TEZMNC3TLUMTQNM%2F20260828%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Date=20260828T122304Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=3bc7ddf2d57cad9b57f0a3924962a879a33f03ae9cfa6465f0b5db95009ef749",
  href = "/ar/lms/r/stoytelling?lesson=objectives-2",
  courseHref = "/ar/courses/stoytelling",
  dict,
  locale
}) {
  return (
    <div className="flex min-h-full w-full flex-col space-y-3 overflow-hidden rounded-3xl border border-[#D6D6D6] bg-white pb-3 shadow-lg shadow-[#0b264626]">
      <a className="relative h-[211px] w-full rounded-lg bg-gray-50" href={href}>
        <div className="relative h-full w-full overflow-hidden">
          <img alt={title} loading="lazy" width="300" height="211" decoding="async" className="h-full w-full object-cover" src={imageSrc} style={{ color: 'transparent' }} />
        </div>
        <span className="flex h-fit w-fit gap-2 rounded-full rounded-ss-none rounded-es-none px-3 py-2 text-center text-sm font-bold text-white [&>svg]:size-5 bg-primary-mainBlue absolute start-0 bottom-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users" aria-hidden="true">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          {type}
        </span>
      </a>
      <div className="flex flex-1 flex-col px-4">
        <a href={courseHref}>
          <h2 className="text-primary-darkBlue line-clamp-2 text-base font-medium">{title}</h2>
        </a>
        <div className="mt-auto h-fit w-full">
          <span className="text-darkBlue ms-auto mb-2 flex w-fit text-xs font-bold">{progress}%</span>
          <div aria-valuemax="100" aria-valuemin="0" role="progressbar" data-state="indeterminate" data-max="100" data-slot="progress" className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div data-state="indeterminate" data-value={`${progress}%`} data-max="100" data-slot="progress-indicator" className="relative h-full w-full flex-1 transition-all bg-darkBlue" style={{ transform: `translateX(-${100 - progress}%)` }}></div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            {progress === 100 && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-mainBlue text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
            )}
            <a className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 text-mainBlue hover:bg-[#DEDEDE] rounded-2xl border border-[#E1E1E1] bg-[#F8F8FE] font-normal text-base py-3 h-10 px-8 flex-1" href={href}>
              {progress === 100 ? "متابعة" : (dict?.journey?.courseCard?.startNow || "أبدأ الان")}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left ltr:rotate-180" aria-hidden="true">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
