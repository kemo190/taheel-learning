"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export default function PromoVideoModal({ videoUrl, imageUrl, title }) {
  const [isOpen, setIsOpen] = useState(false);

  // Extract YouTube ID if it's a youtube link
  const getVideoId = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      return url.split("youtu.be/")[1]?.split("?")[0];
    }
    return null;
  };

  const videoId = getVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&fs=0` : null;
  // Use YouTube thumbnail if video exists, fallback to imageUrl, fallback to null
  const displayImage = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : imageUrl;

  if (!videoUrl) return null;

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="relative aspect-video bg-slate-900 group cursor-pointer flex items-center justify-center block overflow-hidden"
      >
        {displayImage ? (
          <Image src={displayImage} alt={title} fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" unoptimized />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b2646] to-[#1a3a60] opacity-90"></div>
        )}
        
        {/* Play Button Overlay */}
        <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#FBBC04] transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-white group-hover:text-[#0b2646] ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <div className="absolute bottom-4 left-0 right-0 text-center text-white font-bold text-sm drop-shadow-md">
          شاهد الفيديو التعريفي
        </div>
      </div>

      {isOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-[#0b2646]/95 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-black border border-[#FBBC04]/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-[#FBBC04] text-white hover:text-[#0b2646] flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            
            {/* Video Iframe */}
            <div className="relative aspect-video w-full">
              <iframe 
                src={embedUrl} 
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
