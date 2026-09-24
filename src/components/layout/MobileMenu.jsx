"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MenuIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const CloseIcon = (props) => (
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
    {...props}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const SearchIcon = (props) => (
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
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const HomeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const BookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-2.5V19.5z" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M10 6h6" />
    <path d="M10 10h6" />
    <path d="M10 14h6" />
  </svg>
);
const FolderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const GlobeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export default function MobileMenu({ dict, locale, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTracksOpen, setIsTracksOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { createClient } = await import("@/utils/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push(`/${locale}`);
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <button
        className="p-2 text-[#0b2646] bg-transparent rounded-lg active:scale-95 transition-transform"
        onClick={() => setIsOpen(true)}
        aria-label={dict.navbar.openMenu}
        aria-expanded={isOpen}
      >
        <MenuIcon className="w-7 h-7" />
      </button>

      {/* Full Screen Mobile Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dict.navbar.mainMenu}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 md:hidden animate-in fade-in zoom-in-95 duration-200"
        >
          {/* Close Button at Top Center */}
          <div className="absolute top-10 flex justify-center w-full">
            <button
              className="p-2 text-[#2d3748] hover:text-[#0b2646] transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label={dict.navbar.closeMenu}
              autoFocus
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Centered Links */}
          <nav className="flex flex-col items-center gap-8 w-full max-w-sm mt-12">
            
            <Link
              href={`/${locale}/courses`}
              className="text-lg font-medium text-[#718096] hover:text-[#0b2646] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {dict.navbar.courses}
            </Link>

            <div className="w-full flex flex-col items-center">
              <button
                className="flex items-center gap-2 text-lg font-medium text-[#718096] hover:text-[#0b2646] transition-colors"
                onClick={() => setIsTracksOpen(!isTracksOpen)}
              >
                مسارات التعلم
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isTracksOpen ? "rotate-180" : ""}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              
              {isTracksOpen && (
                <div className="flex flex-col items-center gap-4 mt-6 animate-in slide-in-from-top-2 duration-200">
                  {["محاسبة", "تحليل مالى", "تسويق", "المراجعة", "HR", "Business information systems (bis)"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/${locale}/tracks?category=${encodeURIComponent(cat)}`}
                      className="text-base text-slate-500 hover:text-[#0b2646]"
                      onClick={() => setIsOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {user ? (
              <>
                <Link
                  href={`/${locale}/profile`}
                  className="text-lg font-medium text-[#718096] hover:text-[#0b2646] transition-colors mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  {dict?.navbar?.userMenu?.journey || "رحلتي التعليمية"}
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-48 text-center py-3.5 mt-2 rounded-full border border-slate-300 text-[#0b2646] font-bold text-lg hover:bg-slate-50 transition-colors"
                >
                  {dict?.navbar?.userMenu?.logout || "تسجيل الخروج"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="text-lg font-medium text-[#718096] hover:text-[#0b2646] transition-colors mt-4"
                  onClick={() => setIsOpen(false)}
                >
                  {dict.navbar.login}
                </Link>

                <Link
                  href={`/${locale}/register`}
                  className="w-48 text-center py-3.5 mt-2 rounded-full border border-slate-300 text-[#0b2646] font-bold text-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  إنشاء حساب
                </Link>
              </>
            )}

          </nav>
        </div>
      )}
    </>
  );
}
