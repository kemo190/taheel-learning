"use client";

import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function ForgotPasswordForm({ dict, isRtl, locale }) {
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const schema = z.object({
    email: z.string().email({ message: dict.auth.errors.invalidEmail }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData) => {
    setServerError(null);
    setSuccessMsg(null);

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/reset-password`,
      });

      if (error) {
        setServerError(error.message);
      } else {
        setSuccessMsg(dict.auth.messages?.checkEmailToContinue || "Please check your email to reset your password.");
      }
    } catch (err) {
      setServerError("An unexpected network error occurred. Please try again.");
    }
  };

  return (
    <div className="relative z-30 flex w-full max-w-[450px] mx-auto flex-col gap-2 px-0">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#0b2646] mb-2">{dict.auth.forgotPasswordTitle}</h1>
        <p className="text-sm text-gray-500">{dict.auth.forgotPasswordSubtitle}</p>
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}
      
      {successMsg && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg text-sm text-center font-medium border border-green-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {successMsg}
        </div>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-2">
          {/* Email */}
          <div>
            <label htmlFor="reset_email" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
              {dict.auth.emailPlaceholder}
            </label>
            <input
              id="reset_email"
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

          <div className="flex justify-center mt-3 flex-col gap-3 items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FBBC04] text-[#0b2646] font-bold py-3 sm:py-3.5 rounded-full hover:bg-[#f5b300] transition-colors text-[16px] disabled:opacity-70 flex items-center justify-center"
            >
              {isSubmitting ? (
                <span className="animate-spin border-2 border-[#0b2646]/20 border-t-[#0b2646] w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
              ) : null}
              {dict.auth.sendResetLink}
            </button>
            
            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium text-gray-500 hover:text-[#0b2646] transition-colors mt-2"
            >
              {dict.auth.backToLogin}
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
