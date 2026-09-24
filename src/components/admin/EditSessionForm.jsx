"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateSession } from "@/app/actions/adminSessionActions";

export default function EditSessionForm({ locale, tracks, session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_ar: session?.title_ar || "",
    track_id: session?.track_id || "",
    type: session?.type || "recorded",
    content_type: session?.content_type || "video",
    is_preview: session?.is_preview || false,
    duration_min: session?.duration_min || "",
    order_index: session?.order_index || "",
    video_url: session?.video_url || "",
    pdf_url: session?.pdf_url || "",
    text_content: session?.text_content || "",
    is_active: session?.is_active ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title_ar.trim()) return toast.error("عنوان الدرس مطلوب");
    if (!form.track_id) return toast.error("يجب اختيار المحتوى التابع");

    setLoading(true);
    try {
      const res = await updateSession(session.id, {
        title_ar: form.title_ar.trim(),
        track_id: form.track_id,
        type: form.type,
        content_type: form.content_type,
        is_preview: form.is_preview,
        duration_min: parseInt(form.duration_min) || 0,
        order_index: parseInt(form.order_index) || 0,
        video_url: form.video_url.trim() || null,
        pdf_url: form.pdf_url?.trim() || null,
        text_content: form.text_content?.trim() || null,
        is_active: form.is_active,
      });

      if (!res.success) throw new Error(res.error);

      toast.success("تم تعديل الدرس بنجاح ✅");
      router.push(`/${locale}/admin/sessions`);
    } catch (err) {
      toast.error(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذا الدرس نهائياً؟")) return;
    
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabaseClient");
      const { error } = await supabase.from("sessions").delete().eq("id", session.id);

      if (error) throw error;
      toast.success("تم حذف الدرس بنجاح 🗑️");
      router.push(`/${locale}/admin/sessions`);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء الحذف");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
          عنوان الدرس <span className="text-red-500">*</span>
        </label>
        <input
          name="title_ar"
          value={form.title_ar}
          onChange={handleChange}
          placeholder="مثال: أساسيات المحاسبة - الجزء الأول"
          className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all"
          dir="rtl"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            المحتوى التابع <span className="text-red-500">*</span>
          </label>
          <select
            name="track_id"
            value={form.track_id}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all appearance-none"
            required
          >
            <option value="">— اختر المحتوى —</option>
            {tracks?.map((t) => (
              <option key={t.id} value={t.id}>{t.title_ar}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">طريقة العرض</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all appearance-none"
          >
            <option value="recorded">مسجلة 📼</option>
            <option value="live">بث مباشر 🔴</option>
            <option value="hybrid">مدمج (Hybrid)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">نوع الدرس (Content Type)</label>
          <select
            name="content_type"
            value={form.content_type}
            onChange={handleChange}
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all appearance-none"
          >
            <option value="video">فيديو</option>
            <option value="pdf">ملف PDF</option>
            <option value="text">نص مقالي</option>
            <option value="quiz">اختبار (Quiz)</option>
            <option value="assignment">مهمة (Assignment)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            الترتيب (Order)
          </label>
          <input
            name="order_index"
            type="number"
            min="1"
            value={form.order_index}
            onChange={handleChange}
            placeholder="ترتيب ظهور الدرس (1, 2, 3...)"
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            مدة الدرس (بالدقائق)
          </label>
          <input
            name="duration_min"
            type="number"
            min="0"
            value={form.duration_min}
            onChange={handleChange}
            placeholder="مثال: 45"
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 p-5 bg-slate-50 border border-slate-200 rounded-sm mt-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_preview"
              name="is_preview"
              checked={form.is_preview}
              onChange={handleChange}
              className="w-5 h-5 rounded text-[#0b2646] cursor-pointer"
            />
            <label htmlFor="is_preview" className="text-sm font-medium text-[#0b2646] cursor-pointer">
              درس مجاني (Preview)
            </label>
          </div>
        </div>
      </div>

      {form.content_type === "video" && (
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            رابط الفيديو / رابط البث المباشر
          </label>
          <input
            name="video_url"
            type="url"
            value={form.video_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all"
            dir="ltr"
          />
        </div>
      )}

      {form.content_type === "pdf" && (
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            رابط ملف PDF
          </label>
          <input
            name="pdf_url"
            type="url"
            value={form.pdf_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all"
            dir="ltr"
          />
        </div>
      )}

      {form.content_type === "text" && (
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            المحتوى النصي
          </label>
          <textarea
            name="text_content"
            value={form.text_content}
            onChange={handleChange}
            placeholder="اكتب محتوى الدرس هنا..."
            rows={5}
            className="w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all resize-y"
            dir="rtl"
          />
        </div>
      )}

      <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-200 rounded-sm">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="w-5 h-5 rounded text-[#0b2646] cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-[#0b2646] cursor-pointer">
          الدرس نشط ومتاح للطلاب
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#0b2646] text-white px-8 py-3 rounded-sm text-sm font-bold hover:bg-[#FBBC04] hover:text-[#0b2646] transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-sm text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-300"
        >
          إلغاء
        </button>
        <div className="flex-1"></div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 rounded-sm text-sm font-bold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
          حذف الدرس
        </button>
      </div>
    </form>
  );
}
