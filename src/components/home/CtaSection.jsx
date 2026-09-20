import Link from "next/link";

export default function CtaSection({ locale = "ar" }) {
  const isRtl = locale === "ar";

  return (
    <section 
      className="relative w-full py-14 lg:py-24 overflow-hidden" 
      style={{ background: "linear-gradient(180deg, #ffffff 0%, #e8eef5 100%)" }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative z-10 max-w-[1000px] mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-[#0b2646] mb-6 leading-tight">
          جاهز تبدأ رحلتك؟
        </h2>
        <p className="text-base md:text-lg mb-10 text-slate-500 font-medium leading-relaxed">
          من أول خطوة في التعلم، لحد أول فرصة مهنية. أنشئ حسابك دلوقتي وابدأ مسارك المهني مع خبراء المجال.
        </p>
        
        <div className="flex flex-row justify-center items-center gap-3 max-w-[400px] sm:max-w-none mx-auto w-full">
          <Link
            href={`/${locale}/register`}
            className="flex-1 sm:flex-none text-center bg-[#0b2646] hover:bg-[#0d2e55] text-white px-3 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-[14px] sm:text-lg transition-all shadow-md hover:-translate-y-0.5"
          >
            ابدأ رحلتك
          </Link>
          <Link
            href={`/${locale}/tracks`}
            className="flex-1 sm:flex-none text-center bg-white border-2 border-slate-300 text-slate-700 hover:border-[#0b2646] hover:text-[#0b2646] px-3 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-[14px] sm:text-lg transition-all"
          >
            اكتشف المسارات
          </Link>
        </div>
      </div>
    </section>
  );
}
