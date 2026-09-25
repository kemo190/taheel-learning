"use client";

import { useState } from "react";

export default function CourseCurriculum({ sections, sessions, type = 'course', trackDuration }) {
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

  const isAllOpen = openSections.length === displaySections.length;
  const toggleAll = () => {
    if (isAllOpen) {
      setOpenSections([]);
    } else {
      setOpenSections(displaySections.map(s => s.id));
    }
  };

  const formatDurationFull = (minutes) => {
    if (!minutes) return "0 د";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0 && m > 0) return `${h} س ${m} د`;
    if (h > 0) return `${h} س`;
    return `${m} د`;
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div className="border border-slate-200 p-8 text-center bg-slate-50">
        <p className="text-slate-500 font-medium">جاري إعداد محتوى هذه الدورة وسيتم إتاحته قريباً.</p>
      </div>
    );
  }

  const totalSessions = sessions.length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="text-slate-600 text-[13px] font-medium order-2 sm:order-1 text-right">
          {displaySections.length} من الأقسام • {totalSessions} من المحاضرات • إجمالي المدة {trackDuration || "غير محدد"}
        </div>
        <button 
          onClick={toggleAll} 
          className="text-[#0b2646] font-bold text-[13px] hover:text-[#FBBC04] transition-colors order-1 sm:order-2 text-right sm:text-left"
        >
          {isAllOpen ? "طي جميع الأقسام" : "توسيع جميع الأقسام"}
        </button>
      </div>

      {/* Accordion List */}
      <div className="border border-slate-200 bg-white">
        {displaySections.map((section) => {
          const sectionSessions = hasSections 
            ? sessions.filter(s => s.section_id === section.id).sort((a, b) => a.order_index - b.order_index)
            : sessions.sort((a, b) => a.order_index - b.order_index);
          
          const totalMinutes = sectionSessions.reduce((acc, curr) => acc + (curr.duration_min || 0), 0);
          const isOpen = openSections.includes(section.id);

          return (
            <div key={section.id} className="border-b border-slate-200 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors focus:outline-none gap-2 sm:gap-4 text-right"
              >
                <div className="flex items-center gap-3 order-1">
                  <span className="font-bold text-slate-800 text-[14px]" dir="auto">{section.title_ar}</span>
                  <span className={`transform transition-transform duration-200 text-slate-500 shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </span>
                </div>
                
                <div className="text-[13px] text-slate-500 font-medium order-2">
                  {sectionSessions.length} من المحاضرات • {formatDurationFull(totalMinutes)}
                </div>
              </button>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100 border-t border-slate-200' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white flex flex-col">
                  {sectionSessions.length > 0 ? (
                    sectionSessions.map((session, sIndex) => (
                      <div key={session.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group border-b border-slate-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400 group-hover:text-[#0b2646] transition-colors shrink-0">
                            {session.is_preview ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                            )}
                          </span>
                          <span className="font-medium text-slate-700 text-sm sm:text-[14.5px] leading-relaxed" dir="auto">
                            {session.title_ar}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3 shrink-0">
                          {session.is_preview && (
                            <span className="text-[11px] font-bold text-white bg-[#6b21a8] px-2 py-0.5 rounded-full hidden sm:block">
                              معاينة
                            </span>
                          )}
                          <span className="text-[13px] text-slate-500 font-medium text-left" dir="ltr">
                            {session.duration_min > 0 ? `${session.duration_min}:00` : "0:00"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-sm text-slate-400 text-center font-medium">لا توجد محاضرات.</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
