import { Search, PenTool, BarChart, Award, FileText, Briefcase } from "lucide-react";

export default function FeaturesSection({ locale = "ar" }) {
  const isRtl = locale === "ar";

  const journeySteps = [
    {
      step: "01",
      icon: <Search className="w-6 h-6" />,
      title: "اختار مسارك",
      description: "حدد المجال اللي عايز تطور نفسك فيه، واختار البرنامج المناسب لهدفك المهني.",
    },
    {
      step: "02",
      icon: <PenTool className="w-6 h-6" />,
      title: "اتعلّم وطبّق",
      description: "احضر الـSessions، واستفد من الـMaterials، ونفّذ المهام والتطبيقات العملية المطلوبة.",
    },
    {
      step: "03",
      icon: <BarChart className="w-6 h-6" />,
      title: "تابع تقدمك",
      description: "اعرف وصلت لفين، وإيه اللي خلصته، وإيه الخطوة اللي جاية في مسارك بوضوح.",
    },
    {
      step: "04",
      icon: <Award className="w-6 h-6" />,
      title: "أثبت إنجازك",
      description: "أكمل متطلبات البرنامج واحصل على شهادة تثبت إتمامك للرحلة التدريبية بنجاح.",
    },
    {
      step: "05",
      icon: <FileText className="w-6 h-6" />,
      title: "ابنِ ملفك المهني",
      description: "بعد إتمام الدورة التدريبية، يُفتح لك حساب توظيف خاص على منصة تأهيل، لتتمكن من إنشاء ملفك التوظيفي والاستفادة من شبكة تأهيل وعلاقاتها مع الشركات والجهات التوظيفية للوصول إلى فرص التدريب والعمل المناسبة.",
    },
    {
      step: "06",
      icon: <Briefcase className="w-6 h-6" />,
      title: "اكتشف فرصتك القادمة",
      description: "استكشف الوظائف والتدريبات المناسبة لمسارك، وقدّم بسهولة باستخدام ملفك المهني.",
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-24" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 max-w-6xl mx-auto">
          {/* Sticky Header */}
          <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit text-right">
            <div className="inline-block bg-[#0b2646]/5 text-[#0b2646] px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              رحلتك في تأهيل
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0b2646] mb-4 leading-tight">
              مش مجرد برامج تدريبية.<br /> دي رحلة تأهيل لسوق العمل.
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              منذ 2017، تعمل تأهيل على سد الفجوة بين الدراسة الأكاديمية ومتطلبات سوق العمل.
              من خلال برامج عملية، وSessions يقدمها متخصصون، بنساعدك تبني المهارات اللي تحتاجها، وتحوّل اللي اتعلمته إلى إنجازات تقدر تثبتها في رحلتك المهنية.
            </p>
          </div>

          {/* Vertical Steps Timeline */}
          <div className="lg:w-2/3 flex flex-col">
            {journeySteps.map((step, idx) => (
              <div key={idx} className="flex gap-4 sm:gap-6 items-start group">
                
                {/* Timeline Column */}
                <div className="flex flex-col items-center">
                  {/* Icon Circle */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-[#0b2646]/5 flex items-center justify-center text-[#0b2646] group-hover:bg-[#0b2646] group-hover:text-[#FBBC04] transition-all duration-300 [&>svg]:w-6 [&>svg]:h-6">
                    {step.icon}
                  </div>
                  {/* Vertical Line */}
                  {idx !== journeySteps.length - 1 && (
                    <div className="w-0.5 h-full min-h-[50px] bg-slate-100 group-hover:bg-[#0b2646]/20 transition-colors my-2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="pt-2 sm:pt-3 pb-10">
                  <span className="text-sm font-bold text-slate-400 mb-2 block tracking-wider">
                    الخطوة {step.step}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0b2646] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-[17px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
