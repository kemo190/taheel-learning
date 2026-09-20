"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

export default function EditTrackForm({ locale, programs, initialData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_ar: initialData.title_ar || "",
    title_en: initialData.title_en || "",
    description_ar: initialData.description_ar || "",
    description_en: initialData.description_en || "",
    program_id: initialData.program_id || "",
    price: initialData.price || "",
    original_price: initialData.original_price || "",
    duration_weeks: initialData.duration_weeks || "",
    level: initialData.level || "beginner",
    delivery_mode: initialData.delivery_mode || "recorded",
    is_active: initialData.is_active ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title_ar.trim()) return toast.error("اسم المسار بالعربي مطلوب");

    setLoading(true);
    try {
      const { error } = await supabase
        .from("tracks")
        .update({
          title_ar: form.title_ar.trim(),
          title_en: form.title_en.trim() || null,
          description_ar: form.description_ar.trim() || null,
          description_en: form.description_en.trim() || null,
          program_id: form.program_id || null,
          price: parseFloat(form.price) || 0,
          original_price: form.original_price ? parseFloat(form.original_price) : null,
          duration_weeks: parseInt(form.duration_weeks) || null,
          level: form.level,
          delivery_mode: form.delivery_mode,
          is_active: form.is_active,
        })
        .eq("id", initialData.id);

      if (error) throw error;
      toast.success("تم تعديل المسار بنجاح ✅");
      router.push(`/${locale}/admin/tracks`);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Arabic Title */}
      <div>
        <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
          اسم المسار (عربي) <span className="text-red-500">*</span>
        </label>
        <input
          name="title_ar"
          value={form.title_ar}
          onChange={handleChange}
          placeholder="مثال: مسار المحاسبة المالية"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all"
          dir="rtl"
          required
        />
      </div>

      {/* English Title */}
      <div>
        <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
          اسم المسار (إنجليزي)
        </label>
        <input
          name="title_en"
          value={form.title_en}
          onChange={handleChange}
          placeholder="e.g. Financial Accounting Track"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all"
          dir="ltr"
        />
      </div>

      {/* Arabic Description */}
      <div>
        <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
          وصف المسار (عربي)
        </label>
        <textarea
          name="description_ar"
          value={form.description_ar}
          onChange={handleChange}
          placeholder="اكتب وصفاً شاملاً للمسار..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all resize-none"
          dir="rtl"
        />
      </div>

      {/* Program + Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">البرنامج</label>
          <select
            name="program_id"
            value={form.program_id}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all appearance-none"
          >
            <option value="">— بدون برنامج —</option>
            {programs?.map((p) => (
              <option key={p.id} value={p.id}>{p.title_ar}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">المستوى</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all appearance-none"
          >
            <option value="beginner">مبتدئ</option>
            <option value="intermediate">متوسط</option>
            <option value="advanced">متقدم</option>
          </select>
        </div>
      </div>

      {/* Price + Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            السعر الحالي (ج.م) — 0 للمجاني
          </label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="0"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            السعر القديم (ج.م) — اختياري
          </label>
          <input
            name="original_price"
            type="number"
            min="0"
            value={form.original_price}
            onChange={handleChange}
            placeholder="اتركه فارغاً إذا لم يكن هناك خصم"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
            المدة (أسابيع)
          </label>
          <input
            name="duration_weeks"
            type="number"
            min="1"
            value={form.duration_weeks}
            onChange={handleChange}
            placeholder="مثال: 8"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">نوع الكورس (Delivery Mode)</label>
          <select
            name="delivery_mode"
            value={form.delivery_mode}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-white transition-all appearance-none"
          >
            <option value="recorded">مسجل تفاعلي</option>
            <option value="live">بث مباشر</option>
            <option value="hybrid">مدمج (Hybrid)</option>
          </select>
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="w-5 h-5 rounded text-[#0b2646] cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-[#0b2646] cursor-pointer">
          المسار نشط ومتاح للطلاب
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#0b2646] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#061528] transition-colors disabled:opacity-60 shadow-md"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          {loading ? "جارٍ التحديث..." : "حفظ التعديلات"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
