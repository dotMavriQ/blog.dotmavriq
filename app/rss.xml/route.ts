import { NextRequest } from 'next/server';
import { getSortedPostsData } from '../lib/posts';

export async function GET(_req: NextRequest) {
  const base = 'https://blog.dotmavriq.life';
  const posts = await getSortedPostsData();

  const items = posts.map(p => `\n  <item>\n    <title>${escapeXml(p.title)}</title>\n    <link>${base}/blog/posts/${p.id}</link>\n    <guid>${base}/blog/posts/${p.id}</guid>\n    <pubDate>${new Date(p.date).toUTCString()}</pubDate>\n    <description>${escapeXml(p.excerpt)}</description>\n  </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n  <title>dotMavriQ Blog</title>\n  <link>${base}</link>\n  <description>Recent posts</description>${items}\n</channel>\n</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml' } });
}

function escapeXml(str: string) {
  return str.replace(/[<>&'"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] || c));
}
