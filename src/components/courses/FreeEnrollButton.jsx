"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { enrollInFreeTrack } from "@/app/actions/enrollmentActions";
import { toast } from "react-toastify";

export default function FreeEnrollButton({ trackId, locale }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEnroll = () => {
    startTransition(async () => {
      const result = await enrollInFreeTrack(trackId, locale);

      if (result.success) {
        toast.success("تم الاشتراك بنجاح! يمكنك الآن بدء التعلم 🎉");
        router.push(`/${locale}/journey`);
      } else {
        toast.error(result.error || "حدث خطأ أثناء الاشتراك");
      }
    });
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={isPending}
      className="w-full bg-emerald-600 text-white text-center py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
    >
      {isPending ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      )}
      اشترك مجاناً وابدأ التعلم
    </button>
  );
}
