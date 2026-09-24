"use client";

import { useState } from "react";

export default function CourseCurriculum({ sections, sessions, type = 'course' }) {
  // If there are no sections, all sessions belong to a default section
  const hasSections = sections && sections.length > 0;
  
  const displaySections = hasSections 
    ? sections.sort((a, b) => a.order_index - b.order_index) 
    : [{ id: 'default', title_ar: type === 'track' ? 'محتوى المسار' : 'محتوى الدورة', order_index: 1 }];

  const [openSections, setOpenSections] = useState([displaySections[0]?.id]);

  const toggleSection = (id) => {
    if (openSections.includes(id)) {
      setOpenSections(openSections.filter(secId => secId !== id));
    } else {
      setOpenSections([...openSections, id]);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 دقيقة";
    if (minutes < 60) return `${minutes} دقيقة`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} ساعة و ${m} دقيقة` : `${h} ساعة`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-[#0b2646]">
          {type === 'track' ? 'محتوى المسار' : 'محتوى الدورة'}
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {displaySections.length} أقسام • {sessions.length} محاضرات
        </span>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-gray-500">جاري إعداد محتوى هذه الدورة وسيتم إتاحته قريباً.</p>
        </div>
      ) : (
        <div className="space-y-4 border border-gray-200 rounded-none bg-white overflow-hidden shadow-none">
          {displaySections.map((section, index) => {
            const sectionSessions = hasSections 
              ? sessions.filter(s => s.section_id === section.id).sort((a, b) => a.order_index - b.order_index)
              : sessions.sort((a, b) => a.order_index - b.order_index);
            
            const totalMinutes = sectionSessions.reduce((acc, curr) => acc + (curr.duration_min || 0), 0);
            const isOpen = openSections.includes(section.id);

            return (
              <div key={section.id} className={`${index !== 0 ? 'border-t border-gray-100' : ''}`}>
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors text-right focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <span className={`transform transition-transform duration-200 text-[#0b2646] ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg">{section.title_ar}</h3>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span>{sectionSessions.length} محاضرات</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span>{formatDuration(totalMinutes)}</span>
                  </div>
                </button>

                {/* Accordion Body */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-2 space-y-1 bg-white">
                    {sectionSessions.length > 0 ? (
                      sectionSessions.map((session, sIndex) => (
                        <div key={session.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                            </span>
                            <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                              {sIndex + 1}. {session.title_ar}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {session.is_preview && (
                              <button className="text-xs font-bold text-blue-600 underline hover:text-blue-800 transition-colors hidden sm:block focus:outline-none">
                                معاينة مجانية
                              </button>
                            )}
                            <span className="text-sm text-gray-500 font-medium">
                              {formatDuration(session.duration_min)}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-400 text-center">لا توجد محاضرات في هذا القسم بعد.</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
