import React from "react";
import { getDictionary } from "@/dictionaries/getDictionary";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.auth.forgotPasswordTitle} | Taheel`,
    description: dict.auth.forgotPasswordSubtitle,
  };
}

export default async function ForgotPasswordPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isRtl = locale === "ar";

  return (
    <div
      className="flex flex-col flex-grow relative p-4 pt-4 pb-12 sm:px-12 sm:pt-4 sm:pb-16 bg-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <ForgotPasswordForm dict={dict} isRtl={isRtl} locale={locale} />
    </div>
  );
}
