"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/icons";

export function SocialLoginButton({ locale, provider, nextPath, label }) {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();

  const handleLogin = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const nextParam = searchParams.get("next");
    const redirectTarget = nextParam || `/${locale}`;

    if (provider === "google") {
      // Must use full browser navigation, NOT router.push, because this goes to external Google OAuth.
      window.location.assign(`${window.location.origin}/api/auth/google?next=${encodeURIComponent(redirectTarget)}`);
    } else {
      // Fallback for other providers if added in future
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(redirectTarget)}`,
        },
      });
      if (error) setServerError(error.message);
    }
  };

  return (
    <div className="w-full">
      {serverError && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center mb-4">
          {serverError}
        </div>
      )}
      <button
        onClick={handleLogin}
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 sm:py-3.5 rounded-full hover:bg-gray-50 transition-colors text-[15px]"
      >
        {provider === "google" && <GoogleIcon />}
        {label}
      </button>
    </div>
  );
}
