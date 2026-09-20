"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { markSessionComplete, unmarkSessionComplete } from "@/app/actions/learningActions";
import { toast } from "react-toastify";

export default function MarkCompleteButton({ sessionId, trackId, locale, isCompleted }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      let result;
      if (isCompleted) {
        result = await unmarkSessionComplete(sessionId, trackId, locale);
      } else {
        result = await markSessionComplete(sessionId, trackId, locale);
      }

      if (result.success) {
        toast.success(isCompleted ? "تم الإلغاء" : "تم الإنجاز بنجاح!");
        router.refresh(); // To refresh the sidebar checkmarks
      } else {
        toast.error(result.error || "حدث خطأ ما");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-6 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
        isCompleted
          ? "bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-100"
          : "bg-[#0b2646] text-white hover:bg-[#081b33]"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isPending ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : isCompleted ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
      )}
      {isCompleted ? "مكتمل" : "تحديد كمكتمل"}
    </button>
  );
}
