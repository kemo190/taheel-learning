"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileTabs({ locale }) {
  const pathname = usePathname();
  const isRtl = locale === 'ar';

  const tabs = [
    { name: isRtl ? 'البيانات الشخصية' : 'Personal Data', href: `/${locale}/profile` },
    { name: isRtl ? 'بيانات الحساب' : 'Account Data', href: `/${locale}/profile/account` },
    { name: isRtl ? 'الاهتمامات' : 'Interests', href: `/${locale}/profile/interests` },
    { name: isRtl ? 'سجل الشراء' : 'Purchase History', href: `/${locale}/profile/purchases` },
  ];

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {tabs.map((tab, idx) => {
          const isActive = pathname === tab.href;
          return (
            <Link 
              key={idx}
              href={tab.href}
              className={`whitespace-nowrap px-4 py-4 text-sm font-bold transition-colors relative ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg'}`}
            >
              {tab.name}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center">
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors shadow-sm whitespace-nowrap">
          {isRtl ? 'حذف الحساب' : 'Delete Account'}
        </button>
      </div>
    </div>
  );
}
