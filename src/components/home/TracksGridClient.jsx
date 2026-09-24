"use client";

import { useState } from "react";
import TrackCard from "@/components/courses/TrackCard";

const categories = [
  "محاسبة",
  "تحليل مالى",
  "تسويق",
  "المراجعة",
  "Business information systems (bis)",
  "Hr"
];

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
          ? "bg-[#0b2646] text-white border-[#0b2646]"
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
          <TrackCard key={track.id} track={track} locale={locale} />
        ))}
      </div>
    </div>
  );
}
