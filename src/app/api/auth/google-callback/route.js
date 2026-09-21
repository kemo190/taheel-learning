import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // this is our 'next' url
  const next = state ? decodeURIComponent(state) : "/ar/home";

  if (!code) {
    return NextResponse.redirect(`${origin}/ar/login?error=NoCode`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${origin}/api/auth/google-callback`;

  // Exchange code for id_token
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("Google Token Error:", tokenData.error);
      return NextResponse.redirect(`${origin}/ar/login?error=GoogleAuthFailed`);
    }

    const idToken = tokenData.id_token;

    // Initialize Supabase
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
            } catch (error) {}
          },
        },
      }
    );

    // Sign in to Supabase with the ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });

    if (error) {
      console.error("Supabase Auth Error:", error.message);
      return NextResponse.redirect(`${origin}/ar/login?error=SupabaseAuthFailed`);
    }

    // Success! Redirect to the target page
    let target = next.includes("login") || next.includes("register") ? next.replace(/login|register/, "home") : next;
    
    // Prevent Open Redirect: ensure target is a relative path
    if (!target.startsWith("/") || target.startsWith("//") || target.includes("://")) {
      target = "/ar/home";
    }

    return NextResponse.redirect(`${origin}${target}`);

  } catch (error) {
    console.error("OAuth flow exception:", error);
    return NextResponse.redirect(`${origin}/ar/login?error=OAuthException`);
  }
}
