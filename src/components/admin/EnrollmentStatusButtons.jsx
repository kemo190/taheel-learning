"use client";

import { useState } from "react";
import { updateEnrollmentStatus } from "@/app/actions/adminEnrollmentActions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EnrollmentStatusButtons({ enrollmentId, currentStatus }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus) => {
    // Optional: Ask for notes if rejecting
    let notes = "";
    if (newStatus === "rejected") {
      notes = window.prompt("سبب الرفض (اختياري):");
      if (notes === null) return; // User cancelled
    }

    if (!window.confirm(`هل أنت متأكد من تغيير الحالة إلى ${newStatus === 'approved' ? 'مقبول' : 'مرفوض'}؟`)) {
      return;
    }

    setLoading(true);
    const result = await updateEnrollmentStatus(enrollmentId, newStatus, notes);
    
    if (result.success) {
      toast.success("تم التحديث بنجاح!");
      router.refresh(); // Refresh the page to show new status
    } else {
      toast.error(`خطأ: ${result.error}`);
    }
    setLoading(false);
  };

  if (currentStatus === "approved") {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
        مقبول
      </span>
    );
  }

  if (currentStatus === "rejected") {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
        مرفوض
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleStatusChange("approved")}
        disabled={loading}
        className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
      >
        موافقة
      </button>
      <button
        onClick={() => handleStatusChange("rejected")}
        disabled={loading}
        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
      >
        رفض
      </button>
    </div>
  );
}
