"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-toastify';
import ProfileForm from './ProfileForm';
import AccountDetails from './AccountDetails';
import OrderHistory from './OrderHistory';

export default function ProfileTabs({ locale, profile, user, dict }) {
  const isRtl = locale === 'ar';
  const [activeTab, setActiveTab] = useState('personal');
  const [localProfile, setLocalProfile] = useState(profile);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs = [
    { id: 'personal', name: dict.profile.tabs.personal },
    { id: 'account', name: dict.profile.tabs.account },
    { id: 'history', name: dict.profile.tabs.history },
  ];

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);

      // Call our secure postgres function to delete the user from auth.users
      const { error } = await supabase.rpc('delete_user');
      
      if (error) throw error;

      toast.success(dict?.profile?.deleteModal?.deleteSuccess || 'Account deleted successfully.');
      
      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = `/${locale}`;

    } catch (error) {
      toast.error(error.message || 'An error occurred while deleting the account');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <ProfileForm initialData={localProfile} locale={locale} userId={user?.id} dict={dict} onProfileUpdate={(updatedData) => setLocalProfile(updatedData)} />;
      case 'account':
        return <AccountDetails locale={locale} user={user} dict={dict} />;
      case 'history':
        return <OrderHistory locale={locale} user={user} dict={dict} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 md:gap-8 my-6" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Sidebar / Tabs Navigation */}
      <div className="w-full xl:w-72 shrink-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
          <div className="flex flex-row xl:flex-col overflow-x-auto xl:overflow-visible p-3 gap-2 hide-scroll-bar whitespace-nowrap scroll-smooth flex-nowrap">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center w-full px-4 py-3.5 text-sm transition-colors rounded-xl whitespace-nowrap text-start ${
                    isActive 
                      ? 'bg-[#f4f7fb] text-[#0b2646] font-bold' 
                      : 'text-gray-600 font-medium hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {tab.name}
                </button>
              );
            })}
            
            <div className="xl:mt-2 xl:pt-2 xl:border-t border-gray-100 flex items-center justify-center shrink-0">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className={`w-full flex items-center justify-start gap-2 px-4 py-3.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                  isDeleting 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-red-500 hover:bg-red-50 hover:text-red-700'
                }`}
              >
                {isDeleting ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                )}
                {isDeleting ? (dict?.profile?.deleteModal?.deleting || 'Deleting...') : (dict?.profile?.deleteAccount || 'Delete Account')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-8">
          {renderActiveTabContent()}
        </div>
      </div>
      
      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden relative">
            
            {/* Close Button */}
            <button 
              onClick={() => !isDeleting && setShowDeleteModal(false)}
              className="absolute top-4 rtl:left-4 ltr:right-4 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isDeleting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div className="p-8 flex flex-col items-center text-center">
              {/* Illustration (SVG styling similar to image) */}
              <div className="mb-6 relative flex justify-center items-center">
                <div className="absolute w-24 h-6 bg-blue-100 rounded-full bottom-0 opacity-60"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 text-red-500 fill-red-50">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#0b2646] mb-3">
                {dict?.profile?.deleteModal?.deleteConfirmTitle || 'Are you sure you want to delete the account?'}
              </h3>
              
              {/* Description */}
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8 max-w-sm whitespace-pre-line">
                {dict?.profile?.deleteModal?.deleteConfirmDesc || 'This action will permanently delete your account and all your data. This cannot be undone.'}
              </p>

              {/* Action Buttons */}
              <div className="flex w-full items-center justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  {dict?.profile?.deleteModal?.cancelDelete || 'Cancel'}
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors flex justify-center items-center gap-2"
                >
                  {isDeleting ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    dict?.profile?.deleteModal?.confirmDelete || 'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
