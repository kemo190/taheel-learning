import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/ar/login";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options),
              );
            } catch (error) {
              // Ignore if called from a Server Component
            }
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Upon successful exchange, redirect to the target page (e.g. /ar/home)
      // If next is /ar/login, we might want to redirect to /ar/home since they are now logged in.
      let target =
        next.includes("login") || next.includes("register")
          ? next.replace(/login|register/, "home")
          : next;

      // Prevent Open Redirect: ensure target is a relative path and doesn't redirect externally
      if (!target.startsWith("/") || target.startsWith("//") || target.includes("://")) {
        target = "/ar/home";
      }

      return NextResponse.redirect(`${origin}${target}`);
    } else {
      console.error("OAuth Callback Error:", error.message);
    }
  }

  // Fallback: If there's no code or there was an error, redirect to login page
  return NextResponse.redirect(`${origin}/ar/login`);
}


