"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { deleteInstructor } from "@/app/actions/adminInstructorActions";

export default function DeleteInstructorButton({ instructorId, instructorName }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await deleteInstructor(instructorId);
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      toast.success("تم حذف المدرب بنجاح");
      setShowModal(false);
    } catch (err) {
      toast.error("حدث خطأ أثناء محاولة الحذف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={loading}
        title="حذف المدرب"
        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors disabled:opacity-50"
      >
      {loading ? (
        <span className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin inline-block" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      )}
    </button>

      {/* Custom Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" dir="rtl">
          <div className="bg-white rounded-md shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <h3 className="text-xl font-extrabold text-[#0b2646] mb-2">حذف المدرب</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                هل أنت متأكد من رغبتك في حذف المدرب <span className="font-bold text-[#0b2646]">"{instructorName}"</span>؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
            <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-sm transition-colors disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-5 py-2.5 text-sm font-bold bg-red-600 text-white hover:bg-red-700 rounded-sm shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                ) : null}
                {loading ? "جاري الحذف..." : "تأكيد الحذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
