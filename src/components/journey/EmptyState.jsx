"use client";
import React from "react";
import Image from "next/image";

export default function EmptyState({
  title,
  subtitle,
  description,
  imageSrc,
  locale,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full text-center">
      {/* Title */}
      {title && (
        <h2 className="text-2xl font-bold text-[#0b2646] mb-8">{title}</h2>
      )}

      {/* Illustration */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="Empty state illustration"
            fill
            className="object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </div>
        )}
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-bold text-[#0b2646] mb-2">{subtitle}</h3>

      <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
}
