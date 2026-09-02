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
    <header className="bg-[#F2F7FF] sticky top-0 z-50 md:px-4">
      <div className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px] flex items-center justify-between gap-x-2 py-3 md:py-4 border-b border-gray-300">
        {/* Right Section: Mobile Menu, Logo & Nav */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-12 shrink-0">
          {/* Mobile Menu (Hamburger) */}
          <div className="md:hidden flex items-center">
            <MobileMenu dict={dict} locale={locale} navLinks={navLinks} />
          </div>

          <Link
            href={`/${locale}`}
            aria-label="Home"
            className="flex items-center"
          >
            <Logo />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-[#5c6b81] font-light text-[18px] pt-1.5">
            {navLinks.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="group flex items-center gap-1.5 border-b-2 border-transparent hover:border-[#0b2646] hover:text-[#0b2646] transition-all"
              >
                <span>{link.name}</span>
                {link.hasDropdown && (
                  <ChevronDownIcon className="w-4 h-4 text-gray-400 mt-0.5 group-hover:text-[#0b2646] transition-colors" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center Section: Search Bar */}
        <div className="hidden md:flex flex-1 justify-center max-w-[550px] mx-4 lg:mx-8">
          <form
            action={`/${locale}/search`}
            method="GET"
            className="relative w-full"
          >
            <input
              type="text"
              placeholder={dict.navbar.searchPlaceholder}
              className="w-full bg-white border border-[#c4d4fb] rounded-full py-2.5 ps-4 pe-11 text-[14px] text-gray-700 placeholder-[#a0aec0] focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] transition-all"
            />
            <button className="absolute end-1 top-1 bottom-1 w-9 flex items-center justify-center bg-transparent border-0 text-[#8fa7e6] hover:text-[#0b2646] transition-colors">
              <SearchIcon className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Left Section: Actions */}
        <div className="flex items-center justify-end flex-1 md:flex-none gap-1 sm:gap-4 shrink-0">
          <Link
            href={`/${locale}/business`}
            className="hidden xl:block text-[#5c6b81] hover:text-[#0b2646] text-[15px] font-medium transition-colors"
          >
            Taheel Business
          </Link>

          {/* Auth Buttons - Conditional rendering via AuthNav */}
          <AuthNav
            dict={dict}
            locale={locale}
            initialUser={user}
            initialProfile={profile}
          />

          {/* Cart */}
          <button
            className="relative p-1.5 text-[#8fa7e6] hover:text-[#0b2646] transition-colors"
            aria-label="Cart"
          >
            <CartIcon className="w-5 sm:w-[22px] h-5 sm:h-[22px]" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-white">
              1
            </span>
          </button>

          {/* Language Switcher - Hidden on mobile (moved to drawer) */}
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}
