import React from 'react';

export default function HeroSection({
  title = "اتعلم بطريقتك",
  subtitle = "طور مهاراتك العملية والشخصية بالعديد من الدورات التدريبية في مختلف المجالات",
  primaryButtonText = "اشترك الآن",
  secondaryButtonText = "عرض الدورات التدريبية",
  imageUrl = "/hero-student.jpg"
}) {
  return (
    <section className="mx-auto max-w-[96%] min-[1410px]:max-w-[1400px] md:rounded-[30px] relative mt-4 md:mt-8 flex min-h-[320px] md:min-h-[356px] md:h-[356px] items-center gap-6 overflow-hidden rounded-2xl px-6 max-md:justify-center max-md:py-8 md:px-28 lg:px-18 bg-[#f8fbff]">
      
      {/* Background Image Container */}
      <div className="absolute top-0 bottom-0 w-full md:w-[60%] lg:w-[55%] z-0 rtl:left-0 ltr:right-0">
        <div 
          className="w-full h-full bg-cover bg-[center_15%] bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        {/* Gradient mask: Light white overlay on mobile for text readability, soft blend on desktop */}
        <div className="absolute inset-0 max-md:bg-white/50 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-[#f8fbff] ltr:md:bg-gradient-to-l"></div>
      </div>

      {/* Text Content Area */}
      <div className="relative z-10 w-full md:basis-125 text-center md:text-start">
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold text-[#0b2646] mb-4 leading-[1.4] tracking-tight">
          {title}
        </h1>

        <p className="text-[#4a5568] text-lg leading-relaxed font-medium mb-8">
          {subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <button className="bg-[#0b2646] hover:bg-[#061528] text-white px-8 py-3 rounded-xl font-bold text-[15px] transition-colors shadow-md shadow-[#0b2646]/20">
            {primaryButtonText}
          </button>
          <button className="bg-white text-[#0b2646] border border-[#0b2646]/20 hover:border-[#0b2646] hover:bg-[#f0f4ff] px-8 py-3 rounded-xl font-bold text-[15px] transition-colors shadow-sm">
            {secondaryButtonText}
          </button>
        </div>
      </div>

    </section>
  );
}
