import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? '/ar/login';

  // We return a simple HTML page that executes client-side JavaScript.
  // This is crucial because Supabase OAuth Implicit Flow returns the access token
  // in the URL hash (#access_token=...), which the server cannot read.
  // This script grabs the hash and redirects the browser to the target page (/ar/login)
  // where the client-side Supabase SDK can parse it, set the cookies, and log the user in.
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Authenticating...</title>
      </head>
      <body>
        <p>Completing login...</p>
        <script>
          // Redirect to the login page (or target) AND preserve the hash so Supabase can parse it
          window.location.href = '${next}' + window.location.hash;
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
