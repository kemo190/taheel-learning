"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function useAuthRedirect(locale) {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const nextPath = searchParams.get("next");
      if (nextPath && nextPath.startsWith("/")) {
        router.replace(nextPath);
      } else {
        router.replace(`/${locale}/home`);
      }
      router.refresh();
    };

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        handleRedirect();
      }
    };
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        handleRedirect();
      }
    });
    return () => subscription.unsubscribe();
  }, [locale, router]);
}
