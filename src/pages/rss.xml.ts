import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { AUTHOR, SITE } from '../lib/author';

export async function GET() {
  const posts = (await getCollection('blog'))
    .filter(p => !p.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${AUTHOR.alternateName} Blog`,
    description: `Articles, notes & deep dives by ${AUTHOR.alternateName}`,
    site: SITE.url,
    items: posts.map(p => ({
      link: `/blog/${p.id}/`,
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.excerpt,
      categories: p.data.tags ?? [],
      author: `${AUTHOR.email} (${AUTHOR.name})`,
    })),
  });
}
