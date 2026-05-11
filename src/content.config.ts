import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    excerpt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    seriesTitle: z.string().optional(),
    part: z.number().int().positive().optional(),
    partsTotal: z.number().int().positive().optional()
  })
});

export const collections = { blog };
