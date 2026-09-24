"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";

export default function EnrollmentForm({ locale, track, userId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && track.price > 0) {
      return toast.error("يرجى إرفاق صورة إيصال الدفع");
    }

    setLoading(true);
    try {
      let receiptUrl = null;

      // 1. Upload receipt if file exists
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}_${track.id}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("receipts")
          .upload(`${userId}/${fileName}`, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;
        receiptUrl = uploadData.path;
      }

      // 2. Create enrollment record
      const { error: insertError } = await supabase
        .from("enrollments")
        .insert({
          student_id: userId,
          track_id: track.id,
          status: track.price === 0 ? "approved" : "pending", // Auto-approve free tracks
          amount_paid: track.price,
          payment_receipt_url: receiptUrl
        });

      if (insertError) {
        // If unique constraint error (23505)
        if (insertError.code === '23505') {
          throw new Error("لقد قمت بإرسال طلب تسجيل مسبقاً لهذا المسار.");
        }
        throw insertError;
      }

      toast.success(
        track.price === 0 
          ? "تم التسجيل بنجاح! يمكنك بدء التعلم الآن 🎉"
          : "تم إرسال إيصال الدفع بنجاح. سيتم تفعيل حسابك فور مراجعته ✅"
      );
      
      // Redirect back to track page to see updated status
      router.push(`/${locale}/tracks/${track.id}`);
      router.refresh();

    } catch (err) {
      console.error(err);
      toast.error(err.message || "حدث خطأ أثناء رفع الإيصال، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Price Summary */}
      <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-800">قيمة الاشتراك المطلوبة</p>
          <p className="text-xs text-blue-600 mt-1">يجب إيداع هذا المبلغ في أحد الحسابات الموضحة</p>
        </div>
        <div className="text-2xl font-black text-[#0b2646]">
          {track.price === 0 ? "مجاني" : `${track.price} ج.م`}
        </div>
      </div>

      {track.price > 0 && (
        <>
          {/* Payment Instructions */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-900">طرق الدفع المتاحة:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Method 1 */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white flex gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <span className="text-green-600 font-bold text-xs">بنك</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">حساب بنكي (CIB)</p>
                  <p className="text-xs text-gray-500 font-mono mt-1" dir="ltr">1000 234 567 8901</p>
                  <p className="text-[10px] text-gray-400 mt-1">باسم: مؤسسة تأهيل</p>
                </div>
              </div>

              {/* Method 2 */}
              <div className="p-4 border border-gray-200 rounded-xl bg-white flex gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                  <span className="text-purple-600 font-bold text-xs">محفظة</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">فودافون كاش</p>
                  <p className="text-xs text-gray-500 font-mono mt-1" dir="ltr">010 1234 5678</p>
                  <p className="text-[10px] text-gray-400 mt-1">يرجى تحويل المبلغ كاملاً</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">إرفاق إيصال الدفع أو سكرين شوت التحويل <span className="text-red-500">*</span></label>
            <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-500 transition-colors bg-gray-50 flex flex-col items-center justify-center text-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-blue-600 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {file ? file.name : "اضغط هنا لاختيار ملف"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {file ? "تم اختيار الملف" : "JPG, PNG, PDF (أقل من 5MB)"}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          )}
          {track.price === 0 ? "تأكيد الاشتراك المجاني" : "إرسال وتأكيد الدفع"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-70"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
