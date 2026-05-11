import { getCollection } from 'astro:content';
import { AUTHOR, SITE } from '../lib/author';

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = SITE.url;
  const latest = posts[0]?.data.updatedDate ?? posts[0]?.data.pubDate;
  const updated = latest ? latest.toISOString() : new Date().toISOString();

  const authorBlock = `<author><name>${escapeXml(AUTHOR.name)}</name><uri>${site}</uri><email>${AUTHOR.email}</email></author>`;

  const entries = posts.map(p => {
    const url = `${site}/blog/${p.id}/`;
    const categories = (p.data.tags ?? [])
      .map((t: string) => `    <category term="${escapeXml(t)}" />`)
      .join('\n');
    const updatedTs = (p.data.updatedDate ?? p.data.pubDate).toISOString();
    return `  <entry>
    <title>${escapeXml(p.data.title)}</title>
    <link href="${url}" rel="alternate" />
    <id>${url}</id>
    <published>${p.data.pubDate.toISOString()}</published>
    <updated>${updatedTs}</updated>
    <summary>${escapeXml(p.data.excerpt || '')}</summary>
    ${authorBlock}
${categories}
  </entry>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(AUTHOR.alternateName)} Blog</title>
  <subtitle>Articles, notes &amp; deep dives by ${escapeXml(AUTHOR.alternateName)}</subtitle>
  <link href="${site}/atom.xml" rel="self" type="application/atom+xml" />
  <link href="${site}" rel="alternate" type="text/html" />
  <id>${site}/</id>
  <updated>${updated}</updated>
  ${authorBlock}
${entries}
</feed>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' }
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
