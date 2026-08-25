import Link from 'next/link';

export default function Footer({ locale = 'ar' }) {
  return (
    <footer 
      className="bg-white border-t border-gray-200 mt-auto bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url(/footer.webp)' }}
    >
      <div className="absolute inset-0 bg-white/90"></div> {/* Overlay to ensure text readability */}
      <div className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px] relative z-10">
        <div className="relative grid w-full grid-cols-2 gap-6 pt-8 pb-6 md:grid-cols-2 md:pt-12 xl:grid-cols-4">
          <div className="relative order-0">
            <h2 className="text-[#0b2646] mb-3 text-[1.375rem] font-bold">المنصة التعليمية</h2>
            <ul className="flex flex-col gap-2">
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/courses?delivery_type=recorded`}>الدورات المُسجلة</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/courses?delivery_type=live`}>الدورات التدريبية المباشرة</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/instructors`}>المدربين</Link></li>
              <li><a href="https://careers.taheel.com" target="_blank" rel="noreferrer" className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors">الوظائف</a></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/about-us`}>عن تأهيل</Link></li>
            </ul>
          </div>
          
          <div className="relative order-2 col-span-2 md:order-1 md:col-span-1">
            <h2 className="text-[#0b2646] mb-3 text-[1.375rem] font-bold">تأهيل للأعمال</h2>
            <ul className="flex flex-col gap-6">
              <li><a href="https://business.taheel.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#FBBC04] px-4 py-1 text-[#FBBC04] hover:bg-[#FBBC04]/10 transition-colors md:rounded-lg md:px-4 md:py-1 inline-block">تأهيل للأعمال</a></li>
              <li><Link className="border-[#0b2646] text-[#0b2646] rounded-full border px-4 py-1 hover:bg-[#0b2646]/5 transition-colors md:rounded-lg md:px-4 md:py-1 inline-block" href={`/${locale}/join-as-instructor`}>كــــن خبيراً</Link></li>
            </ul>
          </div>
          
          <div className="relative order-1 md:order-2">
            <h2 className="text-[#0b2646] mb-3 text-[1.375rem] font-bold">سياسات المنصة</h2>
            <ul className="flex flex-col gap-1">
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/privacy-policy`}>سياسة الخصوصية</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/platform-policy`}>سياسات المنصة</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/refund-policy`}>سياسة الاسترداد</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/terms-and-conditions`}>الشروط والأحكام</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/trainers-terms-and-conditions`}>شروط وسياسات المدرّبين</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/faqs`}>الأسئلة الشائعة</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/user-guide`}>دليل المستخدم</Link></li>
              <li><Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors" href={`/${locale}/trainer-guide`}>دليل المدرب</Link></li>
            </ul>
          </div>
          
          <div className="order-3 flex flex-col justify-start">
            <h2 className="text-[#0b2646] mb-3 text-[1.375rem] font-bold">ابق على تواصل</h2>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@taheel.com" className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors inline-flex items-center gap-2 whitespace-nowrap">
                <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-[#0b2646]">
                  <path d="M2.19866 0H17.6945C19.1564 0 19.8932 0.690005 19.8932 2.0934V11.9406C19.8932 13.3323 19.1564 14.034 17.6945 14.034H2.19866C0.736785 14.034 0 13.3323 0 11.9406V2.0934C0 0.690005 0.736785 0 2.19866 0ZM9.94075 10.0577L17.8232 3.59036C18.1039 3.35646 18.3261 2.81849 17.9752 2.339C17.6361 1.8595 17.0162 1.84781 16.6069 2.14018L9.94075 6.65445L3.2863 2.14018C2.87697 1.84781 2.25714 1.8595 1.91798 2.339C1.56713 2.81849 1.78934 3.35646 2.07001 3.59036L9.94075 10.0577Z" fill="currentColor"></path>
                </svg>
                support@taheel.com
              </a>
              <Link className="text-[#0b2646] hover:text-[#0b2646]/80 transition-colors flex items-center gap-2 font-medium" href={`/${locale}/contact-us`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-call text-[#0b2646] w-4 h-4" aria-hidden="true">
                  <path d="M13 2a9 9 0 0 1 9 9"></path>
                  <path d="M13 6a5 5 0 0 1 5 5"></path>
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
