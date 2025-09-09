import { MetadataRoute } from 'next';
import { getSortedPostsData } from './lib/posts';

// Generates sitemap for Next.js static export
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://blog.dotmavriq.life';
  const staticPaths: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/blog',
    '/contact',
    '/cv',
    '/portfolio'
  ].map(path => ({ url: base + path, lastModified: new Date(), changeFrequency: 'weekly', priority: path === '' ? 1 : 0.7 }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getSortedPostsData();
    postEntries = posts.map(p => ({
      url: `${base}/blog/posts/${p.id}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch {
    /* ignore */
  }

  return [...staticPaths, ...postEntries];
}
