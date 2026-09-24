"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createInstructor } from "@/app/actions/adminInstructorActions";

export default function NewInstructorForm({ locale }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    bio: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("اسم المدرب مطلوب");

    setLoading(true);
    try {
      const res = await createInstructor({
        name: form.name.trim(),
        bio: form.bio.trim() || null,
      });

      if (!res.success) throw new Error(res.error);
      
      toast.success("تم إضافة المدرب بنجاح");
      router.push(`/${locale}/admin/instructors`);
    } catch (err) {
      toast.error(err.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
          اسم المدرب <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="مثال: د. أحمد محمد"
          className="w-full border border-slate-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-slate-50/50 transition-all"
          dir="rtl"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0b2646] mb-1.5">
          النبذة (Bio)
        </label>
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="اكتب نبذة مختصرة عن المدرب وخبراته..."
          rows={4}
          className="w-full border border-slate-200 rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0b2646]/20 focus:border-[#0b2646] bg-slate-50/50 transition-all resize-none"
          dir="rtl"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 rounded-sm text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-[#0b2646] text-white px-8 py-3 rounded-sm text-sm font-bold hover:bg-[#FBBC04] hover:text-[#0b2646] transition-colors disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          )}
          {loading ? "جارٍ الحفظ..." : "حفظ المدرب"}
        </button>
      </div>
    </form>
  );
}
