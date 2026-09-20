"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabaseClient";
import { ChevronDownIcon } from "@/components/icons";
import { SocialLoginButton } from "./SocialLoginButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/ui/PasswordInput";

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------
const governorates = ["Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Sharkia", "Menoufia", "Gharbia", "Beheira", "Faiyum", "Beni Suef", "Minya", "Asyut", "Suhag", "Qena", "Aswan", "Luxor"];





// ----------------------------------------------------------------------
// VALIDATION SCHEMA
// ----------------------------------------------------------------------
const createRegisterSchema = (dict) =>
  z.object({
    name: z
      .string()
      .min(1, { message: dict.auth.errors.nameRequired })
      .min(3, { message: dict.auth.errors.nameRequired })
      .max(50, { message: dict.auth.errors.nameRequired }),
    email: z
      .string()
      .min(1, { message: dict.auth.errors.required })
      .email({ message: dict.auth.errors.invalidEmail }),
    
    phone: z
      .string()
      .min(1, { message: dict.auth.errors.required })
      .refine((value) => value && value.length >= 10, {
        message: dict.auth.errors.invalidPhone,
      }),
    governorate: z.string().min(1, { message: dict.auth.errors.required }),
    
    
    password: z
      .string()
      .min(1, { message: dict.auth.errors.required })
      .min(6, { message: dict.auth.errors.passwordLength }),
    confirmPassword: z
      .string()
      .min(1, { message: dict.auth.errors.required }),
    terms: z.literal(true, {
      errorMap: () => ({ message: dict.auth.errors.termsRequired }),
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: dict.auth.errors.passwordsNotMatch,
    path: ["confirmPassword"],
  });

// ----------------------------------------------------------------------
// COMPONENT
// ----------------------------------------------------------------------
export default function RegisterForm({ dict, isRtl, locale }) {
  const router = useRouter();
  const schema = createRegisterSchema(dict);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      
      governorate: "",
      terms: false,
    },
  });

  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);
  const statesList = governorates;

  

  const onSubmit = async (data) => {
    setServerError(null);
    setSuccess(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            gender: "male", // default or omitted
            phone: data.phone,
            country: "EG", // default to Egypt
            governorate: data.governorate,
            role: "student",
          },
        },
      });

      if (authError) {
        setServerError(authError.message);
        return;
      }

      setSuccess(dict.auth.messages.checkEmailToContinue || "Success");

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 2000);
    } catch (err) {
      setServerError(err.message || dict.auth.errors.required);
    }
  };

  return (
    <div className="w-full">
      {serverError && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
          {serverError}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
          {success}
        </div>
      )}

      <div className="w-full max-w-[450px] mx-auto">
        <SocialLoginButton
          locale={locale}
          provider="google"
          nextPath="/register"
          label={locale === "ar" ? "التسجيل بواسطة جوجل" : "Continue with Google"}
        />

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-400 font-medium">
            {locale === "ar" ? "أو باستخدام البريد الإلكتروني" : "OR WITH EMAIL"}
          </span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 w-full mt-2">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.namePlaceholder}
          </label>
          <input
            id="name"
            {...register("name")}
            type="text"
            className={`w-full bg-white border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
            dir={isRtl ? "rtl" : "ltr"}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.emailPlaceholder}
          </label>
          <input
            id="email"
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

        {/* Phone */}
        <div className="">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.phone}
          </label>
          <input
            id="phone"
            {...register("phone")}
            type="tel"
            className={`w-full bg-white border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent rtl:text-right ltr:text-left`}
            dir="ltr"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.phone.message}
            </p>
          )}
        </div>
        {/* Governorate */}
        <div>
          <label htmlFor="governorate" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.governorate}
          </label>
          <div className="relative">
            <select
              id="governorate"
              {...register("governorate")}
              className={`w-full appearance-none bg-white border ${errors.governorate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch("governorate") ? "text-gray-900" : "text-gray-400"}`}
              dir={isRtl ? "rtl" : "ltr"}
            >
              <option value="" disabled>
                {dict.auth.governorate}
              </option>
              {statesList.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>
          {errors.governorate && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.governorate.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.password}
          </label>
          <PasswordInput
            id="password"
            {...register("password")}
            isRtl={isRtl}
            className={`w-full bg-white border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent ${isRtl ? "text-right" : "text-left"}`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1.5 rtl:text-right ltr:text-left">
            {dict.auth.confirmPassword}
          </label>
          <PasswordInput
            id="confirmPassword"
            {...register("confirmPassword")}
            isRtl={isRtl}
            className={`w-full bg-white border ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-2.5 px-3 sm:py-3 sm:px-4 text-[15px] focus:outline-none focus:ring-1 transition-all placeholder:text-transparent ${isRtl ? "text-right" : "text-left"}`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="md:col-span-2 mt-2">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-2">
            <input
              type="checkbox"
              id="terms"
              {...register("terms")}
              className="shrink-0 rounded-[4px] border border-gray-300 w-4 h-4 mt-0.5 sm:mt-0 cursor-pointer text-[#0b2646] focus:ring-[#0b2646] bg-transparent"
            />
            <label
              htmlFor="terms"
              className="text-[13px] sm:text-[13.5px] leading-relaxed sm:leading-normal font-medium text-gray-500 cursor-pointer select-none"
            >
              {dict.auth.terms.agree}
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-[#0b2646] hover:underline mx-1 font-bold"
              >
                {dict.auth.terms.privacy}
              </Link>
              {dict.auth.terms.and1}
              <Link
                href={`/${locale}/terms-conditions`}
                className="text-[#0b2646] hover:underline mx-1 font-bold"
              >
                {dict.auth.terms.conditions}
              </Link>
              {dict.auth.terms.and2}
              <Link
                href={`/${locale}/refund-policy`}
                className="text-[#0b2646] hover:underline mx-1 font-bold"
              >
                {dict.auth.terms.refund}
              </Link>
              {dict.auth.terms.of}
            </label>
          </div>
          {errors.terms && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.terms.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-center mt-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-[280px] bg-[#FBBC04] text-[#0b2646] font-bold py-3 sm:py-3.5 rounded-full hover:bg-[#f5b300] transition-colors text-[16px] disabled:opacity-70 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="animate-spin border-2 border-[#0b2646]/20 border-t-[#0b2646] w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
            ) : null}
            {dict.auth.createAccount}
          </button>
        </div>
      </form>
    </div>
  );
}
