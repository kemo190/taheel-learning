import Link from 'next/link';
import Image from 'next/image';

export default function Footer({ locale = 'ar' }) {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[#eff2f6] border-t border-gray-200 xl:h-[388px]">
      <img
        alt="Background"
        loading="lazy"
        decoding="async"
        className="!w-full object-cover opacity-20 rtl:scale-x-[-1]"
        style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0, color: 'transparent' }}
        src="/footer.webp"
      />
      <div className="mx-auto max-w-[1232px] w-full px-4 xl:px-0 relative z-10 flex flex-col justify-between h-full">
        <div className="relative grid w-full grid-cols-2 gap-6 pt-8 pb-6 md:grid-cols-2 md:pt-12 xl:grid-cols-4">
          <div className="relative order-0">
            <h2 className="text-primary-darkBlue mb-3 text-[1.375rem] font-bold">المنصة التعليمية</h2>
            <ul className="flex flex-col gap-2">
              <li><Link className="text-primary-darkBlue" href={`/${locale}/courses?delivery_type=recorded`}>الدورات المُسجلة</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/courses?delivery_type=live`}>الدورات التدريبية المباشرة</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/instructors`}>المدربين</Link></li>
              <li><a href="https://careers.eyouthlearning.com" target="_blank" rel="noreferrer" className="text-primary-darkBlue">الوظائف</a></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/about-us`}>عن eyouth</Link></li>
            </ul>
          </div>
          <div className="relative order-2 col-span-2 md:order-1 md:col-span-1">
            <h2 className="text-primary-darkBlue mb-3 text-[1.375rem] font-bold">eyouth للاعمال</h2>
            <ul className="flex flex-col gap-6">
              <li><a href="https://eyouthbusiness.com" target="_blank" rel="noreferrer" className="rounded-full border border-[#FBBC04] px-4 py-1 text-[#FBBC04] md:rounded-lg md:px-4 md:py-1">eyouth للاعمال</a></li>
              <li><Link className="border-primary-mainBlue text-primary-mainBlue rounded-full border px-4 py-1 md:rounded-lg md:px-4 md:py-1" href={`/${locale}/join-as-instructor`}>كــــن خبيراً</Link></li>
            </ul>
          </div>
          <div className="relative order-1 md:order-2">
            <h2 className="text-primary-darkBlue mb-3 text-[1.375rem] font-bold">سياسات المنصة</h2>
            <ul className="flex flex-col gap-1">
              <li><Link className="text-primary-darkBlue" href={`/${locale}/privacy-policy`}>سياسة الخصوصية</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/platform-policy`}>سياسات المنصة</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/refund-policy`}>سياسة الاسترداد</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/terms-and-conditions`}>الشروط والأحكام</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/trainers-terms-and-conditions`}>شروط وسياسات المدرّبين</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/faqs`}>الأسئلة الشائعة</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/user-guide`}>دليل المستخدم</Link></li>
              <li><Link className="text-primary-darkBlue" href={`/${locale}/trainer-guide`}>دليل المدرب</Link></li>
            </ul>
          </div>
          <div className="order-3 flex flex-col justify-start">
            <h2 className="text-primary-darkBlue mb-3 text-[1.375rem] font-bold">ابق على تواصل</h2>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@eyouthlearning.com" className="text-primary-darkBlue inline-flex items-center gap-2 whitespace-nowrap">
                <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-primary-darkBlue">
                  <path d="M2.19866 0H17.6945C19.1564 0 19.8932 0.690005 19.8932 2.0934V11.9406C19.8932 13.3323 19.1564 14.034 17.6945 14.034H2.19866C0.736785 14.034 0 13.3323 0 11.9406V2.0934C0 0.690005 0.736785 0 2.19866 0ZM9.94075 10.0577L17.8232 3.59036C18.1039 3.35646 18.3261 2.81849 17.9752 2.339C17.6361 1.8595 17.0162 1.84781 16.6069 2.14018L9.94075 6.65445L3.2863 2.14018C2.87697 1.84781 2.25714 1.8595 1.91798 2.339C1.56713 2.81849 1.78934 3.35646 2.07001 3.59036L9.94075 10.0577Z" fill="currentColor"></path>
                </svg>
                support@eyouthlearning.com
              </a>
              <Link className="text-primary-darkBlue flex items-center gap-2 font-medium" href={`/${locale}/contact-us`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone-call text-primary-darkBlue size-4" aria-hidden="true">
                  <path d="M13 2a9 9 0 0 1 9 9"></path>
                  <path d="M13 6a5 5 0 0 1 5 5"></path>
                  <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                </svg>
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar: Copyright and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full pb-6 mt-auto">
          <div className="text-primary-darkBlue opacity-70 text-sm font-medium">
            جميع الحقوق محفوظة .eyouth ©
          </div>
          <div className="z-10 flex items-center gap-2 mt-4 md:mt-0">
            <a href="https://www.facebook.com/EYouthLearning/" target="_blank" rel="noreferrer">
              <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-mainBlue fill-primary-mainBlue hover:opacity-80 transition-opacity">
                <g clipPath="url(#clip0_1484_106507)">
                  <path d="M26.0063 14.1267C26.0063 7.62845 20.7323 2.35449 14.234 2.35449C7.73575 2.35449 2.46179 7.62845 2.46179 14.1267C2.46179 19.8245 6.51144 24.5687 11.8796 25.6635V17.6584H9.52513V14.1267H11.8796V11.1837C11.8796 8.91163 13.7278 7.06339 15.9999 7.06339H18.9429V10.5951H16.5885C15.941 10.5951 15.4113 11.1248 15.4113 11.7723V14.1267H18.9429V17.6584H15.4113V25.8401C21.3562 25.2515 26.0063 20.2365 26.0063 14.1267Z"></path>
                </g>
                <defs>
                  <clipPath id="clip0_1484_106507">
                    <rect width="28.2534" height="28.2534" fill="white" transform="translate(0.102417)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </a>
            <a href="https://x.com/eyouthlearning?s=11&t=mLl8LMthDwW6RVwDg9BxDg" target="_blank" rel="noreferrer">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-mainBlue size-6 hover:opacity-80 transition-opacity">
                <path d="M22.9079 2.37988H27.1247L17.9121 12.9092L28.75 27.2373H20.264L13.6175 18.5474L6.01243 27.2373H1.79304L11.6468 15.975L1.25 2.37988H9.95139L15.9592 10.3228L22.9079 2.37988ZM21.4279 24.7134H23.7645L8.68174 4.7713H6.17433L21.4279 24.7134Z" fill="currentColor"></path>
              </svg>
            </a>
            <a href="https://eg.linkedin.com/company/eyouth" target="_blank" rel="noreferrer">
              <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-mainBlue fill-primary-mainBlue hover:opacity-80 transition-opacity">
                <path d="M23.2914 3.5293C23.9158 3.5293 24.5147 3.77735 24.9562 4.2189C25.3978 4.66044 25.6458 5.25931 25.6458 5.88374V22.3649C25.6458 22.9893 25.3978 23.5882 24.9562 24.0297C24.5147 24.4713 23.9158 24.7193 23.2914 24.7193H6.81026C6.18582 24.7193 5.58696 24.4713 5.14541 24.0297C4.70387 23.5882 4.45581 22.9893 4.45581 22.3649V5.88374C4.45581 5.25931 4.70387 4.66044 5.14541 4.2189C5.58696 3.77735 6.18582 3.5293 6.81026 3.5293H23.2914ZM22.7028 21.7763V15.537C22.7028 14.5191 22.2984 13.543 21.5787 12.8233C20.859 12.1036 19.8829 11.6992 18.865 11.6992C17.8644 11.6992 16.6989 12.3114 16.1339 13.2296V11.9229H12.8494V21.7763H16.1339V15.9726C16.1339 15.0661 16.8637 14.3244 17.7702 14.3244C18.2073 14.3244 18.6265 14.4981 18.9356 14.8072C19.2447 15.1162 19.4183 15.5354 19.4183 15.9726V21.7763H22.7028ZM9.02344 10.0747C9.54797 10.0747 10.051 9.86629 10.4219 9.4954C10.7928 9.1245 11.0012 8.62145 11.0012 8.09692C11.0012 7.00211 10.1183 6.10742 9.02344 6.10742C8.49579 6.10742 7.98975 6.31702 7.61664 6.69013C7.24354 7.06324 7.03393 7.56927 7.03393 8.09692C7.03393 9.19174 7.92862 10.0747 9.02344 10.0747ZM10.6598 21.7763V11.9229H7.39887V21.7763H10.6598Z"></path>
              </svg>
            </a>
            <a href="https://www.instagram.com/eyouthlearning/" target="_blank" rel="noreferrer">
              <svg width="30" height="29" viewBox="0 0 30 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-mainBlue fill-primary-mainBlue hover:opacity-80 transition-opacity">
                <g clipPath="url(#clip0_1484_106498)">
                  <path d="M10.0152 2.35449H19.9038C23.6709 2.35449 26.7317 5.41527 26.7317 9.18239V19.0711C26.7317 20.8819 26.0124 22.6186 24.7319 23.8991C23.4514 25.1796 21.7147 25.899 19.9038 25.899H10.0152C6.24804 25.899 3.18726 22.8382 3.18726 19.0711V9.18239C3.18726 7.37152 3.90662 5.63482 5.1871 4.35434C6.46758 3.07386 8.20428 2.35449 10.0152 2.35449ZM9.77971 4.70894C8.65572 4.70894 7.57777 5.15544 6.78299 5.95022C5.98821 6.745 5.5417 7.82296 5.5417 8.94694V19.3065C5.5417 21.6492 7.43703 23.5445 9.77971 23.5445H20.1393C21.2633 23.5445 22.3412 23.098 23.136 22.3032C23.9308 21.5085 24.3773 20.4305 24.3773 19.3065V8.94694C24.3773 6.60427 22.482 4.70894 20.1393 4.70894H9.77971ZM21.1399 6.47478C21.5302 6.47478 21.9045 6.62981 22.1804 6.90578C22.4564 7.18174 22.6114 7.55603 22.6114 7.9463C22.6114 8.33658 22.4564 8.71087 22.1804 8.98683C21.9045 9.2628 21.5302 9.41783 21.1399 9.41783C20.7496 9.41783 20.3754 9.2628 20.0994 8.98683C19.8234 8.71087 19.6684 8.33658 19.6684 7.9463C19.6684 7.55603 19.8234 7.18174 20.0994 6.90578C20.3754 6.62981 20.7496 6.47478 21.1399 6.47478ZM14.9595 8.24061C16.5206 8.24061 18.0177 8.86075 19.1216 9.96461C20.2255 11.0685 20.8456 12.5656 20.8456 14.1267C20.8456 15.6878 20.2255 17.185 19.1216 18.2888C18.0177 19.3927 16.5206 20.0128 14.9595 20.0128C13.3984 20.0128 11.9012 19.3927 10.7974 18.2888C9.69352 17.185 9.07337 15.6878 9.07337 14.1267C9.07337 12.5656 9.69352 11.0685 10.7974 9.96461C11.9012 8.86075 13.3984 8.24061 14.9595 8.24061ZM14.9595 10.5951C14.0228 10.5951 13.1245 10.9671 12.4622 11.6295C11.7999 12.2918 11.4278 13.1901 11.4278 14.1267C11.4278 15.0634 11.7999 15.9617 12.4622 16.624C13.1245 17.2863 14.0228 17.6584 14.9595 17.6584C15.8961 17.6584 16.7944 17.2863 17.4568 16.624C18.1191 15.9617 18.4912 15.0634 18.4912 14.1267C18.4912 13.1901 18.1191 12.2918 17.4568 11.6295C16.7944 10.9671 15.8961 10.5951 14.9595 10.5951Z"></path>
                </g>
                <defs>
                  <clipPath id="clip0_1484_106498">
                    <rect width="28.2534" height="28.2534" fill="white" transform="translate(0.835693)"></rect>
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
