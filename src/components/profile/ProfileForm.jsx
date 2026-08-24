"use client";

import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabaseClient';
import { Country, State } from 'country-state-city';
import PhoneInput, { isSupportedCountry } from 'react-phone-number-input';
import countriesTranslations from 'i18n-iso-countries';
import arabicCountries from 'i18n-iso-countries/langs/ar.json';
import englishCountries from 'i18n-iso-countries/langs/en.json';

countriesTranslations.registerLocale(arabicCountries);
countriesTranslations.registerLocale(englishCountries);

const getProfileSchema = (dict) => z.object({
  full_name: z.string().min(2, dict.profile.form.errors.englishNameReq),
  arabic_name: z.string().min(2, dict.profile.form.errors.arabicNameReq),
  certificate_name: z.string().min(2, dict.profile.form.errors.certificateNameReq),
  gender: z.enum(['male', 'female'], { required_error: dict.profile.form.errors.genderReq }),
  dob: z.string().min(1, dict.profile.form.errors.dobReq),
  country: z.string().min(1, dict.profile.form.errors.countryReq),
  governorate: z.string().min(1, dict.profile.form.errors.governorateReq),
  phone: z.string().min(8, dict.profile.form.errors.phoneInvalid),
  education_status: z.string().min(1, dict.profile.form.errors.educationReq),
  work_field: z.string().min(1, dict.profile.form.errors.workFieldReq),
});

export default function ProfileForm({ initialData, locale, userId, dict }) {
  const isRtl = locale === 'ar';
  const schema = getProfileSchema(dict);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const { data: updatedData, error } = await supabase
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
      .eq('id', userId)
      .select('id');

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error.message);
    } else if (updatedData?.length === 1) {
      setSuccessMsg(dict.profile.form.messages.saveSuccess);
    } else {
      setErrorMsg(dict.profile.form.messages.profileNotFound);
    }
  };

  const InputWrapper = ({ label, htmlFor, error, children }) => (
    <div className="flex w-full flex-col gap-1.5 text-start">
      <label htmlFor={htmlFor} className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2 text-gray-500 font-bold text-lg">{label}</label>
      <div className="relative">
        {children}
      </div>
      {error && <span className="text-red-500 text-xs font-medium mt-1">{error.message}</span>}
    </div>
  );

  const inputClasses = "file:text-foreground focus-visible:ring-gray-200 flex min-h-[43px] w-full rounded-[10px] px-4 py-[0.5rem] text-sm transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:opacity-70 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base bg-white text-[#0b2646] border border-gray-200 focus:border-[#0b2646] focus-visible:ring-0 h-[52px]";
  const selectClasses = `${inputClasses} appearance-none cursor-pointer`;

  return (
    <div className="rounded-xl px-0 sm:px-8 py-4" dir={isRtl ? 'rtl' : 'ltr'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">

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

        <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">

          <InputWrapper label={dict.profile.form.nameEn} htmlFor="full_name" error={errors.full_name}>
            <input
              id="full_name"
              type="text"
              {...register('full_name')}
              placeholder={dict.profile.form.nameEn}
              className={inputClasses}
            />
          </InputWrapper>

          <InputWrapper label={dict.profile.form.nameAr} htmlFor="arabic_name" error={errors.arabic_name}>
            <input
              id="arabic_name"
              type="text"
              {...register('arabic_name')}
              placeholder={dict.profile.form.nameAr}
              className={inputClasses}
            />
          </InputWrapper>

          <InputWrapper label={dict.profile.form.nameOnCertificate} htmlFor="certificate_name" error={errors.certificate_name}>
            <input
              id="certificate_name"
              type="text"
              {...register('certificate_name')}
              placeholder={dict.profile.form.writeNameHere}
              className={inputClasses}
            />
          </InputWrapper>

          <div className="flex flex-col gap-1.5">
            <label className="mb-2 text-gray-500 font-bold text-lg">{dict.profile.form.gender}</label>
            <div className="gap-3 grid grid-cols-2">
              <label htmlFor="gender_male" className="flex h-[52px] items-center gap-3 rounded-lg bg-white px-4 text-gray-600 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                <input id="gender_male" type="radio" value="Male" {...register('gender')} className="aspect-square size-5 shrink-0 rounded-full border border-gray-200 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] text-blue-600 focus-visible:ring-blue-500/50" />
                <span>{dict.profile.form.male}</span>
              </label>
              <label htmlFor="gender_female" className="flex h-[52px] items-center gap-3 rounded-lg bg-white px-4 text-gray-600 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
                <input id="gender_female" type="radio" value="Female" {...register('gender')} className="aspect-square size-5 shrink-0 rounded-full border border-gray-200 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] text-blue-600 focus-visible:ring-blue-500/50" />
                <span>{dict.profile.form.female}</span>
              </label>
            </div>
            {errors.gender && <span className="text-red-500 text-xs font-medium mt-1">{errors.gender.message}</span>}
          </div>

          <InputWrapper label={dict.profile.form.dob} htmlFor="dob" error={errors.dob}>
            <input
              id="dob"
              type="date"
              {...register('dob')}
              className={inputClasses}
            />
          </InputWrapper>

          <InputWrapper label={dict.profile.form.country} htmlFor="country" error={errors.country}>
            <select
              id="country"
              {...register('country')}
              className={selectClasses}
            >
              <option value="">{dict.profile.form.selectCountry}</option>
              {countriesList.map((country) => (
                <option key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}

            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-gray-500 size-6 absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </InputWrapper>

          <InputWrapper label={dict.profile.form.governorate} htmlFor="governorate" error={errors.governorate}>
            <select
              id="governorate"
              {...register('governorate')}
              className={selectClasses}
              disabled={!selectedCountry || statesList.length === 0}
            >
              <option value="">{dict.profile.form.selectGovernorate}</option>
              {statesList.map((state) => (
                <option key={state.isoCode} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-gray-500 size-6 absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </InputWrapper>

          <InputWrapper label={dict.profile.form.phone} htmlFor="phone" error={errors.phone}>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <div dir="ltr" className="relative w-full">
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry={selectedCountry && isSupportedCountry(selectedCountry) ? selectedCountry : "EG"}
                    className="flex items-center w-full h-[52px] bg-white border border-gray-200 rounded-[10px] px-4 focus-within:border-[#0b2646] transition-all
                      [&_.PhoneInputCountry]:flex [&_.PhoneInputCountry]:items-center [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountry]:relative
                      [&_.PhoneInputCountrySelect]:absolute [&_.PhoneInputCountrySelect]:inset-0 [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountrySelect]:z-10
                      [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:shadow-sm [&_.PhoneInputCountryIcon]:mr-2
                      [&_.PhoneInputCountrySelectArrow]:w-2 [&_.PhoneInputCountrySelectArrow]:h-2 [&_.PhoneInputCountrySelectArrow]:border-b-2 [&_.PhoneInputCountrySelectArrow]:border-r-2 [&_.PhoneInputCountrySelectArrow]:border-gray-500 [&_.PhoneInputCountrySelectArrow]:rotate-45 [&_.PhoneInputCountrySelectArrow]:ml-1"
                    numberInputProps={{
                      className: "flex-1 w-full h-full bg-transparent border-none outline-none text-[#0b2646] text-sm md:text-base ltr focus:ring-0",
                      dir: "ltr"
                    }}
                  />
                </div>
              )}
            />
          </InputWrapper>

          <InputWrapper label={dict.profile.form.educationStatus} htmlFor="education_status" error={errors.education_status}>
            <select
              id="education_status"
              {...register('education_status')}
              className={selectClasses}
            >
              <option value="">{dict.profile.form.educationStatus}</option>
              <option value="Graduated">{dict.profile.form.graduated}</option>
              <option value="Student">{dict.profile.form.student}</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-gray-500 size-6 absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </InputWrapper>

          <InputWrapper label={dict.profile.form.workField} htmlFor="work_field" error={errors.work_field}>
            <select
              id="work_field"
              {...register('work_field')}
              className={selectClasses}
            >
              <option value="">{dict.profile.form.workField}</option>
              <option value="7a89e26e-5d31-43e6-9be7-5d303a79b267">{dict.profile.form.workFields.marketing}</option>
              <option value="c4b14640-98f1-445d-89fc-5ae746b9539c">{dict.profile.form.workFields.operations}</option>
              <option value="f0279e66-c6dd-457b-b56f-6eefa021276f">{dict.profile.form.workFields.selfDev}</option>
              <option value="79d22433-5ffc-40e8-9de2-69e03321159c">{dict.profile.form.workFields.productivity}</option>
              <option value="55cfe43d-ca31-4b27-9dc1-c218c0947014">{dict.profile.form.workFields.teaching}</option>
              <option value="f3f7de18-0c06-4cce-a613-f13e2b7616a7">{dict.profile.form.workFields.finance}</option>
              <option value="d6871c60-3325-4dbc-835a-82a34f7808a5">{dict.profile.form.workFields.hr}</option>
              <option value="17f33f8c-a2b9-4d7c-9d4e-99bb1414676e">{dict.profile.form.workFields.sales}</option>
              <option value="9fef0132-f835-42a2-bb34-a7257ab55079">{dict.profile.form.workFields.software}</option>
              <option value="58819717-0338-4b1f-96b3-74def18ac69d">{dict.profile.form.workFields.business}</option>
              <option value="5e29c184-f4c3-4c20-a945-a14abddc2252">{dict.profile.form.workFields.design}</option>
              <option value="1d40d0f3-69e6-4b41-b523-f340dd1a6513">{dict.profile.form.workFields.ai}</option>
              <option value="80bd0a42-1765-40dc-8497-d7f431bd78e4">{dict.profile.form.workFields.other}</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down text-gray-500 size-6 absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </InputWrapper>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer rounded-2xl text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-5 [&>svg]:shrink-0 bg-[#0b2646] text-white hover:bg-[#0b2646]/80 h-[3.125rem] px-[1.5rem] py-3 mx-auto mt-4 w-full md:max-w-xs ltr:[&>svg]:rotate-180"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              {dict.profile.form.save}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left" aria-hidden="true">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
