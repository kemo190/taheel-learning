import React from "react";
import { getDictionary } from "@/dictionaries/getDictionary";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export async function generateMetadata({ params: { locale } }) {
  const dict = await getDictionary(locale);
  return {
    title: `${dict.auth.resetPasswordTitle} | Taheel`,
    description: dict.auth.resetPasswordSubtitle,
  };
}

export default async function ResetPasswordPage({ params: { locale } }) {
  const dict = await getDictionary(locale);
  const isRtl = locale === "ar";

  return <ResetPasswordForm dict={dict} isRtl={isRtl} locale={locale} />;
}
