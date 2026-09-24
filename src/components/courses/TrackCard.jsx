"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

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
  return "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop";
};

export default function TrackCard({ track, locale }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkFavorite() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      setUser(currentUser);

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('student_id', currentUser.id)
        .eq('track_id', track.id)
        .single();

      if (data) setIsFavorited(true);
    }
    checkFavorite();
  }, [track.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = `/${locale}/login`;
      return;
    }

    if (isFavorited) {
      setIsFavorited(false);
      await supabase
        .from('favorites')
        .delete()
        .eq('student_id', user.id)
        .eq('track_id', track.id);
    } else {
      setIsFavorited(true);
      await supabase
        .from('favorites')
        .insert({ student_id: user.id, track_id: track.id });
    }
  };

  const discountPercentage = track.original_price > track.price 
    ? Math.round(((track.original_price - track.price) / track.original_price) * 100)
    : 0;

  return (
    <Link href={`/${locale}/tracks/${track.id}`} className="block h-full">
      <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
        
        {/* Image Header */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden shrink-0 border-b border-slate-100">
          <img
            src={track.image_url || getExpressiveImage(track.title_ar)}
            alt={track.title_ar}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          {/* Delivery Mode Badge */}
          <span className="flex h-fit w-fit gap-2 rounded-bl-2xl rounded-tr-2xl px-3 py-1.5 text-center text-xs font-bold text-[#FBBC04] bg-[#0b2646]/95 backdrop-blur-md shadow-sm absolute top-0 right-0 z-10 border-b border-l border-[#0b2646]">
            {track.delivery_mode === "live" ? "🔴 بث مباشر" : track.delivery_mode === "hybrid" ? "مدمج" : "مسجل تفاعلي"}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white items-center">
          <h3 className="text-[17px] sm:text-xl font-bold text-[#0b2646] mb-2.5 text-center leading-snug line-clamp-2" dir="rtl">
            {track.title_ar}
          </h3>
          
          {track.description_ar && (
            <p className="text-[13px] sm:text-sm text-gray-500 text-center line-clamp-3 mb-4 leading-relaxed" dir="rtl">
              {track.description_ar}
            </p>
          )}

          {/* Price Row */}
          <div className="flex items-center justify-center gap-2.5 mb-5 w-full" dir="rtl">
            {track.price === 0 ? (
              <div className="text-xl sm:text-2xl font-bold text-[#0b2646]">مجاناً</div>
            ) : (
              <>
                <div className="text-xl sm:text-2xl font-bold text-[#0b2646]">
                  {track.price} <span className="text-sm font-semibold text-[#0b2646]/80">ج.م</span>
                </div>
                {track.original_price > track.price && (
                  <>
                    <div className="text-xs sm:text-sm font-medium text-gray-400 line-through">
                      {track.original_price} ج.م
                    </div>
                    <div className="bg-[#FBBC04] text-[#0b2646] px-2.5 py-0.5 rounded text-[11px] sm:text-xs font-bold shadow-sm">
                      خصم {discountPercentage}%
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex-grow"></div>

          {/* Meta Row */}
          <div className="flex items-center justify-center gap-6 text-[13px] sm:text-sm text-[#0b2646]/70 font-medium w-full mb-6" dir="rtl">
            {track.duration_weeks > 0 && (
              <div className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#FBBC04]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{track.duration_weeks} ساعة</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-[#FBBC04]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                <line x1="7" y1="2" x2="7" y2="22"></line>
                <line x1="17" y1="2" x2="17" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="2" y1="7" x2="7" y2="7"></line>
                <line x1="2" y1="17" x2="7" y2="17"></line>
                <line x1="17" y1="17" x2="22" y2="17"></line>
                <line x1="17" y1="7" x2="22" y2="7"></line>
              </svg>
              <span>{track.type === 'track' ? 'مسار كامل' : 'دورة تدريبية'}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full" dir="rtl">
            <button 
              onClick={toggleFavorite}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 group/heart ${
                isFavorited 
                  ? 'border-[#FBBC04] bg-[#FBBC04]/10 text-[#FBBC04] hover:bg-[#FBBC04]/20' 
                  : 'border-[#E1E1E1] bg-transparent text-[#0b2646] hover:border-[#FBBC04] hover:bg-[#FBBC04]/10 hover:text-[#FBBC04]'
              }`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`w-5 h-5 transition-all duration-300 ${isFavorited ? 'fill-current' : 'fill-transparent group-hover/heart:fill-current'}`} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-transparent text-[#0b2646] border border-[#E1E1E1] h-12 rounded-2xl font-bold text-[15px] hover:bg-[#FBBC04] hover:border-[#FBBC04] hover:text-[#0b2646] transition-all duration-300">
              <span>اشترك الآن</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ltr:rotate-180 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 19-7-7 7-7"></path>
                <path d="M19 12H5"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
