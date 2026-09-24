"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EnrollmentActions({ enrollmentId, locale }) {
  const router = useRouter();
  const [loading, setLoading] = useState(null); // 'approve' | 'reject'
  const [note, setNote] = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);

  const updateStatus = async (status) => {
    setLoading(status);
    try {
      const updateData = {
        status,
        notes: note.trim() || null,
      };
      if (status === "approved") {
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("enrollments")
        .update(updateData)
        .eq("id", enrollmentId);

      if (error) throw error;

      toast.success(status === "approved" ? "✅ تم قبول التسجيل" : "❌ تم رفض التسجيل");
      router.refresh();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {showNoteBox && (
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="ملاحظة (اختياري)"
          className="border border-slate-300 rounded-sm px-3 py-2 text-sm w-48 focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646]"
          dir="rtl"
        />
      )}
      <button
        onClick={() => setShowNoteBox(!showNoteBox)}
        className="px-3 py-2 rounded-sm text-slate-400 hover:text-[#0b2646] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
        title="إضافة ملاحظة"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button
        onClick={() => updateStatus("approved")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-[#0b2646] text-white text-sm font-bold hover:bg-[#FBBC04] hover:text-[#0b2646] transition-colors disabled:opacity-60"
      >
        {loading === "approved" ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
        قبول
      </button>
      <button
        onClick={() => updateStatus("rejected")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-4 py-2 rounded-sm bg-white border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-colors disabled:opacity-60"
      >
        {loading === "rejected" ? (
          <span className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>
          </svg>
        )}
        رفض
      </button>
    </div>
  );
}