export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: https://blog.dotmavriq.life/sitemap-index.xml\n`, { headers: { 'Content-Type': 'text/plain' } });
}
