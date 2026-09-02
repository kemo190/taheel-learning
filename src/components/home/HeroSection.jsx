import Link from 'next/link';

export default function HeroSection({
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  imageUrl = "/hero-student.jpg",
  locale = 'ar'
}) {
  return (
    <section className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px] md:rounded-[30px] relative mt-4 md:mt-8 flex flex-col md:flex-row min-h-[320px] md:min-h-[356px] md:h-[356px] items-center md:gap-6 overflow-hidden rounded-2xl md:px-28 lg:px-18 bg-[#f8fbff]">
      
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full md:inset-auto md:absolute md:top-0 md:bottom-0 md:h-full md:w-[60%] lg:w-[55%] z-0 rtl:md:left-0 ltr:md:right-0 shrink-0">
        <div 
          className="w-full h-full bg-cover bg-[center_15%] bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        {/* Mobile Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-white/60 md:hidden pointer-events-none"></div>
        {/* Gradient mask: soft blend on desktop only */}
        <div className="opacity-0 md:opacity-100 absolute inset-0 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#f8fbff] ltr:md:bg-gradient-to-l pointer-events-none transition-opacity"></div>
      </div>

      {/* Text Content Area */}
      <div className="relative z-10 w-full md:basis-125 text-center md:text-start px-4 py-14 sm:py-16 md:px-0 md:py-0 flex flex-col justify-center h-full min-h-[320px] md:min-h-0">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold text-[#0b2646] mb-4 leading-[1.4] tracking-tight">
          {title}
        </h1>

        <p className="text-[#4a5568] text-base md:text-lg leading-relaxed font-medium mb-8">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-row justify-center md:justify-start gap-2 sm:gap-4 w-full">
          <Link href={`/${locale}/register`} className="flex-1 sm:flex-none bg-[#0b2646] hover:bg-[#061528] text-white px-2 py-3 sm:px-8 rounded-xl font-bold text-[13px] sm:text-[15px] transition-colors shadow-md shadow-[#0b2646]/20 inline-flex items-center justify-center text-center">
            {primaryButtonText}
          </Link>
          <Link href={`/${locale}/courses`} className="flex-1 sm:flex-none bg-white text-[#0b2646] border border-[#0b2646]/30 hover:border-[#0b2646] hover:bg-[#f0f4ff] px-2 py-3 sm:px-8 rounded-xl font-bold text-[13px] sm:text-[15px] transition-colors shadow-sm inline-flex items-center justify-center text-center">
            {secondaryButtonText}
          </Link>
        </div>
      </div>

    </section>
  );
}

// Trigger CodeRabbit review
