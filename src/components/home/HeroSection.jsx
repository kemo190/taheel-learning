"use client";
import Link from "next/link";

export default function HeroSection({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  locale = "ar",
}) {
  const isRtl = locale === "ar";

  return (
    <section
      className="w-full pt-10 pb-10 md:pt-16 md:pb-14 px-4"
      style={{
        background: "linear-gradient(180deg, rgba(251, 188, 4, 0.05) 0%, #ffffff 100%)",
      }}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-transparent border border-[#0b2646]/10 text-[#0b2646] text-sm font-semibold px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
          منصة تدريبية متخصصة في التطوير المهني
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold text-[#0b2646] leading-[1.3] tracking-tight mb-5">
          {title || "ابدأ رحلة نجاحك مع أفضل الخبراء في مجالك"}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
          {subtitle ||
            "اكتشف مسارات تدريبية متكاملة مصممة خصيصاً لتأهيلك لسوق العمل، وابنِ مستقبلك المهني بخطوات واثقة."}
        </p>

        {/* Buttons - pill shape like Yanfaa */}
        <div className="flex flex-row justify-center items-center gap-3 max-w-[400px] sm:max-w-none mx-auto w-full">
          <Link
            href={`/${locale}/register`}
            className="flex-1 sm:flex-none text-center bg-[#FBBC04] hover:bg-[#e0a800] text-[#0b2646] px-3 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-[14px] sm:text-lg transition-all"
          >
            {primaryButtonText || "اشترك الآن"}
          </Link>
          <Link
            href={`/${locale}/tracks`}
            className="flex-1 sm:flex-none text-center bg-white border-2 border-slate-300 text-slate-700 hover:border-[#FBBC04] hover:text-[#0b2646] px-3 py-3.5 sm:px-10 sm:py-4 rounded-full font-bold text-[14px] sm:text-lg transition-all"
          >
            {secondaryButtonText || "عرض الدورات"}
          </Link>
        </div>
      </div>
    </section>
  );
}
