import { getCollection } from 'astro:content';

export async function GET() {
  let posts: any[] = [];
  try { posts = await getCollection('blog'); } catch { posts = []; }
  const urls = posts.length ? posts.map(p => `<url><loc>https://blog.dotmavriq.life/blog/${p.slug}/</loc><lastmod>${p.data.pubDate.toISOString()}</lastmod></url>`).join('') : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
