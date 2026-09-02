"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import { Country, State } from 'country-state-city';
import PhoneInput, { isSupportedCountry, isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function ProfileForm({ initialData, locale, userId, dict, onProfileUpdate }) {
  const isRtl = locale === 'ar';
  
  const [formData, setFormData] = useState({
    nameEn: initialData?.full_name || '',
    nameAr: initialData?.arabic_name || '',
    certificateName: initialData?.certificate_name || '',
    gender: initialData?.gender || '',
    dob: initialData?.dob || '',
    country: initialData?.country || '',
    governorate: initialData?.governorate || '',
    phone: initialData?.phone || '',
    educationStatus: initialData?.education_status || '',
    workField: initialData?.work_field || ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Helper arrays/objects
  const countries = Country.getAllCountries();
  const states = formData.country ? State.getStatesOfCountry(formData.country) : [];

  const workFields = [
    { id: 'marketing', label: dict?.profile?.form?.workFields?.marketing || 'Marketing' },
    { id: 'operations', label: dict?.profile?.form?.workFields?.operations || 'Operations and Supply Chain' },
    { id: 'selfDev', label: dict?.profile?.form?.workFields?.selfDev || 'Self Development' },
    { id: 'productivity', label: dict?.profile?.form?.workFields?.productivity || 'Productivity' },
    { id: 'teaching', label: dict?.profile?.form?.workFields?.teaching || 'Teaching and Training' },
    { id: 'finance', label: dict?.profile?.form?.workFields?.finance || 'Finance and Accounting' },
    { id: 'hr', label: dict?.profile?.form?.workFields?.hr || 'HR and People Management' },
    { id: 'sales', label: dict?.profile?.form?.workFields?.sales || 'Sales and Business Development' },
    { id: 'software', label: dict?.profile?.form?.workFields?.software || 'Software Development' },
    { id: 'business', label: dict?.profile?.form?.workFields?.business || 'Business and Entrepreneurship' },
    { id: 'design', label: dict?.profile?.form?.workFields?.design || 'Design and Digital Arts' },
    { id: 'ai', label: dict?.profile?.form?.workFields?.ai || 'AI and Data Science' },
    { id: 'other', label: dict?.profile?.form?.workFields?.other || 'Other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'country' ? { governorate: '' } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nameEn) newErrors.nameEn = dict?.profile?.form?.errors?.englishNameReq || 'English name is required';
    if (!formData.nameAr) newErrors.nameAr = dict?.profile?.form?.errors?.arabicNameReq || 'Arabic name is required';
    if (!formData.certificateName) newErrors.certificateName = dict?.profile?.form?.errors?.certificateNameReq || 'Certificate name is required';
    if (!formData.gender) newErrors.gender = dict?.profile?.form?.errors?.genderReq || 'Gender is required';
    if (!formData.dob) newErrors.dob = dict?.profile?.form?.errors?.dobReq || 'Date of birth is required';
    if (!formData.country) newErrors.country = dict?.profile?.form?.errors?.countryReq || 'Country is required';
    if (!formData.governorate && states.length > 0) newErrors.governorate = dict?.profile?.form?.errors?.governorateReq || 'Governorate is required';
    if (!formData.phone || !isValidPhoneNumber(formData.phone)) newErrors.phone = dict?.profile?.form?.errors?.phoneInvalid || 'Invalid phone number';
    if (!formData.educationStatus) newErrors.educationStatus = dict?.profile?.form?.errors?.educationReq || 'Education status is required';
    if (!formData.workField) newErrors.workField = dict?.profile?.form?.errors?.workFieldReq || 'Work field is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(isRtl ? 'يرجى إكمال جميع الحقول المطلوبة بشكل صحيح' : 'Please fill all required fields correctly');
      return;
    }
    if (!userId) {
      toast.error(dict?.profile?.form?.messages?.profileNotFound || 'Profile not found to update');
      return;
    }

    setLoading(true);
    
    const updatePayload = {
      full_name: formData.nameEn,
      arabic_name: formData.nameAr,
      certificate_name: formData.certificateName,
      gender: formData.gender,
      dob: formData.dob,
      country: formData.country,
      governorate: formData.governorate,
      phone: formData.phone,
      education_status: formData.educationStatus,
      work_field: formData.workField,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId);

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(dict?.profile?.form?.messages?.saveSuccess || 'Data saved successfully');
      
      // Update local state in parent
      if (onProfileUpdate) {
        onProfileUpdate({
          ...initialData,
          ...updatePayload
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 md:gap-5 pb-4" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 pt-1">
        
        {/* Row 1 */}
        {/* Right: Name in Arabic */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="nameAr">
            {dict?.profile?.form?.nameAr || "Name in Arabic"}
          </label>
          <input
            id="nameAr"
            name="nameAr"
            type="text"
            value={formData.nameAr}
            onChange={handleChange}
            placeholder={dict?.profile?.form?.writeNameHere || "Write your name here"}
            className={`w-full bg-gray-50 text-gray-700 placeholder:text-gray-400 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border ${errors.nameAr ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.nameAr && <span className="text-red-500 text-xs font-medium">{errors.nameAr}</span>}
        </div>
        
        {/* Left: Name in English */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="nameEn">
            {dict?.profile?.form?.nameEn || "Name in English"}
          </label>
          <input
            id="nameEn"
            name="nameEn"
            type="text"
            value={formData.nameEn}
            onChange={handleChange}
            placeholder={dict?.profile?.form?.writeNameHere || "Write your name here"}
            className={`w-full bg-gray-50 text-gray-700 placeholder:text-gray-400 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border ${errors.nameEn ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.nameEn && <span className="text-red-500 text-xs font-medium">{errors.nameEn}</span>}
        </div>

        {/* Row 2 */}
        {/* Right: Certificate Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="certificateName">
            {dict?.profile?.form?.nameOnCertificate || "Name on Certificate"}
          </label>
          <input
            id="certificateName"
            name="certificateName"
            type="text"
            value={formData.certificateName}
            onChange={handleChange}
            placeholder={dict?.profile?.form?.writeNameHere || "Write your name here"}
            className={`w-full bg-gray-50 text-gray-700 placeholder:text-gray-400 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border ${errors.certificateName ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.certificateName && <span className="text-red-500 text-xs font-medium">{errors.certificateName}</span>}
        </div>

        {/* Left: Gender */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="gender">
            {dict?.profile?.form?.gender || "Gender"}
          </label>
          <div className="flex gap-4 h-[40px]">
            <label className={`flex-1 flex items-center justify-center gap-3 px-4 bg-gray-50 border rounded-xl cursor-pointer transition-all ${formData.gender === 'male' ? 'border-[#0b2646] ring-1 ring-[#0b2646]' : errors.gender ? 'border-red-500' : 'border-gray-200'}`}>
              <span className="text-gray-700 text-sm font-medium">{dict?.profile?.form?.male || "Male"}</span>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleChange}
                className="w-4 h-4 text-[#0b2646] focus:ring-[#0b2646] border-gray-300"
              />
            </label>
            <label className={`flex-1 flex items-center justify-center gap-3 px-4 bg-gray-50 border rounded-xl cursor-pointer transition-all ${formData.gender === 'female' ? 'border-[#0b2646] ring-1 ring-[#0b2646]' : errors.gender ? 'border-red-500' : 'border-gray-200'}`}>
              <span className="text-gray-700 text-sm font-medium">{dict?.profile?.form?.female || "Female"}</span>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleChange}
                className="w-4 h-4 text-[#0b2646] focus:ring-[#0b2646] border-gray-300"
              />
            </label>
          </div>
          {errors.gender && <span className="text-red-500 text-xs font-medium">{errors.gender}</span>}
        </div>

        {/* Row 3 */}
        {/* Right: Country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="country">
            {dict?.profile?.form?.country || "Country"}
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full bg-gray-50 text-gray-700 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border appearance-none ${errors.country ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="" disabled>{dict?.profile?.form?.selectCountry || "Select Country"}</option>
              {countries.map(c => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          {errors.country && <span className="text-red-500 text-xs font-medium">{errors.country}</span>}
        </div>

        {/* Left: DOB */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="dob">
            {dict?.profile?.form?.dob || "Date of Birth"}
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            className={`w-full bg-gray-50 text-gray-700 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border ${errors.dob ? 'border-red-500' : 'border-gray-200'}`}
          />
          {errors.dob && <span className="text-red-500 text-xs font-medium">{errors.dob}</span>}
        </div>

        {/* Row 4 */}
        {/* Right: Governorate */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="governorate">
            {dict?.profile?.form?.governorate || "Governorate"}
          </label>
          <div className="relative">
            <select
              id="governorate"
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              disabled={!formData.country || states.length === 0}
              className={`w-full bg-gray-50 text-gray-700 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border appearance-none disabled:opacity-50 ${errors.governorate ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="" disabled>{dict?.profile?.form?.selectGovernorate || "Select Governorate"}</option>
              {states.map(s => (
                <option key={s.isoCode} value={s.name}>{s.name}</option>
              ))}
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          {errors.governorate && <span className="text-red-500 text-xs font-medium">{errors.governorate}</span>}
        </div>

        {/* Left: Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm">
            {dict?.profile?.form?.phone || "Phone Number"}
          </label>
          <div dir="ltr" className={`w-full bg-gray-50 rounded-xl px-4 border focus-within:ring-1 focus-within:ring-[#0b2646] focus-within:border-[#0b2646] transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200'}`}>
            <PhoneInput
              international
              defaultCountry={formData.country && isSupportedCountry(formData.country) ? formData.country : "EG"}
              value={formData.phone}
              onChange={handlePhoneChange}
              className="flex items-center w-full h-[40px] [&_.PhoneInputCountry]:mr-3 [&_.PhoneInputCountrySelect]:opacity-0 [&_.PhoneInputCountrySelect]:cursor-pointer [&_.PhoneInputCountryIcon]:w-6 [&_.PhoneInputCountryIcon]:h-4 [&_.PhoneInputCountryIcon]:shadow-sm"
              numberInputProps={{
                className: "flex-1 w-full h-full bg-transparent border-none outline-none text-gray-700 text-sm focus:ring-0",
              }}
            />
          </div>
          {errors.phone && <span className="text-red-500 text-xs font-medium">{errors.phone}</span>}
        </div>

        {/* Row 5 */}
        {/* Right: Education Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="educationStatus">
            {dict?.profile?.form?.educationStatus || "Education Status"}
          </label>
          <div className="relative">
            <select
              id="educationStatus"
              name="educationStatus"
              value={formData.educationStatus}
              onChange={handleChange}
              className={`w-full bg-gray-50 text-gray-700 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border appearance-none ${errors.educationStatus ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="" disabled>{dict?.profile?.form?.educationStatus || "Education Status"}</option>
              <option value="graduated">{dict?.profile?.form?.graduated || "Graduated"}</option>
              <option value="student">{dict?.profile?.form?.student || "Student"}</option>
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          {errors.educationStatus && <span className="text-red-500 text-xs font-medium">{errors.educationStatus}</span>}
        </div>

        {/* Left: Work Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[#0b2646] font-bold text-sm" htmlFor="workField">
            {dict?.profile?.form?.workField || "Work Field"}
          </label>
          <div className="relative">
            <select
              id="workField"
              name="workField"
              value={formData.workField}
              onChange={handleChange}
              className={`w-full bg-gray-50 text-gray-700 rounded-xl px-4 py-2 h-[40px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all border appearance-none ${errors.workField ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="" disabled>{dict?.profile?.form?.workField || "Work Field"}</option>
              {workFields.map(field => (
                <option key={field.id} value={field.id}>{field.label}</option>
              ))}
            </select>
            <div className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-gray-400 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          {errors.workField && <span className="text-red-500 text-xs font-medium">{errors.workField}</span>}
        </div>

      </div>

      {/* Save Button */}
      <div className="flex items-center justify-center md:justify-end mt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-3 rounded-lg bg-[#0b2646] hover:bg-[#061528] text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            dict?.profile?.form?.save || "Save"
          )}
        </button>
      </div>

    </form>
  );
}

// Trigger CodeRabbit review 2
