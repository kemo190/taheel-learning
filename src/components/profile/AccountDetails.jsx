import React from 'react';

export default function AccountDetails({ locale, dict }) {
  const isRtl = locale === 'ar';

  return (
    <div className="rounded-xl px-0 sm:px-8 py-4 bg-white shadow-sm border border-gray-100 min-h-[300px] flex flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-[#0b2646] mb-2">
        {dict.profile.accountDetails}
      </h2>
      <p className="text-gray-500">
        {dict.profile.underConstruction}
      </p>
    </div>
  );
}
