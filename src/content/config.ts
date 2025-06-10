import { defineCollection, z } from 'astro:content';

// Define the schema for the blog collection
const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.date(),
  }),
});

// Export the collections object with properly typed collections
export const collections = {
  'blog': blogCollection,
};
