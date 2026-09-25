"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import ProfileForm from "./ProfileForm";
import AccountDetails from "./AccountDetails";
import JourneyCourseCard from "./JourneyCourseCard";
import TrackCard from "@/components/courses/TrackCard";
import CertificateCard from "./CertificateCard";
import EmptyState from "./EmptyState";

export default function AccountDashboardClient({
  locale,
  dict,
  user,
  profile,
  initialTab,
  inProgressCourses,
  completedCourses,
  favoriteTracks,
  certificates
}) {
  const isRtl = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || initialTab;
  const [localProfile, setLocalProfile] = useState(profile);

  const handleTabChange = (tabId) => {
    router.push(`/${locale}/profile?tab=${tabId}`, { scroll: false });
  };

  const tabs = [
    { id: "tracks", name: dict?.profile?.tabs?.tracks || "المسارات" },
    { id: "courses", name: dict?.profile?.tabs?.courses || "الدورات" },
    { id: "certificates", name: dict?.profile?.tabs?.certificates || "شهاداتي" },
    { id: "favorites", name: dict?.profile?.tabs?.favorites || "المفضلة" },
    { id: "personal", name: dict?.profile?.tabs?.personal || "بيانات الحساب" },
    { id: "account", name: dict?.profile?.tabs?.account || "إعدادات الأمان" },
  ];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "tracks":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* In Progress Tracks */}
            <div>
              <h3 className="text-xl font-bold text-[#0b2646] mb-6">المسارات الحالية ({inProgressCourses.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {inProgressCourses.length > 0 ? (
                  inProgressCourses.map(course => (
                    <JourneyCourseCard
                      key={course.id}
                      id={course.id}
                      dict={dict}
                      locale={locale}
                      title={course.title}
                      progress={course.progress}
                      imageSrc={course.imageSrc}
                      type={course.type}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState
                      imageSrc="/empty.png"
                      title=""
                      subtitle="لا توجد مسارات قيد التقدم"
                      description="تصفح مكتبتنا واشترك في المسارات لبدء التعلم."
                      locale={locale}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Completed Tracks */}
            {completedCourses.length > 0 && (
              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-[#0b2646] mb-6">المسارات المكتملة ({completedCourses.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {completedCourses.map(course => (
                    <JourneyCourseCard
                      key={course.id}
                      id={course.id}
                      dict={dict}
                      locale={locale}
                      title={course.title}
                      progress={course.progress}
                      imageSrc={course.imageSrc}
                      type={course.type}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "courses":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="col-span-full">
              <EmptyState
                imageSrc="/empty.png"
                title=""
                subtitle="لا توجد دورات مسجلة حالياً"
                description="لم تقم بالاشتراك في أي دورات منفصلة حتى الآن."
                locale={locale}
              />
            </div>
          </div>
        );
      
      case "certificates":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-[#0b2646] mb-6">شهاداتي ({certificates.length})</h3>
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {certificates.map((cert) => (
                  <CertificateCard
                    key={cert.id}
                    dict={dict}
                    title={cert.title}
                    completionDate={cert.completionDate}
                    imageSrc={cert.imageSrc}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                imageSrc="/empty.png"
                title=""
                subtitle="لا توجد شهادات بعد"
                description="أكمل مساراً للحصول على شهادتك الأولى."
                locale={locale}
              />
            )}
          </div>
        );

      case "favorites":
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            {favoriteTracks?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {favoriteTracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    locale={locale}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                imageSrc="/empty.png"
                title=""
                subtitle="لا توجد مسارات مفضلة بعد"
                description="استكشف مكتبتنا وأضف المسارات إلى مفضلتك."
                locale={locale}
              />
            )}
          </div>
        );

      case "personal":
        return (
          <div className="animate-in fade-in duration-300 w-full max-w-3xl">
            <ProfileForm
              initialData={localProfile}
              locale={locale}
              userId={user?.id}
              dict={dict}
              onProfileUpdate={(updatedData) => setLocalProfile(updatedData)}
            />
          </div>
        );

      case "account":
        return (
          <div className="animate-in fade-in duration-300 w-full max-w-3xl">
            <AccountDetails locale={locale} user={user} dict={dict} />
          </div>
        );

      default:
        return null;
    }
  };

  // --- Icons ---
  const getIcon = (id, isActive) => {
    const strokeClass = isActive ? "stroke-[#0b2646]" : "stroke-slate-500";
    switch (id) {
      case "tracks":
        return (
          <svg className={`w-[22px] h-[22px] ${strokeClass}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
          </svg>
        );
      case "courses":
        return (
          <svg className={`w-[22px] h-[22px] ${strokeClass}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
        );
      case "certificates":
        return (
          <svg className={`w-[22px] h-[22px] ${strokeClass}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6"></circle>
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"></path>
          </svg>
        );
      case "favorites":
        return (
          <svg className={`w-[22px] h-[22px] ${strokeClass}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        );
      case "personal":
        return (
          <svg className={`w-[22px] h-[22px] ${strokeClass}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="14" cy="7" r="4"></circle>
          </svg>
        );
      case "account":
        return (
          <svg className={`w-[22px] h-[22px] ${strokeClass}`} fill="none" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-transparent md:h-[calc(100vh-85px)] overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-8 lg:gap-12 md:h-full">

        {/* Sidebar Navigation */}
        <aside className="w-full md:w-[280px] shrink-0 md:h-full md:overflow-y-auto pt-8 md:pt-10 pb-6 md:pb-10 scrollbar-hide">
          <div>
            <h2 className="text-[#0b2646] font-extrabold text-2xl mb-6 px-4 pt-2">
              {dict?.navbar?.userMenu?.journey || "حسابي"}
            </h2>
            <nav className="flex flex-col gap-1.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 text-start w-full font-bold text-[15px] relative overflow-hidden group ${isActive
                        ? "text-[#0b2646] bg-[#f8fafc]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-[#0b2646]"
                      }`}
                  >
                    {/* Active Indicator (Yellow Line) */}
                    <div className={`absolute top-0 bottom-0 w-1.5 bg-[#FBBC04] transition-all duration-300 ${isRtl ? 'right-0' : 'left-0'} ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

                    {/* Icon */}
                    <span className="shrink-0 transition-transform duration-300 group-hover:scale-110">
                      {getIcon(tab.id, isActive)}
                    </span>

                    {/* Label */}
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 md:h-full md:overflow-y-auto pt-2 md:pt-10 pb-24 md:pb-10 scrollbar-hide">
          <div className="min-h-full">
            {/* Header of Content Area */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b2646] mb-8 flex items-center gap-3">
              {getIcon(activeTab, true)}
              {tabs.find(t => t.id === activeTab)?.name}
            </h1>

            {/* Render Tab */}
            {renderActiveTabContent()}
          </div>
        </main>

      </div>
    </div>
  );
}
