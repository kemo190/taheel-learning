import React from "react";
import Link from "next/link";
import { getDictionary } from "@/dictionaries/getDictionary";
import RegisterForm from "@/components/auth/RegisterForm";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "Register - Taheel",
};

export default async function RegisterPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isRtl = locale === "ar";

  return (
    <div className="flex flex-col relative p-4 pt-4 pb-8 sm:px-12 sm:pt-4 bg-white" dir={isRtl ? "rtl" : "ltr"}>
      <div className="w-full max-w-[800px] mx-auto relative z-10 flex flex-col">
        {/* Form Container */}
        <ScrollReveal direction="none" delay={0.1} className="w-full">
          <div className="w-full">
            <h1 className="text-[#0b2646] text-2xl font-extrabold mb-3 text-center">
              {locale === "ar" ? "حساب جديد" : "New Account"}
            </h1>

            {/* Client Form */}
            <RegisterForm dict={dict} isRtl={isRtl} locale={locale} />

            <div className="mt-8 flex items-center justify-center gap-1.5 text-[15px] font-medium text-slate-500">
              <span>{dict.auth.haveAccount}</span>
              <Link
                href={`/${locale}/login`}
                className="text-[#0b2646] hover:text-[#FBBC04] font-bold transition-colors"
              >
                {dict.auth.loginBtn}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}

