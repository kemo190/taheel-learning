"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CourseSidebar({ track, sessions, completedSessionIds, locale }) {
  const params = useParams();
  const currentSessionId = params.sessionId;
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar toggle

  const progressPercentage = sessions.length > 0
    ? Math.round((completedSessionIds.length / sessions.length) * 100)
    : 0;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-[#0b2646] text-white p-4 rounded-full shadow-xl flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 right-0 h-screen w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <Link href={`/${locale}/journey`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0b2646] mb-6 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" x2="5" y1="12" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            العودة للوحة التعليم
          </Link>
          <h2 className="text-xl font-bold text-[#0b2646] leading-snug">{track.title_ar}</h2>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-gray-700">نسبة الإنجاز</span>
              <span className="font-bold text-[#0b2646]">{progressPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => {
            const isCompleted = completedSessionIds.includes(session.id);
            const isActive = currentSessionId === session.id;

            return (
              <Link 
                key={session.id}
                href={`/${locale}/learn/${track.id}/${session.id}`}
                onClick={() => setIsOpen(false)}
                className={`group flex items-start gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-[#0b2646]/5 border border-[#0b2646]/10" 
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                {/* Icon Check/Play */}
                <div className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted 
                    ? "bg-emerald-100 text-emerald-600"
                    : isActive
                      ? "bg-[#0b2646] text-white"
                      : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
                }`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isActive ? "text-[#0b2646]" : "text-gray-700 group-hover:text-gray-900"}`}>
                    {session.order_index}. {session.title_ar}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {session.duration_min} دقيقة
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

      </aside>
    </>
  );
}
