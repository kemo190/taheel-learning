import { Search, PenTool, BarChart, Award, FileText, Briefcase } from "lucide-react";

export default function FeaturesSection({ locale = "ar" }) {
  const isRtl = locale === "ar";

  const journeySteps = [
    {
      step: "01",
      icon: <Search className="w-6 h-6 text-[#0b2646]" />,
      title: "اختار مسارك",
      description: "حدد المجال اللي عايز تطور نفسك فيه، واختار البرنامج المناسب لهدفك المهني.",
    },
    {
      step: "02",
      icon: <PenTool className="w-6 h-6 text-[#0b2646]" />,
      title: "اتعلّم وطبّق",
      description: "احضر الـSessions، واستفد من الـMaterials، ونفّذ المهام والتطبيقات العملية المطلوبة.",
    },
    {
      step: "03",
      icon: <BarChart className="w-6 h-6 text-[#0b2646]" />,
      title: "تابع تقدمك",
      description: "اعرف وصلت لفين، وإيه اللي خلصته، وإيه الخطوة اللي جاية في مسارك بوضوح.",
    },
    {
      step: "04",
      icon: <Award className="w-6 h-6 text-[#0b2646]" />,
      title: "أثبت إنجازك",
      description: "أكمل متطلبات البرنامج واحصل على شهادة تثبت إتمامك للرحلة التدريبية بنجاح.",
    },
    {
      step: "05",
      icon: <FileText className="w-6 h-6 text-[#0b2646]" />,
      title: "ابنِ ملفك المهني",
      description: "بعد إتمام الدورة التدريبية، يُفتح لك حساب توظيف خاص على منصة تأهيل، لتتمكن من إنشاء ملفك التوظيفي والاستفادة من شبكة تأهيل وعلاقاتها مع الشركات والجهات التوظيفية للوصول إلى فرص التدريب والعمل المناسبة.",
    },
    {
      step: "06",
      icon: <Briefcase className="w-6 h-6 text-[#0b2646]" />,
      title: "اكتشف فرصتك القادمة",
      description: "استكشف الوظائف والتدريبات المناسبة لمسارك، وقدّم بسهولة باستخدام ملفك المهني.",
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-24" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block bg-[#0b2646]/5 text-[#0b2646] px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            رحلتك في تأهيل
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b2646] mb-4 leading-tight">
            مش مجرد برامج تدريبية.<br /> دي رحلة تأهيل لسوق العمل.
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            منذ 2017، تعمل تأهيل على سد الفجوة بين الدراسة الأكاديمية ومتطلبات سوق العمل.
            من خلال برامج عملية، وSessions يقدمها متخصصون، بنساعدك تبني المهارات اللي تحتاجها، وتحوّل اللي اتعلمته إلى إنجازات تقدر تثبتها في رحلتك المهنية.
          </p>
        </div>

        {/* Journey Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {journeySteps.map((step, idx) => (
            <div 
              key={idx} 
              className="group p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#f8f9fa] hover:bg-[#0b2646] transition-colors duration-300 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-8">
                <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {/* Clone the icon to make it have hover effects */}
                  <div className="text-[#FBBC04] transition-colors duration-300 [&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                    {step.icon}
                  </div>
                </div>
                <span className="text-3xl sm:text-4xl font-black text-[#FBBC04] transition-colors duration-300">
                  {step.step}
                </span>
              </div>
              
              <h3 className="text-sm sm:text-xl font-bold text-[#0b2646] group-hover:text-white mb-2 sm:mb-3 transition-colors duration-300 leading-tight">
                {step.title}
              </h3>
              <p className="text-slate-500 group-hover:text-blue-100 leading-snug sm:leading-relaxed text-[11px] sm:text-[15px] transition-colors duration-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
