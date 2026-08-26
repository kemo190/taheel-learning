"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

export default function ProfileHeader({ user, profile, locale, dict }) {
  const isRtl = locale === 'ar';
  const [isUploading, setIsUploading] = useState(false);
  
  const displayName = profile?.certificate_name 
    || profile?.full_name 
    || user?.user_metadata?.full_name 
    || user?.email?.split('@')[0];

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0b2646&color=fff&size=150`;
  const avatarUrl = profile?.avatar_url || defaultAvatar;

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
        .from('profiles')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, 
          avatar_url: publicUrl 
        });

      if (profileError) throw profileError;

      toast.success(dict?.profile?.header?.imageUpdated || 'Profile picture updated successfully!');
      
      // Reload page to reflect changes across the app
      window.location.reload();
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-[#0b2646] rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mt-2" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Background Decor */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/2 pointer-events-none"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-6 z-10 w-full">
        {/* Profile Image with Upload */}
        <div className="relative group shrink-0">
          <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white/20 overflow-hidden relative shadow-xl ${isUploading ? 'opacity-50' : ''}`}>
            <Image 
              src={avatarUrl}
              alt="Profile"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 112px"
            />
          </div>
          
          {/* Only show upload button if it's their profile */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 rounded-full pointer-events-none"></div>
          
          <div className="absolute bottom-1 rtl:left-1 ltr:right-1">
            {isUploading ? (
              <div className="bg-white text-gray-700 p-2 rounded-full shadow-sm border border-gray-200">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
              <label 
                className={`absolute bottom-1 rtl:left-1 ltr:right-1 bg-white text-gray-700 p-2 rounded-full shadow-sm border border-gray-200 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
                htmlFor="photo-upload"
                title={dict?.profile?.header?.editPhoto || "Change Photo"}
              >
                <CameraIcon />
                <span className="sr-only">{dict?.profile?.header?.uploadNewPhoto || "Upload new photo"}</span>
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

        {/* User Info */}
        <div className="flex flex-col text-center md:text-start gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
            {displayName || dict?.profile?.header?.userFallback || 'User'}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </h1>
          <p className="text-blue-100 text-sm md:text-base font-medium opacity-90">{user?.email}</p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="w-full md:w-auto flex flex-col items-center justify-center gap-4 z-10 shrink-0">
        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex items-center justify-center md:justify-end gap-3 w-full md:w-auto shrink-0 md:pb-2">
            <button 
              type="button"
              disabled={isUploading}
              onClick={() => document.getElementById('photo-upload')?.click()}
              className="px-5 py-2.5 md:py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-bold md:font-medium text-sm border border-gray-300 shadow-sm transition-colors whitespace-nowrap flex items-center justify-center gap-2 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
              {dict?.profile?.header?.editPhoto || 'Edit Photo'}
            </button>
          </div>
          
          <div className="flex items-center gap-1.5 text-blue-100/70 text-xs font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
            <span>{isRtl ? 'آخر دخول:' : 'Last login:'} {new Date(user?.last_sign_in_at).toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
