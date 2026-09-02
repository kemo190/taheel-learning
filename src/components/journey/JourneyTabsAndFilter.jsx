'use client';
import React, { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function JourneyTabsAndFilter({ dict, locale }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRtl = locale === 'ar';
  
  const activeTab = searchParams.get('type') || 'courses';

  const handleToggle = (newType) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', newType);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  return (
    <div className="flex flex-col xl:flex-row items-center gap-4 mb-8 w-full" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Category Dropdown */}
      <div className="relative z-50 w-full xl:w-auto">
        {isCategoryOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsCategoryOpen(false)}
          />
        )}
        <button
          type="button"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          role="combobox"
          aria-expanded={isCategoryOpen}
          className="relative z-50 focus:ring-border-default text-[#0b2646] flex h-9 cursor-pointer items-center justify-between px-4 text-sm whitespace-nowrap focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white [&>span]:line-clamp-1 min-h-12 gap-3 bg-[#FAFAFA] rounded-2xl border border-[#DEDEDE] w-full xl:w-56 py-6 shadow-[#0b264626] shadow-sm"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-11">
            <path d="M12 5L20 5" stroke="#051359" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M4 19L7 19" stroke="#051359" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M4 5L8 5" stroke="#051359" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M11 19L20 19" stroke="#051359" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M17 12L20 12" stroke="#051359" strokeWidth="2" strokeLinecap="round"></path>
            <path d="M4 12L13 12" stroke="#051359" strokeWidth="2" strokeLinecap="round"></path>
            <circle cx="10" cy="5" r="2" transform="rotate(90 10 5)" stroke="#051359" strokeWidth="2" strokeLinecap="round"></circle>
            <circle cx="15" cy="12" r="2" transform="rotate(90 15 12)" stroke="#051359" strokeWidth="2" strokeLinecap="round"></circle>
            <circle cx="9" cy="19" r="2" transform="rotate(90 9 19)" stroke="#051359" strokeWidth="2" strokeLinecap="round"></circle>
          </svg>
          <div className="flex w-full items-center justify-between truncate dark:text-white">
            <span style={{ pointerEvents: 'none' }}>
              <span className={`truncate ${selectedCategory ? "text-[#0b2646] font-medium" : "text-gray-500 font-medium"}`}>
                {selectedCategory || dict?.journey?.filters?.category || "تصنيف"}
              </span>
            </span>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-chevron-down text-[#0b2646] size-6 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} aria-hidden="true">
            <path d="m6 9 6 6 6-6"></path>
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div className={`absolute top-full ${isRtl ? 'right-0' : 'left-0'} mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden py-2 transition-all duration-200 origin-top ${isCategoryOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
          {[
            dict?.journey?.filters?.categories?.all || 'الكل',
            dict?.journey?.filters?.categories?.oldest || 'من الاقدم للاحدث',
            dict?.journey?.filters?.categories?.newest || 'من الاحدث الي الاقدم',
            dict?.journey?.filters?.categories?.bestseller || 'الاكثر مبيعا',
            dict?.journey?.filters?.categories?.highestRated || 'الاعلي تقيما'
          ].map((option) => (
            <button
              key={option}
              onClick={() => {
                setSelectedCategory(option);
                setIsCategoryOpen(false);
              }}
              className={`w-full text-start px-4 py-2.5 text-sm md:text-base transition-colors ${selectedCategory === option
                ? 'bg-[#0b2646] text-white font-bold'
                : 'text-[#0b2646] hover:bg-blue-50 hover:text-[#0b2646]'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full xl:flex-1">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute start-3 top-1/2 text-gray-400 size-6 -translate-y-1/2">
          <path d="M5.09604 10.1921C3.67299 10.1921 2.46785 9.69854 1.48062 8.71146C0.493541 7.72424 0 6.5191 0 5.09604C0 3.67299 0.493541 2.46785 1.48062 1.48063C2.46785 0.493542 3.67299 0 5.09604 0C6.5191 0 7.72424 0.493542 8.71146 1.48063C9.69854 2.46785 10.1921 3.67299 10.1921 5.09604C10.1921 5.69118 10.0922 6.25958 9.8925 6.80125C9.69264 7.34292 9.42604 7.81403 9.09271 8.21458L13.8877 13.0096C14.0031 13.1249 14.0622 13.2699 14.0648 13.4446C14.0674 13.6193 14.0084 13.767 13.8877 13.8877C13.767 14.0084 13.6206 14.0688 13.4485 14.0688C13.2766 14.0688 13.1303 14.0084 13.0096 13.8877L8.21458 9.09271C7.79792 9.43674 7.31875 9.70597 6.77708 9.90042C6.23542 10.0949 5.67507 10.1921 5.09604 10.1921ZM5.09604 8.94229C6.16979 8.94229 7.07924 8.56965 7.82438 7.82437C8.56965 7.07924 8.94229 6.16979 8.94229 5.09604C8.94229 4.02229 8.56965 3.11285 7.82438 2.36771C7.07924 1.62243 6.16979 1.24979 5.09604 1.24979C4.02229 1.24979 3.11285 1.62243 2.36771 2.36771C1.62243 3.11285 1.24979 4.02229 1.24979 5.09604C1.24979 6.16979 1.62243 7.07924 2.36771 7.82437C3.11285 8.56965 4.02229 8.94229 5.09604 8.94229Z" fill="currentColor"></path>
        </svg>
        <input className="file:text-foreground focus-visible:ring-border-default flex h-9 min-h-[43px] w-full rounded-10 text-sm transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:opacity-70 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base text-[#0b2646] ps-[2.5rem] bg-[#FAFAFA] rounded-2xl border border-[#DEDEDE] px-4 py-6 placeholder:text-[#0b2646]/70 shadow-[#0b264626] shadow-sm" placeholder={dict?.journey?.filters?.search || "ابحث في دوراتي التدريبية"} type="search" defaultValue="" />
      </div>

      {/* Courses / Paths Toggle */}
      <div className="w-full xl:w-auto xl:ms-auto flex justify-center">
        <div className="flex w-full xl:w-fit items-center rounded-2xl border border-[#DEDEDE]">
          <button
            onClick={() => handleToggle('courses')}
            className={`relative inline-flex items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer text-base transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-[3.125rem] px-[1.5rem] py-3 w-1/2 xl:w-48 rounded-2xl font-normal [&_svg]:size-6 ${activeTab === 'courses'
              ? 'bg-[#0b2646] text-white hover:bg-[#061528]'
              : 'text-[#020518] hover:text-[#0b2646] hover:bg-gray-50'
              }`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 6.75003H10.5V17.25H4.5V6.75003ZM17.8725 3.59909C17.8525 3.50224 17.8136 3.41028 17.758 3.32853C17.7023 3.24677 17.6311 3.17682 17.5483 3.12271C17.4655 3.0686 17.3729 3.0314 17.2757 3.01324C17.1784 2.99508 17.0786 2.99633 16.9819 3.01691L12.5934 3.95441C12.3983 3.99751 12.2282 4.11605 12.1202 4.28413C12.0122 4.45222 11.975 4.65622 12.0169 4.85159L13.1053 10.0313L18.9609 8.77316L17.8725 3.59909Z" fill="currentColor" fillOpacity="0.1" className="fill-current"></path>
              <path d="M21.7172 18.2392L18.6056 3.44549C18.5654 3.25203 18.4873 3.06843 18.3759 2.90523C18.2645 2.74203 18.1219 2.60246 17.9564 2.49452C17.7909 2.38659 17.6057 2.31242 17.4114 2.27628C17.2171 2.24014 17.0176 2.24274 16.8244 2.28393L12.4359 3.22705C12.0478 3.31205 11.7089 3.54687 11.4929 3.88044C11.277 4.21401 11.2015 4.61935 11.2828 5.0083L14.3944 19.8021C14.4637 20.1396 14.6471 20.4429 14.9138 20.6611C15.1805 20.8793 15.5142 20.999 15.8588 21.0002C15.9653 21 16.0715 20.9887 16.1756 20.9664L20.5641 20.0233C20.9527 19.9381 21.292 19.7028 21.5079 19.3687C21.7239 19.0345 21.7991 18.6286 21.7172 18.2392ZM12.75 4.70174C12.75 4.69612 12.75 4.6933 12.75 4.6933L17.1375 3.7558L17.4497 5.24362L13.0622 6.18768L12.75 4.70174ZM13.3706 7.65205L17.76 6.70987L18.0731 8.20049L13.6875 9.14362L13.3706 7.65205ZM13.9931 10.6117L18.3825 9.66862L19.6294 15.5974L15.24 16.5405L13.9931 10.6117ZM20.25 18.5571L15.8625 19.4946L15.5503 18.0067L19.9378 17.0627L20.25 18.5486C20.25 18.5542 20.25 18.5571 20.25 18.5571ZM9.75 3.00018H5.25C4.85218 3.00018 4.47064 3.15821 4.18934 3.43952C3.90804 3.72082 3.75 4.10235 3.75 4.50018V19.5002C3.75 19.898 3.90804 20.2795 4.18934 20.5608C4.47064 20.8421 4.85218 21.0002 5.25 21.0002H9.75C10.1478 21.0002 10.5294 20.8421 10.8107 20.5608C11.092 20.2795 11.25 19.898 11.25 19.5002V4.50018C11.25 4.10235 11.092 3.72082 10.8107 3.43952C10.5294 3.15821 10.1478 3.00018 9.75 3.00018ZM5.25 4.50018H9.75V6.00018H5.25V4.50018ZM5.25 7.50018H9.75V16.5002H5.25V7.50018ZM9.75 19.5002H5.25V18.0002H9.75V19.5002Z" fill="currentColor" className="fill-current"></path>
            </svg>
            {dict?.journey?.filters?.courses || "دورات تدريبية"}
          </button>

          <button
            onClick={() => handleToggle('paths')}
            className={`relative inline-flex items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer text-base transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-[3.125rem] px-[1.5rem] py-3 w-1/2 xl:w-48 rounded-2xl font-normal [&_svg]:size-6 ${activeTab === 'paths'
              ? 'bg-[#0b2646] text-white hover:bg-[#061528]'
              : 'text-[#020518] hover:text-[#0b2646] hover:bg-gray-50'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-network" aria-hidden="true">
              <rect x="16" y="16" width="6" height="6" rx="1"></rect>
              <rect x="2" y="16" width="6" height="6" rx="1"></rect>
              <rect x="9" y="2" width="6" height="6" rx="1"></rect>
              <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path>
              <path d="M12 12V8"></path>
            </svg>
            {dict?.journey?.filters?.paths || "مسارات"}
          </button>
        </div>
      </div>
    </div>
  );
}

