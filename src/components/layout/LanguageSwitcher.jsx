"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher({ locale }) {
  const pathname = usePathname();
  const targetLocale = locale === 'ar' ? 'en' : 'ar';
  const toggleLabel = locale === 'ar' ? 'EN' : 'AR';
  
  // Replace the current locale in the pathname with the target locale
  // pathname is something like /ar/profile or /en/profile
  const redirectPath = pathname ? pathname.replace(`/${locale}`, `/${targetLocale}`) : `/${targetLocale}`;

  return (
    <Link 
      href={redirectPath} 
      className="hidden md:flex bg-[#0b2646] hover:bg-[#061528] text-white w-8 h-8 rounded-full items-center justify-center text-[11px] font-bold transition-colors shadow-sm ms-1 tracking-wider"
    >
      {toggleLabel}
    </Link>
  );
}

// Trigger CodeRabbit review 2
