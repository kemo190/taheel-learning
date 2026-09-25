"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "لوحة التحكم",
    href: "dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: "المحتوى التعليمي",
    href: "tracks",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    label: "المدربون",
    href: "instructors",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "طلبات التسجيل",
    href: "enrollments",
    badge: true,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "المستخدمين",
    href: "students",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    label: "الشهادات",
    href: "certificates",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
  },
];

export default function AdminSidebar({ locale, adminName }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
    router.refresh();
  };

  const isActive = (href) => pathname.includes(`/admin/${href}`);

  return (
    <aside
      className={`${collapsed ? "w-[72px]" : "w-[260px]"} h-screen sticky top-0 flex flex-col transition-all duration-300 shrink-0 bg-transparent border-l border-slate-200/60 z-40`}
    >
      {/* Logo Area */}
      <div className={`flex items-center h-20 ${collapsed ? "justify-center px-2" : "px-6"} border-b border-slate-200/50 shrink-0`}>
        {!collapsed && (
          <Link href={`/${locale}`} className="flex-1 flex justify-start items-center h-full">
            <Image
              src="/images/logo.png"
              alt="تأهيل"
              width={160}
              height={56}
              className="object-contain max-h-12 w-auto"
              priority
            />
          </Link>
        )}
        {collapsed && (
          <Link href={`/${locale}`} className="flex justify-center items-center h-full">
            <Image
              src="/images/logo.png"
              alt="تأهيل"
              width={40}
              height={40}
              className="object-contain max-h-8 w-auto"
              priority
            />
          </Link>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-all flex items-center justify-center shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-4 w-9 h-9 shrink-0 text-slate-400 hover:text-[#0b2646] hover:bg-slate-100 rounded transition-all flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`/${locale}/admin/${item.href}`}
              title={collapsed ? item.label : undefined}
              className={`flex items-center ${collapsed ? "justify-center mx-2 px-0 py-3" : "px-6 py-3"} transition-all duration-200 group relative
                ${active
                  ? "bg-white/60 text-[#0b2646] border-r-4 border-[#FBBC04]"
                  : "text-slate-500 hover:bg-white/40 hover:text-[#0b2646] border-r-4 border-transparent"
                }`}
            >
              <span className={`shrink-0 ${active ? "text-[#0b2646]" : "text-slate-400 group-hover:text-[#0b2646]"}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="text-sm font-bold flex-1 mr-4">{item.label}</span>}
              
              {collapsed && (
                <span className="absolute right-full mr-3 bg-[#0b2646] text-white text-xs font-bold px-3 py-2 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area: Admin Info + Actions */}
      <div className="border-t border-slate-200/50 shrink-0 bg-transparent">
        {/* Admin Info */}
        {!collapsed && (
          <div className="px-6 py-4 border-b border-slate-200/40">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">المسؤول</p>
            <p className="text-[#0b2646] font-extrabold text-sm truncate">{adminName || "مدير النظام"}</p>
          </div>
        )}

        {/* Bottom Actions */}
        <Link
          href={`/${locale}`}
          className={`flex items-center ${collapsed ? "justify-center mx-2 px-0 py-4" : "px-6 py-3.5"} text-slate-500 hover:bg-white/40 hover:text-[#0b2646] transition-all group border-r-4 border-transparent`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-[#0b2646]">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {!collapsed && <span className="text-sm font-bold mr-4">الموقع الرئيسي</span>}
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${collapsed ? "justify-center mx-2 px-0 py-4" : "px-6 py-3.5"} text-slate-500 hover:bg-white/40 hover:text-red-600 transition-all group border-r-4 border-transparent`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-red-600">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          {!collapsed && <span className="text-sm font-bold mr-4">تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}