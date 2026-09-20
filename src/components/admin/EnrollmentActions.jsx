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
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-40 focus:outline-none focus:border-[#0b2646]"
          dir="rtl"
        />
      )}
      <button
        onClick={() => setShowNoteBox(!showNoteBox)}
        className="px-3 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors text-sm"
        title="إضافة ملاحظة"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
      <button
        onClick={() => updateStatus("approved")}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
      >
        {loading === "approved" ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {loading === "rejected" ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
