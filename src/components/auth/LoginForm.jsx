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
    <div className="relative z-30 mt-4 sm:mt-6 flex w-full flex-col gap-4 px-0 sm:px-6">
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="login_email"
            className="block text-sm font-bold text-[#4b5563] rtl:text-right ltr:text-left"
          >
            {dict.auth.email}
          </label>
          <div className="relative">
            <input
              id="login_email"
              {...register("email")}
              type="email"
              placeholder={dict.auth.emailPlaceholder}
              className={`w-full bg-[#f8f9fb] border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
              dir={isRtl ? "rtl" : "ltr"}
            />
            <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
              <MailIcon />
            </div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label
            htmlFor="login_password"
            className="block text-sm font-bold text-[#4b5563] rtl:text-right ltr:text-left"
          >
            {dict.auth.password}
          </label>
          <PasswordInput
            id="login_password"
            {...register("password")}
            placeholder={dict.auth.passwordPlaceholder}
            isRtl={isRtl}
            className={`w-full bg-[#f8f9fb] border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex rtl:justify-end ltr:justify-end mt-2">
          <Link
            href={`/${locale}/forgot-password`}
            className="text-sm font-bold text-[#0b2646] hover:opacity-80 transition-colors"
          >
            {dict.auth.forgotPassword}
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0b2646] text-white font-bold py-3.5 rounded-xl hover:bg-[#061528] transition-colors mt-2 text-sm shadow-md disabled:opacity-70 flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="animate-spin border-2 border-white/20 border-t-white w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
          ) : null}
          {dict.auth.loginBtn}
        </button>
      </form>
    </div>
  );
}
