"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import PasswordInput from '@/components/ui/PasswordInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const MailIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
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

export default function LoginForm({ dict, isRtl, locale }) {
  const router = useRouter();
  const [serverError, setServerError] = useState(null);

  // Aggressively check for session on mount (to catch OAuth hash parsing) and listen for auth changes
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(`/${locale}/home`);
        router.refresh();
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace(`/${locale}/home`);
        router.refresh();
      }
    });
    return () => subscription.unsubscribe();
  }, [locale, router]);

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
      email: '',
      password: '',
    }
  });

  const onSubmit = async (formData) => {
    setServerError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        // Automatically resend verification email
        await supabase.auth.resend({
          type: 'signup',
          email: formData.email,
        });
        setServerError(dict.auth.messages.accountNotVerified);
      } else {
        setServerError(error.message.includes('Invalid login')
          ? dict.auth.messages.invalidLogin
          : error.message);
      }
    } else {
      router.replace(`/${locale}/home`);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/${locale}/login`,
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

      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
      >
        <GoogleIcon />
        {locale === 'ar' ? 'تسجيل الدخول بواسطة جوجل' : 'Log in with Google'}
      </button>

      <div className="flex items-center my-2">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-400 font-medium">{locale === 'ar' ? 'أو' : 'OR'}</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="login_email" className="block text-sm font-bold text-[#4b5563] rtl:text-right ltr:text-left">
            {dict.auth.email}
          </label>
          <div className="relative">
            <input
              id="login_email"
              {...register('email')}
              type="email"
              placeholder={dict.auth.emailPlaceholder}
              className={`w-full bg-[#f8f9fb] border ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <div className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 text-gray-400 pointer-events-none">
              <MailIcon />
            </div>
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="login_password" className="block text-sm font-bold text-[#4b5563] rtl:text-right ltr:text-left">
            {dict.auth.password}
          </label>
          <PasswordInput
            id="login_password"
            {...register('password')}
            placeholder={dict.auth.passwordPlaceholder}
            isRtl={isRtl}
            className={`w-full bg-[#f8f9fb] border ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-[#0b2646] focus:ring-[#0b2646]'} rounded-xl py-3 px-12 text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-400 rtl:text-right ltr:text-left`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1.5 px-2 font-medium">{errors.password.message}</p>}
        </div>

        <div className="flex rtl:justify-end ltr:justify-end mt-2">
          <Link href={`/${locale}/forgot-password`} className="text-sm font-bold text-[#0b2646] hover:opacity-80 transition-colors">
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

