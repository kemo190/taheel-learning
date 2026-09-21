import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get("next") ?? "/ar";

  // Google OAuth URL construction
  const clientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID is not configured in environment variables." }, { status: 500 });
  }

  const redirectUri = `${origin}/api/auth/google-callback`;

  // We pass 'next' in the state parameter to remember where to redirect after login
  const state = encodeURIComponent(next);

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid email profile&state=${state}`;

  return NextResponse.redirect(authUrl);
}
