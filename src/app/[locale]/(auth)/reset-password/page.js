import React from "react";
import { getDictionary } from "@/dictionaries/getDictionary";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  return {
    title: `${dict.auth.resetPasswordTitle} | Taheel`,
    description: dict.auth.resetPasswordSubtitle,
  };
}

export default async function ResetPasswordPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isRtl = locale === "ar";

  return (
    <div
      className="flex flex-col flex-grow relative p-4 pt-4 pb-12 sm:px-12 sm:pt-4 sm:pb-16 bg-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <ResetPasswordForm dict={dict} isRtl={isRtl} locale={locale} />
    </div>
  );
}
