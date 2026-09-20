const stats = [
  { value: "15", label: "مدرب" },
  { value: "6", label: "مسارات تدريبية" },
  { value: "10,000", label: "طالب وخريج" },
  { value: "95%", label: "نسبة الرضا" },
];

export default function StatsSection({ locale = "ar" }) {
  const isRtl = locale === "ar";

  return (
    <section
      className="w-full bg-white pt-2 pb-16"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-2 gap-y-10 md:flex md:flex-row justify-center items-center md:gap-0 md:divide-x md:divide-x-reverse md:divide-slate-200">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-2 md:px-4 md:flex-1 w-full">
              <span className="text-4xl md:text-5xl font-extrabold text-[#0b2646] mb-2">
                {stat.value}
              </span>
              <span className="text-slate-600 font-bold text-lg">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
