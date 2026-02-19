import { getCollection } from 'astro:content';

// Strip markdown/MDX to plain text for indexing
function toPlainText(raw: string): string {
  return raw
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n?/, '')
    // Remove MDX imports/exports
    .replace(/^import\s+.*$/gm, '')
    .replace(/^export\s+.*$/gm, '')
    // Remove JSX components (e.g. <FediEmbed ... />)
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][A-Za-z]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, '')
    // Remove markdown links but keep text: [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove headings markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Remove list markers
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const index = posts.map(p => ({
    slug: p.slug,
    title: p.data.title,
    excerpt: p.data.excerpt ?? '',
    tags: p.data.tags ?? [],
    date: p.data.pubDate.toISOString(),
    body: toPlainText(p.body ?? ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
