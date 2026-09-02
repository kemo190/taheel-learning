import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/dictionaries/getDictionary";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login - Taheel",
};

// --- Icons ---
const GoogleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="20px"
    height="20px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export default async function LoginPage({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const targetLocale = locale === "ar" ? "en" : "ar";
  const toggleLabel = locale === "ar" ? "EN" : "AR";
  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row w-full overflow-y-auto lg:overflow-hidden">
      {/* Image Overlay Section (Placed first in DOM so in RTL it goes to Right, in LTR it goes to Left) */}
      <div className="block w-full h-[260px] sm:h-[350px] lg:h-full lg:w-1/2 shrink-0">
        <section
          className="relative h-full w-full overflow-hidden p-6 sm:p-10 lg:p-10 after:absolute after:inset-0 after:size-full after:bg-black/50 after:content-[''] md:p-[88px] flex flex-col justify-end lg:justify-start"
          style={{
            backgroundImage: 'url("/auth-image.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Text Content overlay */}
          <div
            className="text-[#F5F5F5] relative z-10 max-w-[538px] space-y-1 mx-auto text-center lg:mx-0 lg:ltr:text-left lg:rtl:text-right"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <h1 className="flex flex-wrap items-center text-3xl lg:text-[2.5rem] font-bold justify-center lg:justify-start">
              {isRtl ? "مرحبا بك في Ta'hel" : "Welcome to Ta'hel"}
            </h1>
            <p
              className={`text-lg sm:text-xl lg:text-2xl font-medium lg:${isRtl ? "whitespace-nowrap" : "whitespace-pre-line"}`}
            >
              {dict.auth.welcomeSub}
            </p>
          </div>
        </section>
      </div>

      {/* Left Side: Form Container */}
      <section className="flex-1 w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:overflow-hidden lg:px-[38px] lg:py-[38px] bg-[#f8f9fb]">
        {/* Form Outer Wrapper */}
        <div className="mx-auto flex h-full w-full max-w-[640px] items-center justify-center overflow-hidden rounded-[2rem]">
          {/* Form Inner Card */}
          <div className="relative lg:max-h-full min-h-[40dvh] w-full lg:overflow-y-auto custom-scrollbar rounded-[2rem] bg-white px-6 py-10 lg:py-16 shadow-[0_0_80px_0] shadow-[#1A44F214] md:p-6">
            {/* Language Toggle Inside Card */}
            <div className="absolute rtl:left-6 ltr:right-6 top-6 z-30">
              <Link
                href={`/${targetLocale}/login`}
                className="flex bg-[#0b2646] text-white w-8 h-8 rounded-full items-center justify-center text-xs font-bold transition-transform hover:scale-105"
              >
                {toggleLabel}
              </Link>
            </div>

            <h1 className="text-[#0b2646] text-[32px] text-center font-bold">
              {dict.auth.loginTitle}
            </h1>
            <h2 className="text-[#6b7280] text-center mt-1">
              {dict.auth.loginSubtitle}
            </h2>

            {/* Client Form */}
            <LoginForm dict={dict} isRtl={isRtl} locale={locale} />

            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-gray-500">
              <span>{dict.auth.noAccount}</span>
              <Link
                href={`/${locale}/register`}
                className="text-[#0b2646] hover:opacity-80 font-bold transition-colors"
              >
                {dict.auth.createAccount}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Trigger CodeRabbit review
