"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PasswordInput from "@/components/ui/PasswordInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Country, State } from "country-state-city";
import PhoneInput, { isSupportedCountry } from "react-phone-number-input";
import countriesTranslations from "i18n-iso-countries";
import arabicCountries from "i18n-iso-countries/langs/ar.json";
import englishCountries from "i18n-iso-countries/langs/en.json";
import { createProfileServerAction } from "@/app/actions/profileActions";

countriesTranslations.registerLocale(arabicCountries);
countriesTranslations.registerLocale(englishCountries);

import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import {
  MailIcon,
  UserIcon,
  GlobeIcon,
  BuildingIcon,
  GenderIcon,
  PhoneIcon,
  ChevronDownIcon,
} from "@/components/icons";

export default function RegisterForm({ dict, isRtl, locale }) {
  const router = useRouter();

  // Use extracted auth redirect hook
  useAuthRedirect(locale);

  const schema = z
    .object({
      name: z.string().min(2, { message: dict.auth.errors.nameRequired }),
      email: z.string().email({ message: dict.auth.errors.invalidEmail }),
      country: z.string().min(1, { message: dict.auth.errors.required }),
      governorate: z.string().min(1, { message: dict.auth.errors.required }),
      gender: z.string().min(1, { message: dict.auth.errors.required }),
      phone: z.string().min(10, { message: dict.auth.errors.invalidPhone }),
      password: z.string().min(6, { message: dict.auth.errors.passwordLength }),
      confirmPassword: z.string(),
      terms: z.boolean().refine((val) => val === true, {
        message: dict.auth.errors.termsRequired,
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dict.auth.errors.passwordsNotMatch,
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      country: "",
      governorate: "",
      gender: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedCountry = watch("country");

  const countriesList = useMemo(() => {
    return Country.getAllCountries()
      .map((country) => ({
        isoCode: country.isoCode,
        name:
          countriesTranslations.getName(country.isoCode, locale) ||
          country.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, locale));
  }, [locale]);

  const statesList = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry).map((state) => ({
      isoCode: state.isoCode,
      name: state.name,
    }));
  }, [selectedCountry]);

  const onSubmit = async (formData) => {
    setServerError(null);
    setSuccess(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        if (
          error.message.includes("already registered") ||
          error.status === 422
        ) {
          setServerError(dict.auth.messages.emailAlreadyRegistered);
        } else {
          setServerError(error.message);
        }
      } else if (data?.user?.identities?.length === 0) {
        // Supabase returns an empty identities array if the email already exists and enumeration protection is on
        // The user explicitly requested to show an error message in this case instead of a neutral message.
        setServerError(dict.auth.messages.emailAlreadyRegistered);
      } else if (data?.user) {
        // User created successfully, provision profile via Server Action
        const result = await createProfileServerAction(data.user.id, {
          name: formData.name,
          country: formData.country,
          governorate: formData.governorate,
          gender: formData.gender,
          phone: formData.phone,
        });

        if (!result.success) {
          setServerError(result.error);
        } else {
          setSuccess(dict.auth.messages.checkEmailToContinue);
        }
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

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">
          {success}
        </div>
      )}

      <SocialLoginButton
        locale={locale}
        provider="google"
        nextPath="/register"
        label={locale === "ar" ? "التسجيل بواسطة جوجل" : "Continue with Google"}
      />

      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-400 font-medium">
          {locale === "ar" ? "أو" : "OR"}
        </span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <div className="relative">
            <input
              id="name"
              {...register("name")}
              type="text"
              placeholder={dict.auth.namePlaceholder}
              className={`w-full bg-[#f8f9fb] border ${errors.name ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
              dir={isRtl ? "rtl" : "ltr"}
            />
            <label htmlFor="name" className="sr-only">
              {dict.auth.namePlaceholder}
            </label>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
              <UserIcon />
            </div>
          </div>
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <input
              id="email"
              {...register("email")}
              type="email"
              placeholder={dict.auth.emailPlaceholder}
              className={`w-full bg-[#f8f9fb] border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
              dir={isRtl ? "rtl" : "ltr"}
            />
            <label htmlFor="email" className="sr-only">
              {dict.auth.emailPlaceholder}
            </label>
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

        {/* Gender & Phone */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Gender */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <div className="relative">
              <select
                id="gender"
                {...register("gender")}
                className={`w-full bg-[#f8f9fb] border ${errors.gender ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 appearance-none text-sm focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch("gender") ? "text-gray-900" : "text-gray-400"}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="" disabled>
                  {dict.auth.gender}
                </option>
                <option value="male">{dict.auth.genders.male}</option>
                <option value="female">{dict.auth.genders.female}</option>
              </select>
              <label htmlFor="gender" className="sr-only">
                {dict.auth.gender}
              </label>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
                <GenderIcon />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#0b2646] pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div dir="ltr" className="relative w-full">
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry={
                      selectedCountry && isSupportedCountry(selectedCountry)
                        ? selectedCountry
                        : "EG"
                    }
                    className={`flex items-center w-full bg-[#f8f9fb] border ${errors.phone ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl px-4 py-1 focus-within:border-[#0b2646] transition-all h-[46px]
                      [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountry]:relative
                      [&_.PhoneInputCountrySelect]:absolute [&_.PhoneInputCountrySelect]:inset-0 [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountrySelect]:z-10
                      [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:shadow-sm [&_.PhoneInputCountryIcon]:mr-2
                      [&_.PhoneInputCountrySelectArrow]:w-2 [&_.PhoneInputCountrySelectArrow]:h-2 [&_.PhoneInputCountrySelectArrow]:border-b-2 [&_.PhoneInputCountrySelectArrow]:border-r-2 [&_.PhoneInputCountrySelectArrow]:border-gray-500 [&_.PhoneInputCountrySelectArrow]:rotate-45 [&_.PhoneInputCountrySelectArrow]:ml-1`}
                    numberInputProps={{
                      className:
                        "flex-1 w-full h-full bg-transparent border-none outline-none text-[#0b2646] text-sm focus:ring-0",
                      dir: "ltr",
                      placeholder: dict.auth.phone,
                    }}
                  />
                </div>
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Country & Governorate */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Country */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <div className="relative">
              <select
                id="country"
                {...register("country")}
                className={`w-full bg-[#f8f9fb] border ${errors.country ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 appearance-none text-sm focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch("country") ? "text-gray-900" : "text-gray-400"}`}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="" disabled>
                  {dict.auth.country}
                </option>
                {countriesList.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <label htmlFor="country" className="sr-only">
                {dict.auth.country}
              </label>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
                <GlobeIcon />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#0b2646] pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Governorate */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <div className="relative">
              <select
                id="governorate"
                {...register("governorate")}
                className={`w-full bg-[#f8f9fb] border ${errors.governorate ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 appearance-none text-sm focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch("governorate") ? "text-gray-900" : "text-gray-400"}`}
                dir={isRtl ? "rtl" : "ltr"}
                disabled={!selectedCountry || statesList.length === 0}
              >
                <option value="" disabled>
                  {dict.auth.governorate}
                </option>
                {statesList.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <label htmlFor="governorate" className="sr-only">
                {dict.auth.governorate}
              </label>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
                <BuildingIcon />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#0b2646] pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.governorate && (
              <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
                {errors.governorate.message}
              </p>
            )}
          </div>
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            id="password"
            {...register("password")}
            placeholder={dict.auth.password}
            isRtl={isRtl}
            className={`w-full bg-[#f8f9fb] border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
          />
          <label htmlFor="password" className="sr-only">
            {dict.auth.password}
          </label>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <PasswordInput
            id="confirmPassword"
            {...register("confirmPassword")}
            placeholder={dict.auth.confirmPassword}
            isRtl={isRtl}
            className={`w-full bg-[#f8f9fb] border ${errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]"} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
          />
          <label htmlFor="confirmPassword" className="sr-only">
            {dict.auth.confirmPassword}
          </label>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div>
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              {...register("terms")}
              className="shrink-0 rounded-[4px] border border-gray-300 w-4 h-4 mt-0.5 sm:mt-0 cursor-pointer text-[#0b2646] focus:ring-[#0b2646] bg-transparent"
            />
            <label
              htmlFor="terms"
              className="text-[13px] sm:text-[13.5px] leading-relaxed sm:leading-normal font-medium text-[#4b5563] cursor-pointer select-none"
            >
              {dict.auth.terms.agree}
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-[#0b2646] hover:underline mx-1"
              >
                {dict.auth.terms.privacy}
              </Link>
              {dict.auth.terms.and1}
              <Link
                href={`/${locale}/terms-conditions`}
                className="text-[#0b2646] hover:underline mx-1"
              >
                {dict.auth.terms.conditions}
              </Link>
              {dict.auth.terms.and2}
              <Link
                href={`/${locale}/refund-policy`}
                className="text-[#0b2646] hover:underline mx-1"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0b2646] text-white font-bold py-3.5 rounded-xl hover:bg-[#061528] transition-colors mt-2 text-sm shadow-md disabled:opacity-70 flex items-center justify-center"
        >
          {isSubmitting ? (
            <span className="animate-spin border-2 border-white/20 border-t-white w-5 h-5 rounded-full mr-2 rtl:ml-2 rtl:mr-0"></span>
          ) : null}
          {dict.auth.createAccount}
        </button>
      </form>
    </div>
  );
}
