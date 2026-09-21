"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PasswordInput from "@/components/ui/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { MailIcon } from "@/components/icons";

export default function LoginForm({ dict, isRtl, locale }) {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  // Use extracted auth redirect hook
  useAuthRedirect(locale);

  const schema = z.object({
    email: z.string().email({ message: dict.auth.errors.invalidEmail }),
    password: z.string().min(6, { message: dict.auth.errors.invalidPassword }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    setServerError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          // Automatically resend verification email
          await supabase.auth.resend({
            type: "signup",
            email: formData.email,
          });
          setServerError(dict.auth.messages.accountNotVerified);
        } else {
          setServerError(
            error.message.includes("Invalid login")
              ? dict.auth.messages.invalidLogin
              : error.message,
          );
        }
      } else {
        const searchParams = new URLSearchParams(window.location.search);
        const nextPath = searchParams.get("next");
        if (nextPath && nextPath.startsWith("/")) {
          router.replace(nextPath);
        } else {
          router.replace(`/${locale}/home`);
        }
        router.refresh();
      }
    } catch (err) {
      setServerError("An unexpected network error occurred. Please try again.");
    }
  };

  return (
    <div className="relative z-30 flex w-full max-w-[450px] mx-auto flex-col gap-2 px-0">
      {serverError && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}

      <SocialLoginButton
        locale={locale}
        provider="google"
        nextPath="/login"
        label={locale === "ar" ? "تسجيل الدخول بواسطة جوجل" : "Log in with Google"}
      />

      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-400 font-medium">
          {locale === "ar" ? "أو" : "OR"}
        </span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 w-full mt-2">
        {/* Email */}
        <div>
          <label htmlFor="login_email" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.emailPlaceholder}
          </label>
          <input
            id="login_email"
            {...register("email")}
            type="email"
            className={`w-full bg-white border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
            dir={isRtl ? "rtl" : "ltr"}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login_password" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.password}
          </label>
          <PasswordInput
            id="login_password"
            {...register("password")}
            isRtl={isRtl}
            className={`w-full bg-white border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-11 sm:py-3 sm:px-11 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex rtl:justify-end ltr:justify-end mt-1">
          <Link
            href={`/${locale}/forgot-password`}
            className="text-sm font-medium text-gray-500 hover:text-[#0b2646] transition-colors underline underline-offset-4"
          >
            {dict.auth.forgotPassword}
          </Link>
        </div>

        <div className="flex justify-center mt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-[280px] bg-[#FBBC04] text-[#0b2646] font-bold py-3 sm:py-3.5 rounded-full hover:bg-[#f5b300] transition-colors text-[16px] disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="animate-spin border-2 border-[#0b2646]/20 border-t-[#0b2646] w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
            ) : null}
            {dict.auth.loginBtn}
          </button>
        </div>
      </form>
    </div>
  );
}
