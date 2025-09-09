import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  let posts: any[] = [];
  try { posts = await getCollection('blog'); } catch { posts = []; }
  return rss({
    title: 'dotMavriQ Blog',
    description: 'Recent posts',
    site: 'https://blog.dotmavriq.life',
    items: posts.map(p => ({
      link: `/blog/${p.slug}/`,
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.excerpt
    }))
  });
}
