"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  "محاسبة",
  "تحليل مالى",
  "تسويق",
  "المراجعة",
  "Business information systems (bis)",
  "Hr"
];

const getExpressiveImage = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("تسويق") || t.includes("marketing") || t.includes("محتوى") || t.includes("قصصي")) {
    return "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop";
  }
  if (t.includes("بيانات") || t.includes("data") || t.includes("تحليل") || t.includes("قاعدة")) {
    return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop";
  }
  if (t.includes("ذكاء") || t.includes("ai") || t.includes("machine") || t.includes("آلة") || t.includes("أتمتة")) {
    return "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";
  }
  if (t.includes("إدارة") || t.includes("management") || t.includes("أعمال") || t.includes("مشاريع") || t.includes("قيادة")) {
    return "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop";
  }
  if (t.includes("محاسبة") || t.includes("مالية") || t.includes("مالى")) {
    return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop";
  }
  // Default expressive professional workspace
  return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop";
};

export default function TracksGridClient({ tracks, locale }) {
  const [activeCategory, setActiveCategory] = useState("محاسبة");

  // TODO: Replace with real filtering logic once categories are mapped in DB
  const filteredTracks = tracks; 

  const renderPill = (cat) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`px-5 py-2.5 md:px-8 md:py-3.5 rounded-full text-[13px] md:text-[15px] font-bold border transition-colors ${
        activeCategory === cat
          ? "bg-[#1d1f2e] text-white border-[#1d1f2e]"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      {cat}
    </button>
  );

  return (
    <div>
      {/* Pills */}
      <div className="flex flex-col items-center gap-2 md:gap-4 max-w-5xl mx-auto mb-8 md:mb-12">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {["محاسبة", "تحليل مالى", "تسويق", "المراجعة"].map(renderPill)}
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {["Hr", "Business information systems (bis)"].map(renderPill)}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 max-w-5xl mx-auto">
        {filteredTracks.map((track) => (
          <Link key={track.id} href={`/${locale}/tracks/${track.id}`} className="block h-full">
            <div className="bg-white rounded-lg sm:rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
              
              {/* Image Header */}
              <div className="relative aspect-square bg-slate-100 w-full overflow-hidden shrink-0 border-b border-slate-100">
                <img
                  src={getExpressiveImage(track.title_ar)}
                  alt={track.title_ar}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Content */}
              <div className="p-3 sm:p-6 flex flex-col flex-grow bg-white">
                <h3 className="text-[13px] sm:text-xl font-black text-[#0b2646] mb-4 sm:mb-6 text-center leading-snug" dir="rtl">
                  {track.title_ar}
                </h3>
                
                <div className="flex-grow"></div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 text-[10px] sm:text-sm text-slate-500 font-medium" dir="rtl">
                  
                  {/* Duration */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>ساعة و 40 دقيقة</span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-slate-600 font-bold hidden sm:inline">مدرب معتمد</span>
                    <span className="text-slate-600 font-bold sm:hidden">مدرب</span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${track.id}`} alt="Instructor" className="w-full h-full object-cover" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
