import { NextResponse } from 'next/server'

const locales = ['ar', 'en']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale (force Arabic as default)
  request.nextUrl.pathname = `/ar${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, API routes, public files, images)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
