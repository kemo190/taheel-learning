import React from 'react';
import Link from 'next/link';

export default function FeaturedCourse({ dict, locale }) {
  const isRtl = locale === 'ar';

  // Dummy data for the featured course
  const featured = {
    id: "featured-1",
    title: "رضا العملاء",
    description: "كورس يطور الوعي والمهارات لتطبيق مبادئ رضا العملاء في جميع أقسام الأعمال، مع التركيز على أنه مسؤولية جماعية للمؤسسة.",
    instructor: "منى السطام",
    duration: "1 ساعة و 30 دقيقة",
    rating: 0.0,
    learners: 2,
    price: 300,
    imageSrc: "/customer_satisfaction_thumbnail_clean.jpg",
    type: dict?.userHome?.featuredCourse?.interactive || "مسجل تفاعلي"
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-[96%] xl:max-w-[1400px] flex flex-col gap-6">
      {/* Title */}
      <h4 className="text-[32px] text-[#0b2646] font-semibold text-start" dir={isRtl ? "rtl" : "ltr"}>
        {dict?.userHome?.featuredCourse?.title || "اختيارنا الأفضل لك"}
      </h4>
      <Link
        href={`/${locale}/courses/${featured.id}`}
        className="border-[#D6D6D6] flex flex-col md:flex-row gap-6 p-6 rounded-2xl border bg-white shadow-lg shadow-[#0b264626] hover:shadow-xl transition-shadow w-full"
        dir={isRtl ? "rtl" : "ltr"}
      >

        {/* 1. Image Wrapper (MUST be relative) */}
        <div className="relative w-full md:w-[45%] lg:w-[478px] shrink-0">
          <img
            alt={featured.title}
            loading="lazy"
            className="w-full aspect-video object-cover rounded-xl"
            src={featured.imageSrc}
          />
          <div className="flex h-fit w-fit gap-2 rounded-full rtl:rounded-r-none ltr:rounded-l-none px-3 py-2 text-center text-sm font-bold text-white [&_svg]:size-5 bg-[#0b2646] absolute bottom-0 rtl:right-0 ltr:left-0 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><path d="M16 3.128a4 4 0 0 1 0 7.744"></path><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><circle cx="9" cy="7" r="4"></circle>
            </svg>
            <span>{featured.type}</span>
          </div>
        </div>

        {/* 2. Content */}
        <div className="flex flex-col flex-1 gap-4 text-start">
          <div className="space-y-3">
            <h5 className="text-[#0b2646] font-bold text-2xl">
              {featured.title}
            </h5>
            <p className="text-[#5e6c84] text-base leading-relaxed line-clamp-2 md:line-clamp-3">
              {featured.description}
            </p>
            <h6 className="text-[#5e6c84] mt-2 text-xs">
              {dict?.userHome?.featuredCourse?.instructorPrefix || "مع"} {featured.instructor}
            </h6>
            <span className="flex items-center gap-1 text-[#0b2646] text-sm">
              <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0b2646]">
                <path d="M9.00033 1.125C4.77033 1.125 1.33366 4.56167 1.33366 8.79167C1.33366 13.0217 4.77033 16.4583 9.00033 16.4583C13.2303 16.4583 16.667 13.0217 16.667 8.79167C16.667 4.56167 13.2303 1.125 9.00033 1.125ZM9.00033 14.925C5.61949 14.925 2.86699 12.1725 2.86699 8.79167C2.86699 5.41083 5.61949 2.65833 9.00033 2.65833C12.3812 2.65833 15.1337 5.41083 15.1337 8.79167C15.1337 12.1725 12.3812 14.925 9.00033 14.925ZM9.38366 4.95833H8.23366V9.55833L12.2587 11.9733L12.8337 11.0342L9.38366 8.98667V4.95833Z" fill="currentColor"></path>
              </svg>
              {featured.duration}
            </span>
          </div>

          <span className="flex items-stretch gap-1">
            <span className="inline-flex items-center transition-colors bg-transparent rounded py-1 px-2 text-xs h-fit border-[#d0d5dd] text-[#5e6c84] gap-1 border font-normal">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star fill-[#fbbc04] text-[#fbbc04]" aria-hidden="true">
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
              </svg>
              {featured.rating.toFixed(1)}
            </span>
            <span className="inline-flex items-center transition-colors bg-transparent rounded py-1 px-2 text-xs h-fit border-[#d0d5dd] text-[#5e6c84] border font-light">
              {featured.learners} {dict?.userHome?.featuredCourse?.learners || "متعلم"}
            </span>
          </span>

          {/* 3. Price pushed to bottom left */}
          <div className="mt-auto mr-auto text-left">
            <b className="text-[#0b2646] text-xl font-medium">
              {featured.price} <span className="font-sans text-xl">{dict?.userHome?.featuredCourse?.currency || "ج.م"}</span>
            </b>
          </div>
        </div>

      </Link>
    </section>
  );
}

