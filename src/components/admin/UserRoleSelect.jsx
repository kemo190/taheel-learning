"use client";

import { useState } from "react";
import { updateUserRole } from "@/app/actions/adminUserActions";

export default function UserRoleSelect({ userId, initialRole }) {
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const newRole = e.target.value;
    
    if (newRole === "admin") {
      const confirmed = window.confirm("هل أنت متأكد من منح هذا المستخدم صلاحيات Admin كاملة؟ لا يمكن التراجع عن هذا الإجراء بسهولة وسيمنحه تحكماً كاملاً بالنظام.");
      if (!confirmed) {
        setRole(initialRole); // revert UI
        return;
      }
    }

    setLoading(true);
    setRole(newRole);
    
    try {
      const res = await updateUserRole(userId, newRole);
      if (!res.success) {
        alert(res.error || "حدث خطأ أثناء تغيير الصلاحية");
        setRole(initialRole);
      }
    } catch (err) {
      alert("حدث خطأ غير متوقع");
      setRole(initialRole);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={role}
      onChange={handleChange}
      disabled={loading}
      className={`text-sm rounded-sm border border-slate-200 px-2 py-1 outline-none focus:border-[#0b2646] ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      dir="ltr"
    >
      <option value="student">Student</option>
      <option value="instructor">Instructor</option>
      <option value="company">Company</option>
      <option value="admin">Admin</option>
    </select>
  );
}
