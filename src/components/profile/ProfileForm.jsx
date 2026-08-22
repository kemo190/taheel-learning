"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';

const getProfileSchema = (locale) => z.object({
  full_name: z.string().min(2, locale === 'ar' ? 'الاسم باللغة الإنجليزية مطلوب' : 'English name is required'),
  arabic_name: z.string().min(2, locale === 'ar' ? 'الاسم باللغة العربية مطلوب' : 'Arabic name is required'),
  certificate_name: z.string().min(2, locale === 'ar' ? 'الاسم على الشهادة مطلوب' : 'Certificate name is required'),
  gender: z.enum(['male', 'female'], { required_error: locale === 'ar' ? 'النوع مطلوب' : 'Gender is required' }),
  dob: z.string().min(1, locale === 'ar' ? 'تاريخ الميلاد مطلوب' : 'Date of birth is required'),
  country: z.string().min(1, locale === 'ar' ? 'الدولة مطلوبة' : 'Country is required'),
  governorate: z.string().min(1, locale === 'ar' ? 'المحافظة مطلوبة' : 'Governorate is required'),
  phone: z.string().min(8, locale === 'ar' ? 'رقم الهاتف غير صحيح' : 'Invalid phone number'),
  education_status: z.string().min(1, locale === 'ar' ? 'حالة التعليم مطلوبة' : 'Education status is required'),
  work_field: z.string().min(1, locale === 'ar' ? 'مجال العمل مطلوب' : 'Work field is required'),
});

export default function ProfileForm({ initialData, locale, userId }) {
  const isRtl = locale === 'ar';
  const schema = getProfileSchema(locale);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: initialData?.full_name || '',
      arabic_name: initialData?.arabic_name || '',
      certificate_name: initialData?.certificate_name || '',
      gender: initialData?.gender || 'male',
      dob: initialData?.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '',
      country: initialData?.country || '',
      governorate: initialData?.governorate || '',
      phone: initialData?.phone || '',
      education_status: initialData?.education_status || '',
      work_field: initialData?.work_field || '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        arabic_name: data.arabic_name,
        certificate_name: data.certificate_name,
        gender: data.gender,
        dob: data.dob,
        country: data.country,
        governorate: data.governorate,
        phone: data.phone,
        education_status: data.education_status,
        work_field: data.work_field,
      })
      .eq('id', userId);

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(isRtl ? 'تم حفظ البيانات بنجاح' : 'Data saved successfully');
    }
  };

  const InputWrapper = ({ label, error, children }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-gray-700">{label}</label>
      {children}
      {error && <span className="text-red-500 text-xs font-medium">{error.message}</span>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm font-medium border border-green-100">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          <InputWrapper label={isRtl ? 'الاسم باللغة الإنجليزية' : 'Name in English'} error={errors.full_name}>
            <input 
              type="text" 
              {...register('full_name')} 
              className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </InputWrapper>

          <InputWrapper label={isRtl ? 'الاسم باللغة العربية' : 'Name in Arabic'} error={errors.arabic_name}>
            <input 
              type="text" 
              {...register('arabic_name')} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </InputWrapper>

          <div className="md:col-span-2">
            <InputWrapper label={isRtl ? 'اكتب اسمك كما سيظهر على الشهادة' : 'Name on Certificate'} error={errors.certificate_name}>
              <div className="relative">
                <input 
                  type="text" 
                  {...register('certificate_name')} 
                  placeholder={isRtl ? 'اكتب اسمك هنا' : 'Write your name here'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <div className="absolute top-1/2 -translate-y-1/2 rtl:left-3 ltr:right-3 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shadow-sm border border-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                  </svg>
                </div>
              </div>
            </InputWrapper>
          </div>

          <InputWrapper label={isRtl ? 'النوع' : 'Gender'} error={errors.gender}>
            <div className="flex items-center gap-4 h-full pt-1">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 flex-1 hover:border-blue-300 transition-colors">
                <span className="text-sm text-gray-700">{isRtl ? 'ذكر' : 'Male'}</span>
                <input type="radio" value="male" {...register('gender')} className="ms-auto w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 flex-1 hover:border-blue-300 transition-colors">
                <span className="text-sm text-gray-700">{isRtl ? 'أنثى' : 'Female'}</span>
                <input type="radio" value="female" {...register('gender')} className="ms-auto w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500" />
              </label>
            </div>
          </InputWrapper>

          <InputWrapper label={isRtl ? 'تاريخ الميلاد' : 'Date of Birth'} error={errors.dob}>
            <input 
              type="date" 
              {...register('dob')} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-gray-700"
            />
          </InputWrapper>

          <InputWrapper label={isRtl ? 'الدولة' : 'Country'} error={errors.country}>
            <select 
              {...register('country')} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all text-gray-700"
            >
              <option value="">{isRtl ? 'اختر الدولة' : 'Select Country'}</option>
              <option value="Egypt">{isRtl ? 'مصر' : 'Egypt'}</option>
              <option value="Saudi Arabia">{isRtl ? 'السعودية' : 'Saudi Arabia'}</option>
              <option value="UAE">{isRtl ? 'الإمارات' : 'UAE'}</option>
            </select>
          </InputWrapper>

          <InputWrapper label={isRtl ? 'المحافظة' : 'Governorate'} error={errors.governorate}>
            <select 
              {...register('governorate')} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all text-gray-700"
            >
              <option value="">{isRtl ? 'اختر المحافظة' : 'Select Governorate'}</option>
              <option value="Cairo">{isRtl ? 'القاهرة' : 'Cairo'}</option>
              <option value="Alexandria">{isRtl ? 'الإسكندرية' : 'Alexandria'}</option>
              <option value="Giza">{isRtl ? 'الجيزة' : 'Giza'}</option>
            </select>
          </InputWrapper>

          <InputWrapper label={isRtl ? 'رقم الهاتف' : 'Phone Number'} error={errors.phone}>
            <div className="flex">
              <div className="bg-gray-100 border border-gray-200 rtl:border-l-0 ltr:border-r-0 rtl:rounded-r-lg ltr:rounded-l-lg px-3 py-3 text-sm text-gray-600 flex items-center justify-center font-medium shrink-0">
                EG
              </div>
              <input 
                type="tel" 
                {...register('phone')} 
                placeholder="01097426151"
                className="w-full bg-gray-50 border border-gray-200 rtl:rounded-l-lg ltr:rounded-r-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left transition-all"
                dir="ltr"
              />
            </div>
          </InputWrapper>

          <InputWrapper label={isRtl ? 'حالة التعليم' : 'Education Status'} error={errors.education_status}>
            <select 
              {...register('education_status')} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all text-gray-700"
            >
              <option value="">{isRtl ? 'حالة التعليم' : 'Education Status'}</option>
              <option value="High School">{isRtl ? 'ثانوية عامة' : 'High School'}</option>
              <option value="University">{isRtl ? 'طالب جامعي' : 'University'}</option>
              <option value="Graduated">{isRtl ? 'خريج' : 'Graduated'}</option>
            </select>
          </InputWrapper>

          <InputWrapper label={isRtl ? 'مجال العمل' : 'Work Field'} error={errors.work_field}>
            <select 
              {...register('work_field')} 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none transition-all text-gray-700"
            >
              <option value="">{isRtl ? 'مجال العمل' : 'Work Field'}</option>
              <option value="Engineering">{isRtl ? 'هندسة' : 'Engineering'}</option>
              <option value="Medicine">{isRtl ? 'طب' : 'Medicine'}</option>
              <option value="Programming">{isRtl ? 'برمجة' : 'Programming'}</option>
              <option value="Marketing">{isRtl ? 'تسويق' : 'Marketing'}</option>
              <option value="Other">{isRtl ? 'أخرى' : 'Other'}</option>
            </select>
          </InputWrapper>

        </div>

        <div className="flex justify-center mt-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#8da5ff] hover:bg-[#7a95ff] text-white px-12 py-3.5 rounded-full font-bold flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                {isRtl ? 'حفظ' : 'Save'}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rtl:rotate-180">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
