"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

export default function NewTrackForm({ locale, programs, instructors }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    program_id: "",
    price: "",
    original_price: "",
    duration_weeks: "",
    level: "beginner",
    delivery_mode: "recorded",
    is_active: true,
    type: "course",
    image_url: "",
    instructor_id: "",
    promo_video_url: "",
    what_you_will_learn: [""],
    target_audience: [""],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleArrayChange = (index, field, value) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index, field) => {
    setForm((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title_ar.trim()) return toast.error("اسم المحتوى مطلوب");

    setLoading(true);
    try {
      const { data, error } = await supabase.from("tracks").insert({
        title_ar: form.title_ar.trim(),
        title_en: form.title_en.trim() || "",
        description_ar: form.description_ar.trim() || "",
        description_en: form.description_en.trim() || "",
        program_id: form.program_id || null,
        price: parseFloat(form.price) || 0,
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        duration_weeks: parseInt(form.duration_weeks) || null,
        level: form.level,
        delivery_mode: form.delivery_mode,
        is_active: form.is_active,
        type: form.type,
        image_url: form.image_url.trim() || null,
        promo_video_url: form.promo_video_url.trim() || null,
        what_you_will_learn: form.what_you_will_learn.filter(item => item.trim() !== ""),
        target_audience: form.target_audience.filter(item => item.trim() !== ""),
      }).select();

      if (error) throw error;
      
      const newTrackId = data?.[0]?.id;
      
      // Link instructor if selected
      if (newTrackId && form.instructor_id) {
        const { error: instructorError } = await supabase
          .from("track_instructors")
          .insert({
            track_id: newTrackId,
            instructor_id: form.instructor_id
          });
          
        if (instructorError) {
          console.error("Error linking instructor:", instructorError);
          // We don't throw to not interrupt the track creation flow, but it's good to log
        }
      }

      toast.success("تم إضافة المحتوى بنجاح ✅");
      router.push(`/${locale}/admin/tracks`);
      router.refresh();
    } catch (err) {
      toast.error(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#0b2646] focus:ring-1 focus:ring-[#0b2646] bg-slate-50 transition-all";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* Arabic Title */}
      <div>
        <label className={labelClass}>
          اسم المحتوى <span className="text-red-500">*</span>
        </label>
        <input
          name="title_ar"
          value={form.title_ar}
          onChange={handleChange}
          placeholder="مثال: دورة المحاسبة المالية"
          className={inputClass}
          dir="rtl"
          required
        />
      </div>

      {/* Content Type */}
      <div>
        <label className={labelClass}>
          نوع المحتوى <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className={`${inputClass} appearance-none`}
        >
          <option value="course">دورة (Course - محتوى مركز قصير)</option>
          <option value="track">مسار (Track - محتوى طويل مقسم لأقسام)</option>
        </select>
      </div>

      {/* Instructor Selection */}
      <div>
        <label className={labelClass}>
          المدرب المسؤول
        </label>
        <select
          name="instructor_id"
          value={form.instructor_id}
          onChange={handleChange}
          className={`${inputClass} appearance-none`}
        >
          <option value="">بدون مدرب (اختياري)</option>
          {instructors?.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
      </div>

      {/* English Title (Hidden) */}

      {/* Image and Video URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            رابط صورة الغلاف
          </label>
          <input
            name="image_url"
            value={form.image_url}
            onChange={handleChange}
            placeholder="مثال: https://images.unsplash.com/..."
            className={inputClass}
            dir="ltr"
          />
        </div>
        <div>
          <label className={labelClass}>
            رابط الفيديو التعريفي (Promo Video) - اختياري
          </label>
          <input
            name="promo_video_url"
            value={form.promo_video_url}
            onChange={handleChange}
            placeholder="مثال: https://www.youtube.com/watch?v=..."
            className={inputClass}
            dir="ltr"
          />
        </div>
      </div>

      {/* Arabic Description */}
      <div>
        <label className={labelClass}>
          وصف المحتوى
        </label>
        <textarea
          name="description_ar"
          value={form.description_ar}
          onChange={handleChange}
          placeholder="اكتب وصفاً شاملاً للمحتوى..."
          rows={4}
          className={`${inputClass} resize-none`}
          dir="rtl"
        />
      </div>

      {/* What You Will Learn */}
      <div>
        <label className={labelClass}>
          ماذا ستتعلم في هذا المحتوى؟
        </label>
        <div className="space-y-3">
          {form.what_you_will_learn.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => handleArrayChange(index, 'what_you_will_learn', e.target.value)}
                placeholder="مثال: بناء تطبيقات ويب متكاملة..."
                className={inputClass}
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'what_you_will_learn')}
                className="px-4 py-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-sm transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('what_you_will_learn')}
            className="text-sm text-[#0b2646] font-bold hover:text-[#FBBC04] flex items-center gap-1 mt-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إضافة نقطة جديدة
          </button>
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <label className={labelClass}>
          لمن هذا المحتوى؟ (الجمهور المستهدف)
        </label>
        <div className="space-y-3">
          {form.target_audience.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                value={item}
                onChange={(e) => handleArrayChange(index, 'target_audience', e.target.value)}
                placeholder="مثال: المبتدئين الراغبين في اكتساب مهارات جديدة..."
                className={inputClass}
                dir="rtl"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'target_audience')}
                className="px-4 py-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-sm transition-colors shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('target_audience')}
            className="text-sm text-[#0b2646] font-bold hover:text-[#FBBC04] flex items-center gap-1 mt-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            إضافة نقطة جديدة
          </button>
        </div>
      </div>

      {/* Price + Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            السعر الحالي (ج.م) — 0 للمجاني
          </label>
          <input
            name="price"
            type="number"
            min="0"
            value={form.price}
            onChange={handleChange}
            placeholder="0"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>
            السعر القديم (ج.م) — اختياري
          </label>
          <input
            name="original_price"
            type="number"
            min="0"
            value={form.original_price}
            onChange={handleChange}
            placeholder="اتركه فارغاً إذا لم يكن هناك خصم"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            المدة (ساعات)
          </label>
          <input
            name="duration_weeks"
            type="number"
            min="1"
            value={form.duration_weeks}
            onChange={handleChange}
            placeholder="مثال: 12"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>طريقة تقديم المحتوى</label>
          <select
            name="delivery_mode"
            value={form.delivery_mode}
            onChange={handleChange}
            className={`${inputClass} appearance-none`}
          >
            <option value="recorded">مسجل تفاعلي</option>
            <option value="live">بث مباشر</option>
            <option value="hybrid">مدمج (Hybrid)</option>
          </select>
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3 p-5 bg-slate-50 border border-slate-200 rounded-sm">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          className="w-5 h-5 rounded-sm text-[#0b2646] cursor-pointer"
        />
        <label htmlFor="is_active" className="text-sm font-bold text-[#0b2646] cursor-pointer">
          المحتوى نشط ومتاح للطلاب للتسجيل
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-6 border-t border-slate-200">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#0b2646] text-white px-8 py-3 rounded-sm text-sm font-bold hover:bg-[#FBBC04] hover:text-[#0b2646] transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          {loading ? "جارٍ الحفظ..." : "حفظ المحتوى"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-sm text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-300"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}