import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = 'https://blog.dotmavriq.life';
  const updated = posts.length ? posts[0].data.pubDate.toISOString() : new Date().toISOString();

  const entries = posts.map(p => {
    const url = `${site}/blog/${p.slug}/`;
    const categories = (p.data.tags ?? []).map((t: string) => `    <category term="${escapeXml(t)}" />`).join('\n');
    return `  <entry>
    <title>${escapeXml(p.data.title)}</title>
    <link href="${url}" rel="alternate" />
    <id>${url}</id>
    <published>${p.data.pubDate.toISOString()}</published>
    <updated>${p.data.pubDate.toISOString()}</updated>
    <summary>${escapeXml(p.data.excerpt || '')}</summary>
    <author><name>dotMavriQ</name></author>
${categories}
  </entry>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>dotMavriQ Blog</title>
  <subtitle>Articles, notes &amp; deep dives by dotMavriQ</subtitle>
  <link href="${site}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${site}" rel="alternate" type="text/html" />
  <id>${site}/</id>
  <updated>${updated}</updated>
  <author><name>dotMavriQ</name></author>
${entries}
</feed>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' }
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
