"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function JourneyCourseCard({
  id,
  title = "السرد القصصي",
  type = "مسجل تفاعلى",
  progress = 0,
  imageSrc = "/hero-student.jpg",
  dict,
  locale = "ar",
}) {
  const href = `/${locale}/learn/${id}`;
  const courseHref = `/${locale}/tracks/${id}`;

  return (
    <div className="flex min-h-full w-full flex-col space-y-3 overflow-hidden rounded-2xl border border-slate-100 bg-white pb-3 shadow-sm hover:shadow-md transition-shadow">
      <Link
        className="relative h-[211px] w-full bg-gray-50 overflow-hidden block"
        href={href}
      >
        <div className="relative h-full w-full overflow-hidden">
          <Image
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            src={imageSrc}
          />
        </div>
        <span className="flex h-fit w-fit gap-2 rounded-tl-2xl rounded-br-2xl px-3 py-2 text-center text-sm font-bold text-[#0b2646] bg-white/90 backdrop-blur-sm shadow-sm absolute start-0 bottom-0 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-users"
            aria-hidden="true"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <circle cx="9" cy="7" r="4"></circle>
          </svg>
          {type}
        </span>
      </Link>
      <div className="flex flex-1 flex-col px-5 py-2">
        <Link href={courseHref}>
          <h2 className="text-[#0b2646] line-clamp-2 text-[17px] font-bold hover:text-blue-600 transition-colors">
            {title}
          </h2>
        </Link>
        <div className="mt-auto h-fit w-full pt-4">
          <span className="text-slate-500 ms-auto mb-2 flex w-fit text-xs font-bold">
            {progress}% مكتمل
          </span>
          <div
            aria-valuemax="100"
            aria-valuemin="0"
            role="progressbar"
            className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="absolute top-0 bottom-0 right-0 h-full transition-all bg-[#FBBC04] rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            {progress === 100 && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-check"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}
            <Link
              className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 text-mainBlue hover:bg-[#DEDEDE] rounded-2xl border border-[#E1E1E1] bg-[#F8F8FE] font-normal text-base py-3 h-10 px-8 flex-1"
              href={href}
            >
              {progress === 100
                ? "متابعة"
                : dict?.journey?.courseCard?.startNow || "أبدأ الان"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-left ltr:rotate-180"
                aria-hidden="true"
              >
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
