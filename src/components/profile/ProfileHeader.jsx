"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

export default function ProfileHeader({ user, profile, locale, dict }) {
  const isRtl = locale === 'ar';
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  const displayName = profile?.certificate_name 
    || profile?.full_name 
    || user?.user_metadata?.full_name 
    || user?.email?.split('@')[0];

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0b2646&color=fff&size=150`;
  const [localAvatarUrl, setLocalAvatarUrl] = useState(
    profile?.avatar_url || user?.user_metadata?.avatar_url || defaultAvatar
  );

  const handleImageUpload = async (event) => {
    try {
      setIsUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error(dict?.profile?.header?.mustSelectImage || 'You must select an image to upload.');
      }

      const file = event.target.files[0];
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(isRtl ? 'يجب أن تكون الصورة بصيغة JPEG أو PNG أو WEBP' : 'Image must be JPEG, PNG, or WEBP');
      }

      if (file.size > MAX_SIZE) {
        throw new Error(isRtl ? 'حجم الصورة يجب أن لا يتجاوز 5 ميجابايت' : 'Image size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: publicUrl 
        });

      if (profileError) throw profileError;

      // Update local state immediately so avatar changes instantly
      setLocalAvatarUrl(publicUrl);

      toast.success(dict?.profile?.header?.imageUpdated || 'Profile picture updated successfully!');
      
      // Notify other client components (like AuthNav) to re-fetch profile data
      window.dispatchEvent(new Event('profileUpdated'));
      
      // Use Next.js soft refresh instead of full page reload for faster UX
      router.refresh();
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="w-full mt-2 mb-8 rounded-[24px] overflow-hidden shadow-sm border border-gray-200 bg-white"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Cover Photo / Banner */}
      <div className="relative w-full h-24 md:h-32 overflow-hidden">
        <Image
          src="/footer.webp"
          alt="Profile Cover"
          fill
          className="object-cover object-center -scale-y-100"
          quality={100}
          priority
        />
        {/* Dark Navy Tint matching #0b2646 */}
        <div className="absolute inset-0 bg-[#0b2646]/95 mix-blend-multiply"></div>
      </div>

      {/* Content Section (White Background) */}
      <div className="relative px-6 md:px-10 pb-5 pt-2 flex flex-col md:flex-row md:items-end justify-between gap-4">
        
        {/* Right (in RTL): Avatar + Info */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-5">
          {/* Avatar Container with negative margin to overlap banner */}
          <div className="relative shrink-0 z-10 -mt-12 md:-mt-16">
            {/* Outer ring */}
            <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-white shadow-sm ${isUploading ? 'opacity-60' : ''}`}>
              <div className="w-full h-full rounded-full overflow-hidden relative bg-gray-100">
                <Image
                  src={localAvatarUrl}
                  alt="Profile"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 112px, 144px"
                />
              </div>
            </div>

            {/* Camera button overlapping avatar */}
            <div className="absolute bottom-1 rtl:left-1 ltr:right-1 z-20">
              {isUploading ? (
                <div className="bg-white p-2 rounded-full shadow-md border border-gray-200 flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 text-[#0b2646]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                <>
                  <label
                    htmlFor="photo-upload"
                    title={dict?.profile?.header?.editPhoto || 'Change Photo'}
                    className="bg-white text-gray-600 p-2 rounded-full shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <CameraIcon />
                    <span className="sr-only">{dict?.profile?.header?.uploadNewPhoto || 'Upload new photo'}</span>
                  </label>
                  <input
                    className="hidden"
                    type="file"
                    id="photo-upload"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </>
              )}
            </div>
          </div>

          {/* User Name & Subtitle - Aligned to bottom of avatar container */}
          <div className="flex flex-col items-center md:items-start text-center md:text-start pb-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b2646] mb-1 tracking-tight">
              {displayName || dict?.profile?.header?.userFallback || 'User'}
            </h1>
            <p className="text-gray-500 text-sm md:text-base font-medium">
              {dict?.profile?.hello || (isRtl ? 'أهلاً' : 'Hello')}, {dict?.profile?.readyToContinue || (isRtl ? 'جاهز تكمل رحلتك انهاردة' : 'Ready to continue your journey today')}
            </p>
          </div>
        </div>

        {/* Left (in RTL): Edit Button */}
        <div className="flex items-center justify-center shrink-0 w-full md:w-auto pb-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => document.getElementById('photo-upload')?.click()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-xl shadow-sm transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
            {dict?.profile?.header?.editPhoto || (isRtl ? 'تعديل الصورة' : 'Edit Photo')}
          </button>
        </div>

      </div>
    </div>
  );
}


// Trigger CodeRabbit review
