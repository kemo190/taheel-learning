"use client";
import React from "react";

// simplified header

export default function JourneyHeader({
  dict,
  user,
  profile,
  locale,
  userStats,
}) {
  const isRtl = locale === "ar";

  // Try to get certificate name, then first name
  const displayName =
    profile?.certificate_name?.split(" ")[0] ||
    profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.full_name?.split(" ")[0] ||
    dict.profile.header.userFallback;

  return (
    <section
      className="relative flex min-h-[160px] flex-col justify-center overflow-hidden rounded-3xl p-8 md:p-12 bg-[url('/my-learning-header.png')] bg-[length:100%_100%] bg-center bg-no-repeat mb-8 shadow-sm"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative z-10 flex flex-col gap-3 text-white">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-start gap-2">
          {dict.journey.header.welcome} {displayName}{" "}
          <span className="animate-waving-hand origin-bottom-right inline-block">
            👋
          </span>
        </h2>
        <h4 className="text-lg md:text-xl text-white/90">
          {dict.journey.header.readyToContinue}
        </h4>
      </div>

      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
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
