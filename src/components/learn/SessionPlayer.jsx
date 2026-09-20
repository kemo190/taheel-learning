"use client";

import React from "react";

export default function SessionPlayer({ session }) {
  const isLive = session.type === "live";

  if (isLive) {
    return (
      <div className="bg-[#0b2646] rounded-2xl aspect-video w-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden shadow-2xl">
        {/* Decorator */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z"/><rect x="3" y="6" width="12" height="12" rx="2" ry="2"/></svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-3">جلسة تفاعلية مباشرة</h2>
          <p className="text-gray-300 max-w-md mb-8">
            هذه الجلسة تعتمد على البث المباشر. انضم الآن وتفاعل مع المدرب وزملائك في الوقت الفعلي.
          </p>

          <a 
            href={session.material_url || "#"} 
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/30 transition-all flex items-center gap-2 text-lg"
          >
            الانضمام للبث المباشر
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </div>
    );
  }

  if (session.recording_url) {
    // Basic video player for recorded sessions
    // Using standard HTML5 video. Can be swapped for YouTube/Vimeo embeds depending on actual URL format.
    return (
      <div className="bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video w-full">
        <video 
          controls 
          className="w-full h-full object-cover"
          poster="/hero-student.jpg"
          controlsList="nodownload"
        >
          <source src={session.recording_url} type="video/mp4" />
          متصفحك لا يدعم مشغل الفيديو.
        </video>
      </div>
    );
  }

  // Fallback if no recording is uploaded yet
  return (
    <div className="bg-gray-100 rounded-2xl aspect-video w-full flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-gray-300">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" x2="7" y1="2" y2="22"/><line x1="17" x2="17" y1="2" y2="22"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="2" x2="7" y1="7" y2="7"/><line x1="2" x2="7" y1="17" y2="17"/><line x1="17" x2="22" y1="17" y2="17"/><line x1="17" x2="22" y1="7" y2="7"/></svg>
      </div>
      <h2 className="text-xl font-bold text-gray-700 mb-2">جاري التجهيز</h2>
      <p className="text-gray-500">
        سيتم رفع تسجيل هذه الجلسة قريباً. يرجى العودة لاحقاً.
      </p>
    </div>
  );
}
