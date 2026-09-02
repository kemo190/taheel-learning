"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const LogoutIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

export default function AuthNav({ dict, locale, initialUser = null, initialProfile = null }) {
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
      if (currentUser && typeof window !== 'undefined') {
        const isAuthPath = pathname.includes('/login') || pathname.includes('/register');
        const isBaseRoute = pathname === '/' || pathname === '/ar' || pathname === '/en';
        if (isAuthPath || isBaseRoute) {
          router.replace(`/${locale}/home`);
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
        .from('profiles')
        .select('avatar_url, full_name, certificate_name')
        .eq('id', currentUser.id)
        .single();
        
      if (profileData) {
        setProfile(profileData);
      }
    };

    // Check active sessions and sets the user
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      handleAuthRedirect(nextUser);
      fetchProfile(nextUser);
    });

    return () => subscription.unsubscribe();
  }, [pathname, locale]);

  // Listen for custom profile update events (e.g. from ProfileHeader)
  useEffect(() => {
    const handleProfileUpdate = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('avatar_url, full_name, certificate_name')
          .eq('id', session.user.id)
          .single();
        if (profileData) {
          setProfile(profileData);
        }
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await supabase.auth.signOut();
    router.replace(`/${locale}`);
    router.refresh();
  };

  // Determine display avatar & name with fallbacks
  const displayName = profile?.certificate_name 
    || profile?.full_name 
    || user?.user_metadata?.full_name 
    || user?.email?.split('@')[0];

  const defaultAvatar = displayName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0b2646&color=fff&size=150` : null;
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || defaultAvatar;

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
        {/* My Learning Journey */}
        <Link href={`/${locale}/journey`} className="hidden lg:block text-[#5c6b81] hover:text-[#0b2646] text-[15px] font-medium transition-colors">
          {dict.navbar.userMenu.journey}
        </Link>

        {/* User Profile Avatar */}
        <div className="relative group pt-1">
          {/* Mobile Backdrop to close dropdown */}
          {isDropdownOpen && (
            <div 
              className="fixed inset-0 z-40 lg:hidden" 
              onClick={() => setIsDropdownOpen(false)}
            />
          )}

          <button 
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center justify-center w-8 h-8 sm:w-[38px] sm:h-[38px] ${avatarUrl ? 'bg-gray-100' : 'bg-[#0b2646] text-white'} rounded-full transition-colors shadow-sm cursor-pointer overflow-hidden border border-gray-200 relative z-50`}
          >
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </button>

          {/* Advanced Dropdown Menu (Hover on Desktop, Click on Mobile) */}
          <div className={`absolute top-full rtl:left-0 ltr:right-0 mt-3 w-[260px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-200 z-50 overflow-hidden border border-gray-100 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:group-focus-within:opacity-100 lg:group-focus-within:visible'}`}>
            {/* Header linked to Profile */}
            <Link href={`/${locale}/profile`} onClick={() => setIsDropdownOpen(false)} className="p-4 border-b border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className={`w-10 h-10 shrink-0 ${avatarUrl ? 'bg-gray-100' : 'bg-[#0b2646] text-white'} rounded-full flex items-center justify-center overflow-hidden border border-gray-200`}>
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0 rtl:text-right ltr:text-left">
                <p className="text-[15px] font-bold text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-[13px] text-gray-500 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </Link>

            {/* Menu Links */}
            <div className="py-2">
              <Link href={`/${locale}/journey`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#0b2646] hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                {dict.navbar.userMenu.journey}
              </Link>

              <Link href={`/${locale}/journey?tab=favorites`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#0b2646] hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
                {dict.navbar.userMenu.wishlist}
              </Link>

              <Link href={`/${locale}/journey?tab=notes`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#0b2646] hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                {dict.navbar.userMenu.notes}
              </Link>

              <Link href={`/${locale}/journey?tab=certificates`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#0b2646] hover:bg-blue-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                  <rect x="9" y="9" width="6" height="6"></rect>
                  <line x1="9" y1="1" x2="9" y2="4"></line>
                  <line x1="15" y1="1" x2="15" y2="4"></line>
                  <line x1="9" y1="20" x2="9" y2="23"></line>
                  <line x1="15" y1="20" x2="15" y2="23"></line>
                </svg>
                {dict.navbar.userMenu.certificates}
              </Link>

              <Link href={`/${locale}/expert`} onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors">
                {dict.navbar.userMenu.expert}
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#0b2646] hover:bg-blue-50 transition-colors rtl:text-right ltr:text-left mt-1 border-t border-gray-50"
              >
                <LogoutIcon className="w-5 h-5 text-[#0b2646]" />
                {dict.navbar.userMenu.logout}
              </button>
            </div>
          </div>
        </div>

        {/* Heart Icon */}
        <Link href={`/${locale}/wishlist`} className="relative p-1 text-[#8fa7e6] hover:text-[#0b2646] transition-colors flex items-center justify-center" aria-label="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
          </svg>
        </Link>
      </div>
    );
  }

  // If user is NOT logged in, show Login/Register buttons
  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <Link href={`/${locale}/login`} className="bg-transparent border border-[#0b2646] text-[#0b2646] hover:bg-[#f0f4ff] px-1 md:px-2 py-1 md:py-2 min-w-[75px] sm:min-w-[90px] md:min-w-[120px] flex justify-center items-center rounded md:rounded-md text-[11px] sm:text-sm md:text-[15px] font-medium transition-colors">
        {dict.navbar.login}
      </Link>
      <Link href={`/${locale}/register`} className="bg-[#0b2646] border border-transparent hover:bg-[#061528] text-white px-1 md:px-2 py-1 md:py-2 min-w-[75px] sm:min-w-[90px] md:min-w-[120px] flex justify-center items-center rounded md:rounded-md text-[11px] sm:text-sm md:text-[15px] font-medium transition-colors shadow-sm whitespace-nowrap">
        {dict.navbar.register}
      </Link>
    </div>
  );
}
