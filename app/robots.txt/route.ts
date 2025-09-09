import { NextRequest } from 'next/server';

// Generates robots.txt for static export
export function GET(_req: NextRequest) {
  const body = `User-agent: *\nAllow: /\nSitemap: https://blog.dotmavriq.life/sitemap.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
