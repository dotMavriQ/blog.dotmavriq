import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

const BLOG_PUBLICATION_ENABLED =
  import.meta.env.DEV || process.env.DOTBLOG_PUBLISH_POSTS === "1";

export const BLOG_CURATION_COPY = {
  title: "blog",
  description: "Articles, notes, and deep dives from Jonatan Jansson.",
  standfirst:
    "The archive is being prepared for publication. New posts will appear here after manual cleanup.",
  meta:
    "In the meantime, you can read about the work behind this site on the about page, or browse selected projects in the portfolio.",
} as const;

export function blogPath(slug?: string): string {
  return slug ? `/blog/${slug}` : "/blog";
}

export function absoluteBlogUrl(siteUrl: string, slug?: string): string {
  return `${siteUrl}${blogPath(slug)}`;
}

export async function getPublishableBlogPosts(): Promise<BlogPost[]> {
  if (!BLOG_PUBLICATION_ENABLED) return [];

  return (await getCollection("blog"))
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
