"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import PasswordInput from '@/components/ui/PasswordInput';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Country, State } from 'country-state-city';
import PhoneInput, { isSupportedCountry } from 'react-phone-number-input';
import countriesTranslations from 'i18n-iso-countries';
import arabicCountries from 'i18n-iso-countries/langs/ar.json';
import englishCountries from 'i18n-iso-countries/langs/en.json';

countriesTranslations.registerLocale(arabicCountries);
countriesTranslations.registerLocale(englishCountries);

// --- Icons ---
const MailIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const UserIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const GlobeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    <path d="M2 12h20"></path>
  </svg>
);

const BuildingIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

const GenderIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="5"></circle>
    <line x1="14.53" y1="7.47" x2="19" y2="3"></line>
    <line x1="15" y1="3" x2="19" y2="3"></line>
    <line x1="19" y1="7" x2="19" y2="3"></line>
    <line x1="11" y1="16" x2="11" y2="21"></line>
    <line x1="8" y1="19" x2="14" y2="19"></line>
  </svg>
);

const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
  </svg>
);


export default function RegisterForm({ dict, isRtl, locale }) {
  const schema = z.object({
    name: z.string().min(2, { message: dict.auth.errors.nameRequired }),
    email: z.string().email({ message: dict.auth.errors.invalidEmail }),
    country: z.string().min(1, { message: dict.auth.errors.required }),
    governorate: z.string().min(1, { message: dict.auth.errors.required }),
    gender: z.string().min(1, { message: dict.auth.errors.required }),
    phone: z.string().min(10, { message: dict.auth.errors.invalidPhone }),
    password: z.string().min(6, { message: dict.auth.errors.passwordLength }),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
      message: dict.auth.errors.termsRequired,
    })
  }).refine((data) => data.password === data.confirmPassword, {
    message: dict.auth.errors.passwordsNotMatch,
    path: ['confirmPassword'],
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      country: '',
      governorate: '',
      gender: '',
      phone: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });

  const [serverError, setServerError] = useState(null);
  const [success, setSuccess] = useState(null);

  const selectedCountry = watch('country');

  const countriesList = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      isoCode: country.isoCode,
      name: countriesTranslations.getName(country.isoCode, locale) || country.name,
    })).sort((a, b) => a.name.localeCompare(b.name, locale));
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

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      if (error.message.includes('already registered') || error.status === 422) {
        setServerError(dict.auth.messages.emailAlreadyRegistered);
      } else {
        setServerError(error.message);
      }
    } else if (data?.user?.identities?.length === 0) {
      // Supabase returns an empty identities array if the email already exists and enumeration protection is on
      // The user explicitly requested to show an error message in this case instead of a neutral message.
      setServerError(dict.auth.messages.emailAlreadyRegistered);
    } else if (data?.user) {
      // User created successfully, provision profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: data.user.id,
        full_name: formData.name,
        country: formData.country,
        governorate: formData.governorate,
        gender: formData.gender,
        phone: formData.phone,
      });

      if (profileError) {
        setServerError(profileError.message);
      } else {
        setSuccess(dict.auth.messages.checkEmailToContinue);
      }
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${locale}`,
      }
    });
    if (error) setServerError(error.message);
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

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
      >
        <GoogleIcon />
        {locale === 'ar' ? 'التسجيل بواسطة جوجل' : 'Continue with Google'}
      </button>

      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-400 font-medium">{locale === 'ar' ? 'أو' : 'OR'}</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <div className="relative">
            <input
              id="name"
              {...register('name')}
              type="text"
              placeholder={dict.auth.namePlaceholder}
              className={`w-full bg-[#f8f9fb] border ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <label htmlFor="name" className="sr-only">{dict.auth.namePlaceholder}</label>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
              <UserIcon />
            </div>
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <input
              id="email"
              {...register('email')}
              type="email"
              placeholder={dict.auth.emailPlaceholder}
              className={`w-full bg-[#f8f9fb] border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <label htmlFor="email" className="sr-only">{dict.auth.emailPlaceholder}</label>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
              <MailIcon />
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.email.message}</p>}
        </div>

        {/* Gender & Phone */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Gender */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <div className="relative">
              <select
                id="gender"
                {...register('gender')}
                className={`w-full bg-[#f8f9fb] border ${errors.gender ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 appearance-none text-sm focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch('gender') ? 'text-gray-900' : 'text-gray-400'}`}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="" disabled>{dict.auth.gender}</option>
                <option value="male">{dict.auth.genders.male}</option>
                <option value="female">{dict.auth.genders.female}</option>
              </select>
              <label htmlFor="gender" className="sr-only">{dict.auth.gender}</label>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
                <GenderIcon />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#0b2646] pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.gender && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.gender.message}</p>}
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
                    defaultCountry={selectedCountry && isSupportedCountry(selectedCountry) ? selectedCountry : "EG"}
                    className={`flex items-center w-full bg-[#f8f9fb] border ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl px-4 py-1 focus-within:border-[#0b2646] transition-all h-[46px]
                      [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountry]:relative
                      [&_.PhoneInputCountrySelect]:absolute [&_.PhoneInputCountrySelect]:inset-0 [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountrySelect]:z-10
                      [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:shadow-sm [&_.PhoneInputCountryIcon]:mr-2
                      [&_.PhoneInputCountrySelectArrow]:w-2 [&_.PhoneInputCountrySelectArrow]:h-2 [&_.PhoneInputCountrySelectArrow]:border-b-2 [&_.PhoneInputCountrySelectArrow]:border-r-2 [&_.PhoneInputCountrySelectArrow]:border-gray-500 [&_.PhoneInputCountrySelectArrow]:rotate-45 [&_.PhoneInputCountrySelectArrow]:ml-1`}
                    numberInputProps={{
                      className: "flex-1 w-full h-full bg-transparent border-none outline-none text-[#0b2646] text-sm focus:ring-0",
                      dir: "ltr",
                      placeholder: dict.auth.phone
                    }}
                  />
                </div>
              )}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Country & Governorate */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Country */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <div className="relative">
              <select
                id="country"
                {...register('country')}
                className={`w-full bg-[#f8f9fb] border ${errors.country ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 appearance-none text-sm focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch('country') ? 'text-gray-900' : 'text-gray-400'}`}
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <option value="" disabled>{dict.auth.country}</option>
                {countriesList.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
              <label htmlFor="country" className="sr-only">{dict.auth.country}</label>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
                <GlobeIcon />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#0b2646] pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.country && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.country.message}</p>}
          </div>

          {/* Governorate */}
          <div className="w-full sm:w-1/2 flex flex-col">
            <div className="relative">
              <select
                id="governorate"
                {...register('governorate')}
                className={`w-full bg-[#f8f9fb] border ${errors.governorate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 appearance-none text-sm focus:outline-none focus:ring-1 transition-all rtl:text-right ltr:text-left cursor-pointer ${watch('governorate') ? 'text-gray-900' : 'text-gray-400'}`}
                dir={isRtl ? 'rtl' : 'ltr'}
                disabled={!selectedCountry || statesList.length === 0}
              >
                <option value="" disabled>{dict.auth.governorate}</option>
                {statesList.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              <label htmlFor="governorate" className="sr-only">{dict.auth.governorate}</label>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
                <BuildingIcon />
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#0b2646] pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.governorate && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.governorate.message}</p>}
          </div>
        </div>


        {/* Password */}
        <div>
          <PasswordInput
            id="password"
            {...register('password')}
            placeholder={dict.auth.password}
            isRtl={isRtl}
            className={`w-full bg-[#f8f9fb] border ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
          />
          <label htmlFor="password" className="sr-only">{dict.auth.password}</label>
          {errors.password && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <PasswordInput
            id="confirmPassword"
            {...register('confirmPassword')}
            placeholder={dict.auth.confirmPassword}
            isRtl={isRtl}
            className={`w-full bg-[#f8f9fb] border ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
          />
          <label htmlFor="confirmPassword" className="sr-only">{dict.auth.confirmPassword}</label>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms Checkbox */}
        <div>
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-2 mt-2">
            <input
              type="checkbox"
              id="terms"
              {...register('terms')}
              className="shrink-0 rounded-[4px] border border-gray-300 w-4 h-4 mt-0.5 sm:mt-0 cursor-pointer text-[#0b2646] focus:ring-[#0b2646] bg-transparent"
            />
            <label htmlFor="terms" className="text-[13px] sm:text-[13.5px] leading-relaxed sm:leading-normal font-medium text-[#4b5563] cursor-pointer select-none">
              {dict.auth.terms.agree}
              <Link href={`/${locale}/privacy-policy`} className="text-[#0b2646] hover:underline mx-1">{dict.auth.terms.privacy}</Link>
              {dict.auth.terms.and1}
              <Link href={`/${locale}/terms-conditions`} className="text-[#0b2646] hover:underline mx-1">{dict.auth.terms.conditions}</Link>
              {dict.auth.terms.and2}
              <Link href={`/${locale}/refund-policy`} className="text-[#0b2646] hover:underline mx-1">{dict.auth.terms.refund}</Link>
              {dict.auth.terms.of}
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.terms.message}</p>}
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
