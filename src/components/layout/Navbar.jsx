import Link from "next/link";
import { getDictionary } from "@/dictionaries/getDictionary";
import { createClient } from "@/utils/supabase/server";
import MobileMenu from "./MobileMenu";
import AuthNav from "./AuthNav";
import LanguageSwitcher from "./LanguageSwitcher";

const ChevronDownIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
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

const CartIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

// --- Logo Component ---
const Logo = () => (
  <div
    className="flex items-center text-[#0b2646] font-extrabold text-[32px] tracking-tight"
    style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
  >
    Ta&apos;hel
  </div>
);

// --- Main Header Component ---
export default async function Navbar({ locale = "ar" }) {
  const dict = await getDictionary(locale);

  // Fetch user session on the server to prevent client-side blink
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url, full_name, certificate_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const navLinks = [
    { name: dict.navbar.courses, hasDropdown: true, href: `/${locale}` },
    { name: dict.navbar.paths, hasDropdown: false, href: `/${locale}` },
  ];

  const targetLocale = locale === "ar" ? "en" : "ar";
  const toggleLabel = locale === "ar" ? "EN" : "AR";

  return (
    <header className="bg-[#e8eef5] sticky top-0 z-50">
      
      {/* =========================================
          DESKTOP LAYOUT (Hidden on Mobile)
      ========================================= */}
      <div className="hidden md:flex mx-auto max-w-[1200px] items-center justify-between gap-x-4 py-5 px-4">
        
        {/* Right Section: Logo */}
        <div className="flex items-center shrink-0">
          <Link href={`/${locale}`} aria-label="Home" className="flex items-center">
            <Logo />
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className="flex-1 justify-center max-w-[600px] mx-4">
          <form action={`/${locale}/search`} method="GET" className="relative w-full flex items-center">
            <input
              type="text"
              placeholder={dict.navbar.searchPlaceholder}
              className="w-full bg-white border border-slate-300 rounded-full py-2.5 ps-5 pe-24 text-[15px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0b2646] transition-all"
            />
            <button className="absolute end-1.5 top-1.5 bottom-1.5 px-6 flex items-center justify-center bg-[#0b2646] hover:bg-[#0d2e55] text-white font-bold rounded-full transition-colors">
              ابحث
            </button>
          </form>
        </div>

        {/* Left Section: Navigation & Actions */}
        <div className="flex items-center justify-end gap-6 shrink-0">
          
          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-slate-600 font-medium text-[16px]">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="hover:text-[#0b2646] transition-colors flex items-center gap-1"
              >
                <span>{link.name}</span>
                {link.hasDropdown && <ChevronDownIcon className="w-4 h-4" />}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="w-px h-6 bg-slate-200"></div>

          {/* Auth & Cart Actions */}
          <div className="flex items-center justify-end gap-4">
            <AuthNav
              dict={dict}
              locale={locale}
              initialUser={user}
              initialProfile={profile}
            />
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE LAYOUT (Hidden on Desktop)
      ========================================= */}
      <div className="md:hidden flex flex-col gap-4 px-4 py-4">
        
        {/* Top Row: Search & Menu */}
        <div className="flex items-center gap-3 w-full">
          {/* Search Bar (First -> Right in RTL) */}
          <form action={`/${locale}/search`} method="GET" className="relative w-full flex-1">
            <input
              type="text"
              placeholder={dict.navbar.searchPlaceholder}
              className="w-full bg-white border border-slate-300 rounded-full py-2.5 ps-4 pe-20 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#0b2646] transition-all shadow-sm"
            />
            <button className="absolute end-1.5 top-1.5 bottom-1.5 px-4 flex items-center justify-center bg-[#0b2646] hover:bg-[#0d2e55] text-white font-bold rounded-full transition-colors text-xs">
              ابحث
            </button>
          </form>

          {/* Hamburger (Second -> Left in RTL) */}
          <div className="shrink-0">
            <MobileMenu dict={dict} locale={locale} navLinks={navLinks} />
          </div>
        </div>

        {/* Bottom Row: Logo Centered */}
        <div className="flex justify-center w-full">
          <Link href={`/${locale}`} aria-label="Home" className="flex items-center">
            <Logo />
          </Link>
        </div>

      </div>
    </header>
  );
}
