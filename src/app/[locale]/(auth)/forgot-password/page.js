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

  return <ForgotPasswordForm dict={dict} isRtl={isRtl} locale={locale} />;
}
