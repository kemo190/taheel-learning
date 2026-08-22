'use client';
import { useState } from 'react';
import Link from 'next/link';

const MenuIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-2.5V19.5z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M10 6h6"/><path d="M10 10h6"/><path d="M10 14h6"/></svg>
);
const FolderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
);
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
);
const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default function MobileMenu({ dict, locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const targetLocale = locale === 'ar' ? 'en' : 'ar';

  return (
    <>
      <button 
        className="p-1 text-[#0b2646] hover:bg-[#f0f4ff] rounded-md transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open Menu"
      >
        <MenuIcon />
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/40 md:hidden animate-in fade-in" onClick={() => setIsOpen(false)}></div>
          
          <div className="fixed top-0 bottom-0 start-0 w-[85%] max-w-[320px] z-[100] bg-white flex flex-col p-4 md:hidden animate-in slide-in-from-start-8 duration-300 shadow-2xl">
            
            <div className="flex justify-start mb-6">
              <button className="p-1 text-gray-500 hover:text-[#0b2646]" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </button>
            </div>

            {/* Search */}
            <div className="mb-8 relative px-2">
              <input 
                type="text" 
                placeholder={dict.navbar.searchPlaceholder} 
                className="w-full bg-[#f8fbff] border border-[#c4d4fb] rounded-xl py-3 px-12 text-sm text-[#0b2646] placeholder-[#5c6b81] focus:outline-none focus:border-[#0b2646] transition-colors"
              />
              <div className="absolute top-3.5 right-6 rtl:right-6 rtl:left-auto ltr:left-6 ltr:right-auto text-[#8fa7e6]">
                <SearchIcon />
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-6 px-4">
              <Link href={`/${locale}`} className="flex items-center justify-end gap-3 text-lg font-medium text-[#0b2646] pb-6 border-b border-gray-100" onClick={() => setIsOpen(false)}>
                <span>الرئيسية</span>
                <HomeIcon />
              </Link>

              <div className="flex items-center justify-between pb-6 border-b border-gray-100 text-[#0b2646]">
                <ChevronDownIcon />
                <Link href={`/${locale}`} className="flex items-center gap-3 text-lg font-medium" onClick={() => setIsOpen(false)}>
                  <span>{dict.navbar.courses}</span>
                  <BookIcon />
                </Link>
              </div>

              <Link href={`/${locale}`} className="flex items-center justify-end gap-3 text-lg font-medium text-[#0b2646] pb-6 border-b border-gray-100" onClick={() => setIsOpen(false)}>
                <span>{dict.navbar.paths}</span>
                <FolderIcon />
              </Link>

              <div className="flex items-center justify-between pb-6 border-b border-gray-100 text-[#0b2646]">
                {/* Custom AR/EN Toggle */}
                <Link href={`/${targetLocale}`} className="flex items-center bg-[#f0f4ff] border border-[#c4d4fb] rounded-full overflow-hidden text-[13px] font-bold" onClick={() => setIsOpen(false)}>
                  <span className={`px-3 py-1 ${locale === 'ar' ? 'bg-[#0b2646] text-white shadow-sm rounded-full' : 'text-[#0b2646]'}`}>AR</span>
                  <span className={`px-3 py-1 ${locale === 'en' ? 'bg-[#0b2646] text-white shadow-sm rounded-full' : 'text-[#0b2646]'}`}>EN</span>
                </Link>
                <div className="flex items-center gap-3 text-lg font-medium">
                  <span>{locale === 'ar' ? 'العربية' : 'English'}</span>
                  <GlobeIcon />
                </div>
              </div>

              <Link href={`/${locale}/business`} className="flex items-center justify-end gap-3 text-lg font-medium text-[#0b2646] pb-6 border-b border-gray-100" onClick={() => setIsOpen(false)}>
                <span>Eyouth Business</span>
                <BriefcaseIcon />
              </Link>
            </nav>

          </div>
        </>
      )}
    </>
  );
}
