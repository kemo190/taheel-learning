"use client";
import React from "react";

export default function CoursePathComparison({ dict, locale }) {
  const isRtl = locale === "ar";

  return (
    <div className="w-full mb-12" dir={isRtl ? "rtl" : "ltr"}>
      <section className="border-button-primary-text space-y-10 overflow-hidden rounded-3xl border bg-white pb-6">
        <h2 className="bg-accent-highlight text-primary-darkBlue w-full py-6 text-center text-2xl font-semibold drop-shadow-xl drop-shadow-[#0b264626]">
          {dict?.journey?.comparison?.title || "ما الفرق بين الدورة والمسار؟"}
        </h2>

        <div className="relative grid grid-cols-1 gap-8 px-4 md:grid-cols-2 md:px-8">
          <div className="border-border-default space-y-2 rounded-2xl px-8 md:border md:py-4 [&>h3]:text-primary-mainBlue md:bg-[#9DBAFA80] [&>ul>li]:col-span-2">
            <h3 className="text-primary-darkBlue bg-primary-base mx-auto flex w-fit items-center justify-center gap-2 rounded-3xl px-4 py-2.5 text-lg font-bold md:bg-white">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.5 6.75003H10.5V17.25H4.5V6.75003ZM17.8725 3.59909C17.8525 3.50224 17.8136 3.41028 17.758 3.32853C17.7023 3.24677 17.6311 3.17682 17.5483 3.12271C17.4655 3.0686 17.3729 3.0314 17.2757 3.01324C17.1784 2.99508 17.0786 2.99633 16.9819 3.01691L12.5934 3.95441C12.3983 3.99751 12.2282 4.11605 12.1202 4.28413C12.0122 4.45222 11.975 4.65622 12.0169 4.85159L13.1053 10.0313L18.9609 8.77316L17.8725 3.59909Z"
                  fill="currentColor"
                  fillOpacity="0.1"
                  className="text-primary-mainBlue"
                ></path>
                <path
                  d="M21.7172 18.2392L18.6056 3.44549C18.5654 3.25203 18.4873 3.06843 18.3759 2.90523C18.2645 2.74203 18.1219 2.60246 17.9564 2.49452C17.7909 2.38659 17.6057 2.31242 17.4114 2.27628C17.2171 2.24014 17.0176 2.24274 16.8244 2.28393L12.4359 3.22705C12.0478 3.31205 11.7089 3.54687 11.4929 3.88044C11.277 4.21401 11.2015 4.61935 11.2828 5.0083L14.3944 19.8021C14.4637 20.1396 14.6471 20.4429 14.9138 20.6611C15.1805 20.8793 15.5142 20.999 15.8588 21.0002C15.9653 21 16.0715 20.9887 16.1756 20.9664L20.5641 20.0233C20.9527 19.9381 21.292 19.7028 21.5079 19.3687C21.7239 19.0345 21.7991 18.6286 21.7172 18.2392ZM12.75 4.70174C12.75 4.69612 12.75 4.6933 12.75 4.6933L17.1375 3.7558L17.4497 5.24362L13.0622 6.18768L12.75 4.70174ZM13.3706 7.65205L17.76 6.70987L18.0731 8.20049L13.6875 9.14362L13.3706 7.65205ZM13.9931 10.6117L18.3825 9.66862L19.6294 15.5974L15.24 16.5405L13.9931 10.6117ZM20.25 18.5571L15.8625 19.4946L15.5503 18.0067L19.9378 17.0627L20.25 18.5486C20.25 18.5542 20.25 18.5571 20.25 18.5571ZM9.75 3.00018H5.25C4.85218 3.00018 4.47064 3.15821 4.18934 3.43952C3.90804 3.72082 3.75 4.10235 3.75 4.50018V19.5002C3.75 19.898 3.90804 20.2795 4.18934 20.5608C4.47064 20.8421 4.85218 21.0002 5.25 21.0002H9.75C10.1478 21.0002 10.5294 20.8421 10.8107 20.5608C11.092 20.2795 11.25 19.898 11.25 19.5002V4.50018C11.25 4.10235 11.092 3.72082 10.8107 3.43952C10.5294 3.15821 10.1478 3.00018 9.75 3.00018ZM5.25 4.50018H9.75V6.00018H5.25V4.50018ZM5.25 7.50018H9.75V16.5002H5.25V7.50018ZM9.75 19.5002H5.25V18.0002H9.75V19.5002Z"
                  fill="currentColor"
                  className="text-primary-mainBlue"
                ></path>
              </svg>
              {dict?.journey?.filters?.courses || "دورات تدريبية"}
            </h3>

            <h4 className="text-primary-darkBlue font-semibold">
              {dict?.journey?.comparison?.courses?.desc ||
                "تعلم مهارة محددة في وقت محدد"}
            </h4>
            <p className="text-primary-darkBlue text-xs">
              {dict?.journey?.comparison?.courses?.subDesc ||
                "محتوى تعليمي يركز على موضوع واحد، تقدر تبدأه وتخلصه بشكل مستقل حسب احتياجك."}
            </p>

            <h5 className="text-primary-darkBlue mt-4 font-semibold">
              {dict?.journey?.comparison?.courses?.importantPoints ||
                "نقاط هامة:"}
            </h5>
            <ul className="text-primary-darkBlue grid list-inside list-disc grid-cols-1 sm:grid-cols-2 gap-1 text-xs md:max-w-xs">
              <li>
                {dict?.journey?.comparison?.courses?.point1 ||
                  "مهارة أو موضوع واحد"}
              </li>
              <li>
                {dict?.journey?.comparison?.courses?.point2 ||
                  "يمكن أخذه بشكل مستقل"}
              </li>
            </ul>
          </div>

          <hr className="border-t-light-gray block md:hidden" />

          <div className="border-border-default space-y-2 rounded-2xl px-8 md:border md:bg-[#F8F8FE] md:py-4">
            <h3 className="text-primary-darkBlue bg-primary-base mx-auto flex w-fit items-center justify-center gap-2 rounded-3xl px-4 py-2.5 text-lg font-bold md:bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-network"
                aria-hidden="true"
              >
                <rect x="16" y="16" width="6" height="6" rx="1"></rect>
                <rect x="2" y="16" width="6" height="6" rx="1"></rect>
                <rect x="9" y="2" width="6" height="6" rx="1"></rect>
                <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"></path>
                <path d="M12 12V8"></path>
              </svg>
              {dict?.journey?.filters?.paths || "مسارات"}
            </h3>

            <h4 className="text-primary-darkBlue font-semibold">
              {dict?.journey?.comparison?.paths?.desc ||
                "رحلة تعليمية متكاملة تقودك لهدف واضح"}
            </h4>
            <p className="text-primary-darkBlue text-xs">
              {dict?.journey?.comparison?.paths?.subDesc ||
                "يتكون من مجموعة دورات مرتبة تساعدك تبني مهاراتك خطوة بخطوة لحد ما توصل لمستوى احترافي."}
            </p>

            <h5 className="text-primary-darkBlue mt-4 font-semibold">
              {dict?.journey?.comparison?.paths?.importantPoints ||
                "نقاط هامة:"}
            </h5>
            <ul className="text-primary-darkBlue grid list-inside list-disc grid-cols-1 sm:grid-cols-2 gap-1 text-xs md:max-w-xs">
              <li>
                {dict?.journey?.comparison?.paths?.point1 ||
                  "يتكون من عدة دورات"}
              </li>
              <li>
                {dict?.journey?.comparison?.paths?.point2 || "يقودك لهدف وظيفي"}
              </li>
              <li>
                {dict?.journey?.comparison?.paths?.point3 ||
                  "مبني على مسار واضح"}
              </li>
              <li>
                {dict?.journey?.comparison?.paths?.point4 ||
                  "متابعة تقدمك في كل مرحلة"}
              </li>
            </ul>
          </div>

          <span className="bg-accent-highlight text-primary-mainBlue absolute top-1/2 left-1/2 hidden size-[65px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-2xl font-bold md:flex">
            VS
          </span>
        </div>
      </section>
    </div>
  );
}
