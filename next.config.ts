import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    // Explicit root also covers Vinext's zero-segment wildcard matching.
    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
    ];
    return ['/', '/:path*'].map(source => ({ source, headers }));
  },
};
export default nextConfig;
