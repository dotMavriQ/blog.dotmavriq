import { getPublishableBlogPosts } from '../lib/blog';
import { markdownToPlainText } from '../lib/markdown-text';

export async function GET() {
  const posts = await getPublishableBlogPosts();

  const index = posts.map((p) => ({
    slug: p.id,
    title: p.data.title,
    excerpt: p.data.excerpt ?? '',
    tags: p.data.tags ?? [],
    date: p.data.pubDate.toISOString(),
    body: markdownToPlainText(p.body ?? ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
