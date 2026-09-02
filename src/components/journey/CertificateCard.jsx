'use client';
import React, { useState } from 'react';

export default function CertificateCard({
  dict,
  title,
  completionDate,
  imageSrc
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="border-[#D6D6D6] relative flex h-fit w-full flex-col gap-3 overflow-hidden rounded-2xl border bg-white shadow-md shadow-[#0b26461A] hover:-translate-y-1 transition-transform duration-300">
        <div className="flex flex-col gap-2 p-3">
          <img 
            alt="certificate image" 
            className="border-[#D6D6D6] h-46 w-full rounded-xl border object-cover bg-gray-50" 
            loading="lazy" 
            src={imageSrc} 
          />
          <div className="px-1 mt-1">
            <p className="text-primary-darkBlue mb-2 font-semibold text-lg">{title}</p>
            <p className="text-primary-darkBlue text-sm font-semibold flex items-center gap-1">
              {dict?.journey?.certificateCard?.completionDate || "تاريخ الاكتمال:"}
              <span className="text-primary-mainBlue" dir="ltr">{completionDate}</span>
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="block w-full cursor-pointer bg-[#0b2646] hover:bg-[#061528] transition-colors py-4 text-center text-sm font-bold text-white"
        >
          {dict?.journey?.certificateCard?.viewCertificate || "عرض الشهادة"}
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" dir="rtl">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white p-4 sm:p-6 shadow-2xl flex flex-col pt-20 animate-in fade-in zoom-in duration-300">
            
            {/* Close Button (Left) */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 sm:top-6 left-4 sm:left-6 flex h-8 w-8 items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {/* Actions (Right) */}
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-4 sm:gap-6">
              <button className="flex flex-col items-center gap-1 text-primary-mainBlue hover:opacity-80 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-mainBlue/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </div>
                <span className="text-sm font-bold">{dict?.journey?.certificateCard?.download || "تحميل"}</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-primary-mainBlue hover:opacity-80 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-mainBlue/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                </div>
                <span className="text-sm font-bold">{dict?.journey?.certificateCard?.share || "مشاركة"}</span>
              </button>
            </div>

            {/* Certificate Image */}
            <div className="mt-4 flex w-full justify-center">
              <img 
                alt="Certificate Full" 
                src={imageSrc} 
                className="w-full max-w-4xl rounded-xl object-contain border border-gray-200 max-h-[50vh] sm:max-h-[70vh]"
              />
            </div>
          </div>
          
          {/* Click outside to close (optional but good for UX) */}
          <div className="absolute inset-0 -z-10" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </>
  );
}

