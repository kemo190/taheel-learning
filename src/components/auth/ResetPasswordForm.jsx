"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PasswordInput from "@/components/ui/PasswordInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function ResetPasswordForm({ dict, isRtl, locale }) {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  const schema = z
    .object({
      password: z.string().min(6, { message: dict.auth.errors.passwordLength }),
      confirmPassword: z.string().min(6, { message: dict.auth.errors.passwordLength }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.auth.errors.passwordsNotMatch,
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    setServerError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) {
        setServerError(error.message);
      } else {
        // Redirect to login or home after successful password reset
        router.replace(`/${locale}/login`);
      }
    } catch (err) {
      setServerError("An unexpected network error occurred. Please try again.");
    }
  };

  return (
    <div className="relative z-30 flex w-full max-w-[450px] mx-auto flex-col gap-2 px-0">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-[#0b2646] mb-2">{dict.auth.resetPasswordTitle}</h1>
        <p className="text-sm text-gray-500">{dict.auth.resetPasswordSubtitle}</p>
      </div>

      {serverError && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-2">
        {/* Password */}
        <div>
          <label htmlFor="reset_password" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.password}
          </label>
          <PasswordInput
            id="reset_password"
            {...register("password")}
            isRtl={isRtl}
            className={`w-full bg-white border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="reset_confirm_password" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.confirmPassword}
          </label>
          <PasswordInput
            id="reset_confirm_password"
            {...register("confirmPassword")}
            isRtl={isRtl}
            className={`w-full bg-white border ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FBBC04] text-[#0b2646] font-bold py-3 sm:py-3.5 rounded-full hover:bg-[#f5b300] transition-colors text-[16px] disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="animate-spin border-2 border-[#0b2646]/20 border-t-[#0b2646] w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
            ) : null}
            {dict.auth.resetPasswordBtn}
          </button>
        </div>
      </form>
    </div>
  );
}
