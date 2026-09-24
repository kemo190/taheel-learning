"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function IssueCertificateForm({ locale, students, tracks }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    track_id: "",
  });

  const generateCertCode = () => {
    return "TAHEEL-" + Math.random().toString(36).substring(2, 8).toUpperCase() + "-" + new Date().getFullYear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.student_id || !formData.track_id) {
      toast.error("يرجى اختيار الطالب والمسار.");
      return;
    }

    setLoading(true);
    try {
      const code = generateCertCode();
      const { error } = await supabase.from("certificates").insert([
        {
          student_id: formData.student_id,
          track_id: formData.track_id,
          certificate_code: code,
        },
      ]);

      if (error) {
        if (error.code === '23505') {
            throw new Error("تم إصدار شهادة لهذا الطالب في هذا المسار مسبقاً.");
        }
        throw error;
      }

      toast.success("تم إصدار الشهادة بنجاح! الرمز: " + code);
      setFormData({ student_id: "", track_id: "" });
      router.refresh();
    } catch (err) {
      toast.error("حدث خطأ: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">الطالب</label>
        <select
          value={formData.student_id}
          onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
          className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50"
        >
          <option value="">-- اختر الطالب --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.full_name} ({s.email})
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 w-full">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">المسار التدريبي</label>
        <select
          value={formData.track_id}
          onChange={(e) => setFormData({ ...formData, track_id: e.target.value })}
          className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50"
        >
          <option value="">-- اختر المسار --</option>
          {tracks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title_ar}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0b2646] text-white px-8 py-3 rounded-sm text-sm font-bold hover:bg-[#FBBC04] hover:text-[#0b2646] transition-colors disabled:opacity-50"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        )}
        إصدار الشهادة
      </button>
    </form>
  );
}