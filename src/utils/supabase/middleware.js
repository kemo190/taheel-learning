import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtectedPath =
    pathname.includes("/profile") ||
    pathname.includes("/journey") ||
    pathname.includes("/admin");
  const isAuthPath =
    pathname.includes("/login") || pathname.includes("/register");
  const isBaseRoute =
    pathname === "/" || pathname === "/ar";

  // Redirect /en/... to /ar/...
  if (pathname.startsWith("/en")) {
    const url = request.nextUrl.clone();
    url.pathname = "/ar" + pathname.slice(3);
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  if (!user && isProtectedPath) {
    // If user is not logged in and trying to access a protected route, redirect to login
    // Extract locale to maintain it in redirect, or default to ar
    const locale = "ar";

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);

    const redirectResponse = NextResponse.redirect(url);
    // Persist cookies (e.g. cleared session) to the redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // Redirect legacy /journey to /profile
  if (pathname.includes("/journey")) {
    const locale = "ar";
    
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/profile`;
    
    // Copy any query params (e.g. ?tab=favorites)
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  if (user && isAuthPath) {
    // If user is logged in and tries to access login/register, redirect to landing page
    const locale = "ar";

    const url = request.nextUrl.clone();
    const nextPath = url.searchParams.get("next");
    url.searchParams.delete("next");

    if (nextPath && nextPath.startsWith("/")) {
      // Safe relative redirect
      url.pathname = nextPath;
    } else {
      url.pathname = `/${locale}`;
    }

    const redirectResponse = NextResponse.redirect(url);
    // Persist refreshed session cookies to the redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}
