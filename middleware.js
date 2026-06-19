// Vercel Routing Middleware — runs at the edge before ANY asset is served,
// including the JS/CSS bundle. This is what actually protects the confidential
// content (a client-side passcode would not, since the data ships in the bundle).
//
// Access uses HTTP Basic Auth. Set the credentials as Project → Settings →
// Environment Variables in Vercel:
//   SITE_USER      (optional, defaults to "stayful")
//   SITE_PASSWORD  (set this to a real secret, then redeploy)
// The fallback below only applies until SITE_PASSWORD is set — change it and,
// importantly, keep the GitHub repo private.

export const config = {
  // Protect every route, including /assets/* (the bundle).
  matcher: '/(.*)',
};

export default function middleware(request) {
  const USER = process.env.SITE_USER || 'stayful';
  const PASS = process.env.SITE_PASSWORD || 'changeme-set-SITE_PASSWORD';

  const header = request.headers.get('authorization') || '';
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const sep = decoded.indexOf(':');
      const user = decoded.slice(0, sep);
      const pass = decoded.slice(sep + 1);
      if (user === USER && pass === PASS) {
        return; // authorised — let the request continue to the app
      }
    } catch {
      /* malformed header → fall through to challenge */
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate':
        'Basic realm="Stayful Sales Assistant — internal", charset="UTF-8"',
    },
  });
}
