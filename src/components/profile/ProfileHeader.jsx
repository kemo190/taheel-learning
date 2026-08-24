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

export default function ProfileHeader({ user, locale, dict }) {
  const isRtl = locale === 'ar';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  
  // Determine if Google is linked
  const isGoogleLinked = user?.app_metadata?.providers?.includes('google');

  return (
    <div 
      className="bg-gradient-to-b md:bg-gradient-to-r from-[#0b2646] to-[#000C58] flex flex-col items-center justify-center gap-8 rounded-2xl p-8 md:p-12 md:flex-row md:justify-between shadow-sm"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Right Side (Avatar and Greeting) */}
      <div className="flex flex-col md:flex-row items-center md:items-center gap-5 w-full md:w-auto text-center md:text-start">
        
        {/* Avatar */}
        <div className="relative rounded-full bg-[#E5EEFF] p-1 shadow-md shrink-0">
          <span className="relative flex shrink-0 overflow-hidden rounded-full h-24 w-24 bg-white items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img 
                className="aspect-square h-full w-full object-cover object-center" 
                alt={userName} 
                src={user.user_metadata.avatar_url} 
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="#0b2646" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="m-auto w-12 h-12">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </span>
          <label 
            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center justify-center text-white font-normal bg-[#0b2646] absolute rtl:-left-2 ltr:-right-2 -bottom-2 cursor-pointer rounded-full p-2 drop-shadow-xl transition-colors hover:bg-[#1e3a8a] border-2 border-white" 
            htmlFor="photo-upload"
          >
            <svg width="23" height="21" viewBox="0 0 23 21" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white">
              <path fillRule="evenodd" clipRule="evenodd" d="M6.99132 1.56956C6.99132 0.959217 7.44798 0.463867 8.01188 0.463867H14.8163C15.3802 0.463867 15.8369 0.959217 15.8369 1.56956C15.8369 2.1799 15.3802 2.67525 14.8163 2.67525H8.01188C7.44798 2.67525 6.99132 2.1799 6.99132 1.56956ZM8.95724 20.3663H13.8709C17.3218 20.3663 19.0478 20.3663 20.2873 19.568C20.8205 19.2251 21.2811 18.7807 21.6428 18.26C22.471 17.0658 22.471 15.4018 22.471 12.0736C22.471 8.74549 22.471 7.08253 21.6417 5.88728C21.2804 5.36663 20.8202 4.92217 20.2873 4.57925C19.0478 3.78094 17.3218 3.78094 13.8709 3.78094H8.95724C5.50638 3.78094 3.7804 3.78094 2.54092 4.57925C2.008 4.9222 1.54777 5.36665 1.18645 5.88728C0.357178 7.08143 0.357178 8.74549 0.357178 12.0714V12.0736C0.357178 15.4018 0.357178 17.0647 1.18534 18.26C1.54358 18.7774 2.00355 19.2219 2.54092 19.568C3.7804 20.3663 5.50638 20.3663 8.95724 20.3663ZM6.80667 12.0736C6.80667 9.61899 8.86989 7.63096 11.4141 7.63096C13.9583 7.63096 16.0215 9.6201 16.0215 12.0736C16.0215 14.5272 13.9572 16.5163 11.4141 16.5163C8.86989 16.5163 6.80667 14.526 6.80667 12.0736ZM8.64986 12.0736C8.64986 10.6008 9.88824 9.40891 11.4141 9.40891C12.9399 9.40891 14.1783 10.6019 14.1783 12.0736C14.1783 13.5453 12.9399 14.7383 11.4141 14.7383C9.88824 14.7383 8.64986 13.5453 8.64986 12.0736ZM18.171 7.63096C17.6624 7.63096 17.2499 8.02901 17.2499 8.51993C17.2499 9.00975 17.6624 9.4078 18.171 9.4078H18.7857C19.2944 9.4078 19.7068 9.00975 19.7068 8.51993C19.7068 8.02901 19.2944 7.63096 18.7857 7.63096H18.171Z" fill="currentColor"></path>
            </svg>
            <span className="sr-only">Upload new photo</span>
          </label>
          <input className="hidden" id="photo-upload" accept="image/jpeg,image/jpg,image/png,image/svg" type="file" />
        </div>
        
        {/* Greeting Text */}
        <div className="text-white mt-4 md:mt-0">
          <h3 className="text-3xl md:text-[2.5rem] font-bold mb-2 md:mb-4 leading-tight">
            {dict.profile.hello} {userName} 👋
          </h3>
          <p className="text-xl md:text-2xl font-medium text-blue-100">
            {dict.profile.readyToContinue}
          </p>
        </div>
      </div>

      {/* Left Side (Linked Accounts) */}
      <div className="flex w-full md:max-w-[600px] md:grow flex-col gap-4 rounded-2xl bg-white/80 backdrop-blur-md p-6">
        <h1 className="text-[#0b2646] text-xl font-extrabold">{dict.profile.linkedAccounts}</h1>
        <p className="text-gray-600 text-sm font-medium">
          {dict.profile.linkAccountsDesc}
        </p>
        
        <div className="gap-4">
          <div className="relative flex h-full min-h-[4.8rem] gap-4 rounded-[14px] bg-white p-3 border border-gray-100 shadow-sm">
            <div className="self-center shrink-0">
              <GoogleIcon />
            </div>
            <div className="self-center">
              <h2 className="text-[#0b2646] text-sm sm:text-base md:text-lg font-bold truncate max-w-[150px] sm:max-w-[200px]">{user?.email}</h2>
              <p className="text-gray-500 text-xs sm:text-sm font-medium mt-0.5">
                {isGoogleLinked ? dict.profile.linked : dict.profile.notLinkedEmail}
              </p>
            </div>
            
            {isGoogleLinked && (
              <div className="rtl:mr-auto ltr:ml-auto flex h-full flex-col justify-between gap-2">
                <button 
                  onClick={() => alert(dict.profile.featureComingSoon)}
                  className="text-red-500 hover:text-red-700 rtl:mr-auto ltr:ml-auto mt-1 h-fit w-fit transition-colors"
                  title="Unlink"
                >
                  <TrashIcon />
                </button>
                <button 
                  onClick={() => alert(dict.profile.featureComingSoon)}
                  className="border border-gray-200 hover:bg-gray-50 h-8 rounded-md px-3 text-[#0b2646] mb-1 w-auto min-w-[110px] bg-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
                >
                  {dict.profile.changeAccount}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
