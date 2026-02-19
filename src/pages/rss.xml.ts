import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'dotMavriQ Blog',
    description: 'Articles, notes & deep dives by dotMavriQ',
    site: 'https://blog.dotmavriq.life',
    items: posts.map(p => ({
      link: `/blog/${p.slug}/`,
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.excerpt
    }))
  });
}
