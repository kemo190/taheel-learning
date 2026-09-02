export default async function TermsConditionsPage({ params }) {
  const { locale } = await params;
  const isRtl = locale === "ar";

  return (
    <div className="mx-auto max-w-4xl px-6 py-16" dir={isRtl ? "rtl" : "ltr"}>
      <h1 className="text-3xl md:text-4xl font-extrabold text-[#0b2646] mb-8">
        {isRtl ? "الشروط والأحكام" : "Terms and Conditions"}
      </h1>
      <div className="prose prose-blue max-w-none text-gray-600">
        <p className="mb-4">
          {isRtl
            ? "هذه الصفحة قيد الإنشاء. سيتم إضافة محتوى الشروط والأحكام قريباً."
            : "This page is under construction. The Terms and Conditions content will be added soon."}
        </p>
      </div>
    </div>
  );
}

// Trigger CodeRabbit review
