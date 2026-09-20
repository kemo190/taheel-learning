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
  <img src="/images/logo.png" alt="Ta'hel" className="h-20 md:h-28 object-contain w-auto" />
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
    { name: dict.navbar.paths, hasDropdown: true, href: `/${locale}/tracks` },
    { name: dict.navbar.courses, hasDropdown: false, href: `/${locale}/courses` },
  ];

  const targetLocale = locale === "ar" ? "en" : "ar";
  const toggleLabel = locale === "ar" ? "EN" : "AR";

  return (
    <header className="bg-white sticky top-0 z-50">
      
      {/* =========================================
          DESKTOP LAYOUT (Hidden on Mobile)
      ========================================= */}
      <div className="hidden md:flex mx-auto max-w-[1200px] items-center justify-between gap-x-4 py-2 px-4">
        
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
              <div key={idx} className="relative group">
                <Link
                  href={link.href}
                  className="hover:text-[#0b2646] transition-colors flex items-center gap-1 py-4"
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDownIcon className="w-4 h-4 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <div className="absolute top-full right-0 w-72 bg-white shadow-2xl rounded-none border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50 overflow-hidden">
                    <div className="p-3 flex flex-col gap-1">
                      {["محاسبة", "تحليل مالى", "تسويق", "المراجعة", "HR", "Business information systems (bis)"].map((cat) => (
                        <Link
                          key={cat}
                          href={`/${locale}/tracks?category=${encodeURIComponent(cat)}`}
                          className="group/link flex items-center gap-3 px-4 py-3 hover:bg-[#f8fafd] text-slate-600 hover:text-[#0b2646] rounded-none transition-all duration-200 text-[15px] font-medium"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/link:bg-[#FBBC04] transition-colors"></div>
                          {cat}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
      <div className="md:hidden flex items-center justify-between px-4 py-1 w-full relative">
        {/* Invisible spacer for flex balance */}
        <div className="w-10 shrink-0"></div>

        {/* Logo (Centered) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href={`/${locale}`} aria-label="Home" className="flex items-center shrink-0">
            <Logo />
          </Link>
        </div>

        {/* Hamburger Menu (Left side in RTL) */}
        <div className="shrink-0">
          <MobileMenu dict={dict} locale={locale} navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
