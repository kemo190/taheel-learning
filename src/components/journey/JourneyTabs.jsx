"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function JourneyTabs({
  dict,
  locale,
  inProgressCount = 0,
  completedCount = 0,
  favoritesCount = 0,
  certificatesCount = 0,
}) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "in-progress";

  const tabs = [
    { id: "in-progress", label: dict?.journey?.overview?.inProgress || "قيد التقدم", count: inProgressCount },
    { id: "completed", label: dict?.journey?.overview?.completed || "المكتملة", count: completedCount },
    { id: "favorites", label: dict?.journey?.overview?.favorites || "المفضلة", count: favoritesCount },
    { id: "certificates", label: dict?.journey?.overview?.certificates || "الشهادات", count: certificatesCount },
  ];

  return (
    <div className="border-b border-gray-200 mb-8 flex overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <Link
            key={tab.id}
            href={`?tab=${tab.id}`}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm md:text-base transition-colors whitespace-nowrap ${
              isActive
                ? "border-[#0b2646] text-[#0b2646] font-bold"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {tab.label}
            <span
              className={`flex items-center justify-center text-xs w-6 h-6 rounded-full transition-colors ${
                isActive ? "bg-[#0b2646] text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
