import rss from '@astrojs/rss';
import { AUTHOR, SITE } from '../lib/author';
import { absoluteBlogUrl, getPublishableBlogPosts } from '../lib/blog';

export async function GET() {
  const posts = await getPublishableBlogPosts();

  return rss({
    title: `${AUTHOR.alternateName} Blog`,
    description: `Articles, notes & deep dives by ${AUTHOR.alternateName}`,
    site: SITE.url,
    items: posts.map(p => ({
      link: absoluteBlogUrl(SITE.url, p.id),
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.excerpt,
      categories: p.data.tags ?? [],
      author: `${AUTHOR.email} (${AUTHOR.name})`,
    })),
  });
}
