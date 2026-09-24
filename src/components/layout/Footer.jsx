import Link from "next/link";
import Image from "next/image";
import { getDictionary } from "@/dictionaries/getDictionary";

export default async function Footer({ locale = "ar" }) {
  const dict = await getDictionary(locale);
  const isRtl = locale === "ar";

  return (
    <footer
      dir={isRtl ? "rtl" : "ltr"}
      className="relative mt-auto overflow-hidden bg-white text-[#0b2646] border-t border-gray-200"
    >
      <div className="relative z-10 mx-auto max-w-[1400px] w-full px-4 md:px-6 pt-16 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          
          {/* Column 1: Logo & About */}
          <div className="flex flex-col items-center text-center gap-4">
            <Link href={`/${locale}`} className="inline-block mb-2 mt-2">
              <div className="relative w-56 h-20">
                <Image 
                  src="/images/logo.png" 
                  alt="Taheel Logo" 
                  fill 
                  className="object-contain object-center"
                />
              </div>
            </Link>
            <p className="text-[#0b2646]/70 text-sm leading-relaxed max-w-[240px]">
              وجهتك الأولى لتطوير المهارات واكتساب المعرفة لسوق العمل بكفاءة عالية.
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-[#0b2646] text-lg font-bold mb-2">
              {dict.footer?.platform || "المنصة التعليمية"}
            </h2>
            <ul className="flex flex-col items-center gap-3">
              <li>
                <Link href={`/${locale}/courses?delivery_type=recorded`} className="text-[#0b2646]/80 hover:text-[#FBBC04] transition-colors text-[15px]">
                  {dict.footer?.recordedCourses || "الدورات المسجلة"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/courses?delivery_type=live`} className="text-[#0b2646]/80 hover:text-[#FBBC04] transition-colors text-[15px]">
                  {dict.footer?.liveCourses || "الدورات التدريبية المباشرة"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/instructors`} className="text-[#0b2646]/80 hover:text-[#FBBC04] transition-colors text-[15px]">
                  {dict.footer?.instructors || "المدربين"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about-us`} className="text-[#0b2646]/80 hover:text-[#FBBC04] transition-colors text-[15px]">
                  {dict.footer?.aboutUs || "عن تأهيل"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-[#0b2646] text-lg font-bold mb-2">
              {dict.footer?.policiesTitle || "سياسات المنصة"}
            </h2>
            <ul className="flex flex-col items-center gap-3">
              <li>
                <Link href={`/${locale}/privacy-policy`} className="text-[#0b2646]/80 hover:text-blue-600 transition-colors text-[15px]">
                  {dict.footer?.privacyPolicy || "سياسة الخصوصية"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/platform-policy`} className="text-[#0b2646]/80 hover:text-blue-600 transition-colors text-[15px]">
                  {dict.footer?.platformPolicy || "سياسات المنصة"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/refund-policy`} className="text-[#0b2646]/80 hover:text-blue-600 transition-colors text-[15px]">
                  {dict.footer?.refundPolicy || "سياسة الاسترداد"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms-and-conditions`} className="text-[#0b2646]/80 hover:text-blue-600 transition-colors text-[15px]">
                  {dict.footer?.termsConditions || "الشروط والأحكام"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faqs`} className="text-[#0b2646]/80 hover:text-blue-600 transition-colors text-[15px]">
                  {dict.footer?.faqs || "الأسئلة الشائعة"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col items-center text-center gap-4">
            <h2 className="text-[#0b2646] text-lg font-bold mb-2">
              {dict.footer?.stayInTouch || "ابق على تواصل"}
            </h2>
            <div className="flex flex-col items-end gap-3">
              <a href="mailto:support@tahel.com" className="flex items-center gap-2 text-[#0b2646]/80 hover:text-blue-600 transition-colors">
                <span className="text-[15px] dir-ltr font-medium">support@tahel.com</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#0b2646]"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </a>
              
              <Link href={`/${locale}/contact-us`} className="flex items-center gap-2 text-[#0b2646]/80 hover:text-blue-600 transition-colors">
                <span className="text-[15px] font-medium">{dict.footer?.contactUs || "تواصل معنا"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0b2646]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </Link>
            </div>
          </div>

        </div>
        
        {/* Bottom Bar: Social Icons & Copyright */}
        <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-6 border-t border-gray-100 pt-6">
          
          <p className="text-[#0b2646]/70 text-sm font-medium">
            {dict.footer?.copyright || "جميع الحقوق محفوظة © تأهيل."}
          </p>

          <div className="flex items-center gap-4">
            <a href="#" target="_blank" rel="noreferrer" className="text-[#0b2646] hover:text-[#FBBC04] transition-colors">
              <span className="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="text-[#0b2646] hover:text-[#FBBC04] transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="text-[#0b2646] hover:text-[#FBBC04] transition-colors">
              <span className="sr-only">Twitter / X</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" target="_blank" rel="noreferrer" className="text-[#0b2646] hover:text-[#FBBC04] transition-colors">
              <span className="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
