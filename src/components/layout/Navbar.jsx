import Link from 'next/link';
import { getDictionary } from '@/dictionaries/getDictionary';

const ChevronDownIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const SearchIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const CartIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

// --- Logo Component ---
const Logo = () => (
  <div className="flex items-center text-[#0b2646] font-extrabold text-[32px] tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
    Ta'hel
  </div>
);

// --- Main Header Component ---
export default async function Navbar({ locale = 'ar' }) {
  const dict = await getDictionary(locale);
  
  const navLinks = [
    { name: dict.navbar.courses, hasDropdown: true, href: `/${locale}` },
    { name: dict.navbar.paths, hasDropdown: false, href: `/${locale}` },
  ];

  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const toggleLabel = locale === 'ar' ? 'EN' : 'AR';

  return (
    <header className="bg-[#F2F7FF] sticky top-0 z-50 md:px-4">
      <div className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px] flex items-center justify-between gap-2 py-4 border-b border-[#e1e9ff]">
      
      {/* Right Section: Logo & Nav */}
      <div className="flex items-center gap-6 lg:gap-12">
        <Link href={`/${locale}`} aria-label="Home" className="flex items-center">
          <Logo />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[#5c6b81] font-light text-[18px]">
          {navLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="group flex items-center gap-1.5 pb-1 border-b-2 border-transparent hover:border-[#0b2646] hover:text-[#0b2646] transition-all"
            >
              <span>{link.name}</span>
              {link.hasDropdown && <ChevronDownIcon className="w-4 h-4 text-gray-400 mt-0.5 group-hover:text-[#0b2646] transition-colors" />}
            </Link>
          ))}
        </nav>
      </div>

      {/* Center Section: Search Bar */}
      <div className="hidden lg:flex flex-1 justify-center max-w-[550px] mx-8">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder={dict.navbar.searchPlaceholder} 
            className="w-full bg-white border border-[#c4d4fb] rounded-full py-2.5 ps-4 pe-11 text-[14px] text-gray-700 placeholder-[#a0aec0] focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] transition-all"
          />
          <button className="absolute end-1 top-1 bottom-1 w-9 flex items-center justify-center bg-transparent border-0 text-[#8fa7e6] hover:text-[#0b2646] transition-colors">
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Left Section: Actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        <Link href={`/${locale}/business`} className="hidden xl:block text-[#5c6b81] hover:text-[#0b2646] text-[15px] font-medium transition-colors">
          Taheel Business
        </Link>

        {/* Cart */}
        <button className="relative p-1.5 text-[#c4d4fb] hover:text-[#0b2646] transition-colors" aria-label="Cart">
          <CartIcon className="w-5 h-5" />
        </button>
        
        {/* Auth Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button className="bg-transparent border border-[#0b2646] text-[#0b2646] hover:bg-[#f0f4ff] px-5 py-2 rounded-md text-[15px] font-medium transition-colors">
            {dict.navbar.login}
          </button>
          <button className="bg-[#0b2646] hover:bg-[#061528] text-white px-5 py-2 rounded-md text-[15px] font-medium transition-colors shadow-sm">
            {dict.navbar.register}
          </button>
        </div>

        {/* Language Switcher */}
        <Link 
          href={`/${targetLocale}`} 
          className="bg-[#0b2646] hover:bg-[#061528] text-white w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors shadow-sm ms-1 sm:ms-0 tracking-wider"
        >
          {toggleLabel}
        </Link>
      </div>
      
      </div>
    </header>
  );
}
