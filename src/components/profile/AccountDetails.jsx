"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import { GoogleIcon } from '@/components/icons';

export default function AccountDetails({ locale, user, dict }) {
  const isRtl = locale === 'ar';
  const isGoogleProvider = user?.app_metadata?.provider === 'google';
  
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      toast.error(dict?.profile?.account?.passwordMinLength || 'Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(dict?.profile?.account?.passwordsNotMatch || 'Passwords do not match');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(dict?.profile?.account?.passwordUpdated || 'Password updated successfully');
      setIsEditingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pb-4" dir={isRtl ? 'rtl' : 'ltr'}>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full pt-4">
        {/* Right Column (RTL) - Email */}
        <div className="flex flex-col gap-4">
          <h3 className="text-center font-bold text-[#0b2646] text-lg">
            {dict?.profile?.account?.emailLabel || "Email Address"}
          </h3>
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 border border-gray-100 flex items-center h-[72px]">
            <span className="text-[#0b2646] font-medium text-[15px] rtl:ml-auto ltr:mr-auto">
              {user?.email || 'user@example.com'}
            </span>
          </div>
        </div>

        {/* Left Column (RTL) - Password */}
        <div className="flex flex-col gap-4">
          <h3 className="text-center font-bold text-[#0b2646] text-lg">
            {dict?.profile?.account?.passwordLabel || "Password"}
          </h3>
          
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-5 border border-gray-100 relative min-h-[72px]">
            
            {/* Password Display / Actions */}
            <div className="flex items-center w-full h-8">
              {!isEditingPassword && !isGoogleProvider && (
                <span className="text-gray-400 font-bold tracking-[0.25em] text-lg rtl:ml-auto ltr:mr-auto translate-y-1">
                  ••••••••
                </span>
              )}
              
              {isGoogleProvider && (
                <div className="flex items-center gap-2 rtl:ml-auto ltr:mr-auto">
                  <GoogleIcon />
                  <span className="text-[#0b2646] font-medium text-[15px]">{dict?.profile?.linked || 'Linked'}</span>
                </div>
              )}

              {!isEditingPassword && !isGoogleProvider && (
                <button 
                  onClick={() => setIsEditingPassword(true)}
                  className="text-gray-500 hover:text-[#0b2646] transition-colors p-1 flex items-center justify-center shrink-0"
                  aria-label="Edit password"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path></svg>
                </button>
              )}
            </div>

            {/* Editing State UI */}
            {isGoogleProvider ? (
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-[#0b2646] font-medium text-sm">
                  {dict?.profile?.account?.googleLinked || 'Your account is linked via Google. There is no password.'}
                </span>
              </div>
            ) : !isEditingPassword ? (
              <div className="flex flex-col gap-2 pt-2">
                {/* Space reserved if needed */}
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                
                {/* New Password */}
                <div className="relative w-full">
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={dict?.profile?.account?.newPassword || "New Password"}
                    className="w-full bg-[#f4f7fb] text-gray-700 placeholder:text-gray-400 rounded-lg px-4 py-3 h-[48px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all"
                  />
                </div>

                {/* Confirm Password */}
                <div className="relative w-full">
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={dict?.profile?.account?.confirmNewPassword || "Confirm New Password"}
                    className="w-full bg-[#f4f7fb] text-gray-700 placeholder:text-gray-400 rounded-lg px-4 py-3 h-[48px] text-sm focus:outline-none focus:ring-1 focus:ring-[#0b2646] transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2">
                  <button 
                    onClick={() => {
                      setIsEditingPassword(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    disabled={loading}
                    className="px-6 sm:px-8 py-2.5 rounded-lg border border-gray-200 text-[#0b2646] hover:bg-gray-50 font-medium text-sm transition-colors min-w-[100px] sm:min-w-[120px] disabled:opacity-50"
                  >
                    {dict?.profile?.account?.cancel || "Cancel"}
                  </button>
                  <button 
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                    className="px-6 sm:px-8 py-2.5 rounded-lg bg-[#0b2646] hover:bg-[#061528] text-white font-medium text-sm transition-colors min-w-[100px] sm:min-w-[120px] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      dict?.profile?.account?.save || "Save"
                    )}
                  </button>
                </div>

              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
