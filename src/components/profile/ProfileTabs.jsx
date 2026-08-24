"use client";

import React, { useState } from 'react';
import ProfileForm from './ProfileForm';
import AccountDetails from './AccountDetails';
import Interests from './Interests';
import OrderHistory from './OrderHistory';

export default function ProfileTabs({ locale, profile, userId, dict }) {
  const isRtl = locale === 'ar';
  const [activeTab, setActiveTab] = useState('personal');

  const tabs = [
    { id: 'personal', name: dict.profile.tabs.personal },
    { id: 'account', name: dict.profile.tabs.account },
    { id: 'interests', name: dict.profile.tabs.interests },
    { id: 'history', name: dict.profile.tabs.history },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <ProfileForm initialData={profile} locale={locale} userId={userId} dict={dict} />;
      case 'account':
        return <AccountDetails locale={locale} dict={dict} />;
      case 'interests':
        return <Interests locale={locale} dict={dict} />;
      case 'history':
        return <OrderHistory locale={locale} dict={dict} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="my-8 space-y-4">
        <div>
          <div className="hide-scroll-bar my-4 flex w-full items-center gap-4 overflow-x-auto py-1 md:gap-6 md:rounded-2xl md:bg-white md:px-6 md:py-3.5">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative h-auto w-max rounded-xl py-2 text-center text-sm whitespace-nowrap transition-colors max-md:bg-white max-md:px-6 ${isActive ? 'text-[#0b2646] font-bold md:text-base' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {tab.name}
                  {isActive && (
                    <span className="bg-[#0b2646] shadow-[#0b2646] shadow-4xl absolute bottom-0 left-0 hidden h-[3px] w-full rounded-full md:block"></span>
                  )}
                </button>
              );
            })}
            <button 
              onClick={() => alert(dict.profile.featureComingSoon)}
              className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap duration-300 cursor-pointer rounded-2xl transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&>svg]:pointer-events-none [&>svg]:size-4 [&>svg]:shrink-0 px-[1.5rem] bg-red-600 text-white hover:bg-red-700 h-auto py-2 text-sm font-normal"
            >
              {dict.profile.deleteAccount}
            </button>
          </div>
        </div>
      </div>

      {/* Form / Content Area */}
      <div>
        {renderActiveTabContent()}
      </div>
    </div>
  );
}
