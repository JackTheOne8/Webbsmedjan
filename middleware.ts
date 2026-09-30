import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (url.hostname === 'webbsmedjan.com' && url.protocol === 'http:') {
    const secureUrl = new URL(request.url);
    secureUrl.protocol = 'https:';
    return NextResponse.redirect(secureUrl, 308);
  }

  // Per-response nonces authorize the framework's inline hydration scripts.
  // Never accept a nonce or CSP policy supplied by the visitor.
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(24))));
  const development = process.env.NODE_ENV !== 'production';
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${development ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    // Motion and React set element styles for scroll and switch animations.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self'",
    "font-src 'self'",
    `connect-src 'self'${development ? ' ws: wss:' : ''}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
  ].join('; ');
  const headers = new Headers(request.headers);
  headers.set('Content-Security-Policy', policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Content-Security-Policy', policy);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon\\.svg|.*\\.(?:jpeg|jpg|png|webp|mp4)$).*)'] };
