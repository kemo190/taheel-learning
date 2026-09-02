'use client';
import React from 'react';

// Icons for the glass cards
const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-0-2.5V19.5z" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

export default function JourneyHeader({ dict, user, profile, locale, userStats }) {
  const isRtl = locale === 'ar';
  
  // Try to get certificate name, then first name
  const displayName = profile?.certificate_name?.split(' ')[0]
    || profile?.full_name?.split(' ')[0] 
    || user?.user_metadata?.full_name?.split(' ')[0] 
    || dict.profile.header.userFallback;

  return (
    <section 
      className="relative flex min-h-[358px] flex-col items-center justify-evenly gap-6 overflow-hidden rounded-3xl p-6 md:flex-row bg-[url('/my-learning-header.png')] bg-[length:100%_100%] bg-center bg-no-repeat mb-8 shadow-sm"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative flex shrink-0 flex-col gap-4 text-white max-md:items-center">
        <span className="flex w-fit items-center gap-3 rounded-3xl bg-white/15 px-4.5 py-1.5 font-bold px-4">
          <span className="bg-[#0b2646] w-3 h-3 rounded-full animate-pulse"></span>
          {dict.journey.header.learningPhase}
        </span>
        <h2 className="text-4xl font-bold flex items-center justify-center md:justify-start gap-2">
          {dict.journey.header.welcome} {displayName} <span className="animate-waving-hand origin-bottom-right inline-block">👋</span>
        </h2>
        <h4 className="hidden max-w-64 text-2xl md:block leading-snug">
          {dict.journey.header.readyToContinue}
        </h4>
      </div>

      <div className="relative grid h-fit grid-cols-1 sm:grid-cols-2 gap-4 xl:grid-cols-[repeat(4,minmax(200px,1fr))]">
        
        {/* Stat Card 1 */}
        <div className="backdrop-blur-sm flex flex-col justify-between space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-white transition-all hover:bg-white/20">
          <div className="flex items-center justify-start gap-3">
            <span className="text-[#0b2646] flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-white [&>svg]:w-5 [&>svg]:h-5 shadow-sm">
              <TrophyIcon />
            </span>
            <div className="flex flex-col items-start">
              <b className="text-xl font-medium">{userStats?.achievements || 0}</b>
              <h3 className="text-sm md:text-lg font-medium">{dict.journey.header.stats.achievements}</h3>
            </div>
          </div>
          <p className="w-full border-t border-t-white/30 pt-2 text-center text-white/90 text-sm">
            {dict.journey.header.stats.keepItUp}
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="backdrop-blur-sm flex flex-col justify-between space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-white transition-all hover:bg-white/20">
          <div className="flex items-center justify-start gap-3">
            <span className="text-[#0b2646] flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-white [&>svg]:w-5 [&>svg]:h-5 shadow-sm">
              <ClockIcon />
            </span>
            <div className="flex flex-col items-start">
              <b className="text-xl font-medium">{userStats?.learningMinutes || 0}</b>
              <h3 className="text-sm md:text-lg font-medium">{dict.journey.header.stats.learningMinutes}</h3>
            </div>
          </div>
          <p className="w-full border-t border-t-white/30 pt-2 text-center text-white/90 text-sm">
            {dict.journey.header.stats.keepItUp}
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="backdrop-blur-sm flex flex-col justify-between space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-white transition-all hover:bg-white/20">
          <div className="flex items-center justify-start gap-3">
            <span className="text-[#0b2646] flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-white [&>svg]:w-5 [&>svg]:h-5 shadow-sm">
              <CalendarIcon />
            </span>
            <div className="flex flex-col items-start">
              <b className="text-xl font-medium">{userStats?.liveSessions || 0}</b>
              <h3 className="text-sm md:text-lg font-medium">{dict.journey.header.stats.liveSessions}</h3>
            </div>
          </div>
          <p className="w-full border-t border-t-white/30 pt-2 text-center text-white/90 text-sm">
            {dict.journey.header.stats.keepItUp}
          </p>
        </div>

        {/* Stat Card 4 */}
        <div className="backdrop-blur-sm flex flex-col justify-between space-y-4 rounded-3xl border border-white/20 bg-white/10 p-4 text-white transition-all hover:bg-white/20">
          <div className="flex items-center justify-start gap-3">
            <span className="text-[#0b2646] flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-white [&>svg]:w-5 [&>svg]:h-5 shadow-sm">
              <BookIcon />
            </span>
            <div className="flex flex-col items-start">
              <b className="text-xl font-medium">{userStats?.completedLessons || 0}</b>
              <h3 className="text-sm md:text-lg font-medium">{dict.journey.header.stats.completedLessons}</h3>
            </div>
          </div>
          <p className="w-full border-t border-t-white/30 pt-2 text-center text-white/90 text-sm">
            {dict.journey.header.stats.keepItUp}
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0.0deg) }
          10% { transform: rotate(14.0deg) }
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate(0.0deg) }
          100% { transform: rotate(0.0deg) }
        }
        .animate-waving-hand {
          animation-name: wave;
          animation-duration: 2.5s;
          animation-iteration-count: infinite;
        }
      `}</style>
    </section>
  );
}

