"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const LogoutIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default function AuthNav({
  dict,
  locale,
  initialUser = null,
  initialProfile = null,
}) {
  const [user, setUser] = useState(initialUser);
  const [profile, setProfile] = useState(initialProfile);
  // If we have initial data from the server, or we are on the server, loading is false!
  // Wait, if it's the client and we don't have initial data, we still shouldn't blink the skeleton if it's SSR.
  // Actually, we ALWAYS start with loading: false because the server already figured out if they are logged in!
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = (currentUser) => {
      if (currentUser && typeof window !== "undefined") {
        const isAuthPath =
          pathname.includes("/login") || pathname.includes("/register");
        const isBaseRoute =
          pathname === "/" || pathname === "/ar" || pathname === "/en";
        if (isAuthPath || isBaseRoute) {
          router.replace(`/${locale}`);
          router.refresh();
        }
      }
    };

    const fetchProfile = async (currentUser) => {
      if (!currentUser) {
        setProfile(null);
        return;
      }
      const { data: profileData } = await supabase
        .from("profiles")
        .select("avatar_url, full_name, certificate_name")
        .eq("id", currentUser.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    };

    // Check active sessions and sets the user
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      // Immediately stop loading as soon as we know auth state!
      setLoading(false);

      handleAuthRedirect(currentUser);
      // Fetch profile in the background
      fetchProfile(currentUser);
    };
    getUser();

    // Listen for changes on auth state (login, logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      handleAuthRedirect(nextUser);
      fetchProfile(nextUser);
    });

    return () => subscription.unsubscribe();
  }, [pathname, locale, router]);

  // Listen for custom profile update events (e.g. from ProfileHeader)
  useEffect(() => {
    const handleProfileUpdate = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("avatar_url, full_name, certificate_name")
          .eq("id", session.user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
    router.replace(`/${locale}`);
    router.refresh();
  };

  // Determine display avatar & name with fallbacks
  const displayName =
    profile?.certificate_name ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0];

  const defaultAvatar = displayName
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0b2646&color=fff&size=150`
    : null;
  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url || defaultAvatar;

  // While checking session initially, render a small placeholder to avoid UI jump
  if (loading) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-3 w-[150px] sm:w-[180px] md:w-[240px] justify-end">
        <div className="animate-pulse bg-gray-200 h-8 md:h-10 w-full rounded md:rounded-md"></div>
      </div>
    );
  }

  // If user is logged in
  if (user) {
    return (
      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href={`/${locale}/profile`}
          className="flex items-center gap-2 sm:gap-3 group cursor-pointer transition-all"
        >

          <span className="text-[16px] font-medium text-slate-600 group-hover:text-[#0b2646] transition-colors hidden sm:block">
            {dict?.navbar?.userMenu?.journey || "حسابي"}
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-transparent border border-slate-300 hover:border-[#0b2646] text-[#0b2646] hover:bg-slate-50 px-6 py-2.5 flex items-center justify-center rounded-full text-[15px] font-bold transition-all whitespace-nowrap"
        >
          {dict?.navbar?.userMenu?.logout || "تسجيل الخروج"}
        </button>

      </div>
    );
  }

  // If user is NOT logged in, show Login/Register buttons
  return (
    <div className="hidden sm:flex items-center gap-3 sm:gap-4">
      <Link
        href={`/${locale}/login`}
        className="text-slate-600 hover:text-[#0b2646] text-[15px] font-bold transition-colors"
      >
        {dict.navbar.login}
      </Link>
      <Link
        href={`/${locale}/register`}
        className="bg-transparent border border-slate-300 hover:border-[#0b2646] text-[#0b2646] hover:bg-slate-50 w-[148px] h-[58px] flex items-center justify-center rounded-full text-[16px] font-bold transition-all whitespace-nowrap"
      >
        إنشاء حساب
      </Link>
    </div>
  );
}
