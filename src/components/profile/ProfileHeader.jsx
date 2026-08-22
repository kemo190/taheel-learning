"use client";

import React from 'react';
import Image from 'next/image';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export default function ProfileHeader({ user, locale }) {
  const isRtl = locale === 'ar';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Determine if Google is linked
  const isGoogleLinked = user?.app_metadata?.providers?.includes('google');

  return (
    <div className="w-full bg-[#1e3a8a] md:rounded-[2rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Decor (Optional subtlety) */}
      <div className="absolute top-0 ltr:left-0 rtl:right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 rtl:translate-x-1/2 ltr:-translate-x-1/2 pointer-events-none"></div>

      {/* Right Side (User Greeting & Avatar) */}
      <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
        <div className="relative group cursor-pointer shrink-0">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#8da5ff] border-4 border-[#1e3a8a] flex items-center justify-center overflow-hidden shadow-lg">
            {user?.user_metadata?.avatar_url ? (
              <Image src={user.user_metadata.avatar_url} alt="Avatar" layout="fill" objectFit="cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
          {/* Camera Icon Badge */}
          <div className="absolute bottom-1 rtl:left-1 ltr:right-1 bg-[#0b2646] text-white p-2 rounded-full border-2 border-white shadow-sm group-hover:bg-[#1e3a8a] transition-colors">
            <CameraIcon />
          </div>
        </div>

        <div className="text-white space-y-1.5 flex-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2 flex-wrap">
            <span>{isRtl ? 'أهلاً' : 'Hello'} {userName}</span>
            <span className="text-2xl animate-wave origin-bottom-right">👋</span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base font-medium">
            {isRtl ? 'جاهز تكمل رحلتك انهاردة' : 'Ready to continue your journey today'}
          </p>
        </div>
      </div>

      {/* Left Side (Linked Accounts) */}
      <div className="w-full md:w-[380px] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 relative z-10 flex flex-col justify-center">
        <h3 className="text-white font-bold text-sm mb-1">{isRtl ? 'الحسابات المرتبطة' : 'Linked Accounts'}</h3>
        <p className="text-blue-200 text-xs mb-4">{isRtl ? 'يمكنك ربط حسابات هويتك لتبسيط تسجيل الدخول إليك' : 'You can link your identity accounts to simplify login'}</p>
        
        <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <GoogleIcon />
            <div className="flex flex-col rtl:text-right ltr:text-left min-w-0">
              <span className="text-sm font-bold text-blue-600 truncate">{user?.email}</span>
              {isGoogleLinked ? (
                <span className="text-[11px] text-gray-400 truncate">{isRtl ? 'تم الربط' : 'Linked'}</span>
              ) : (
                <span className="text-[11px] text-gray-400 truncate">{isRtl ? 'غير مرتبط (حساب بريد إلكتروني)' : 'Not Linked (Email Account)'}</span>
              )}
            </div>
          </div>
          
          {isGoogleLinked && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button className="text-[11px] sm:text-xs font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-colors whitespace-nowrap">
                {isRtl ? 'تغيير الحساب' : 'Change Account'}
              </button>
              <button className="p-1 sm:p-1.5 hover:bg-red-50 rounded-lg transition-colors shrink-0" title="Unlink">
                <TrashIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
