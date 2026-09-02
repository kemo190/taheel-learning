import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const locales = ["ar", "en"];

export async function middleware(request) {
  // First, update session and check auth rules (e.g. protecting /dashboard)
  const authResponse = await updateSession(request);

  // If updateSession returned a redirect (e.g. to /login), return it immediately
  if (authResponse.headers.get("location")) {
    return authResponse;
  }

  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return authResponse;
  }

  // Redirect if there is no locale (force Arabic as default)
  request.nextUrl.pathname = `/ar${pathname}`;

  // Transfer cookies from authResponse to the new redirect response
  const redirectResponse = NextResponse.redirect(request.nextUrl);
  authResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  return redirectResponse;
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, API routes, public files, images)
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
