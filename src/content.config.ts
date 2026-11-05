import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    category: z.string().trim().min(1).refine((s) => !/[\\/#?]/.test(s), '分类不能包含 /、\\、#、?'),
    tags: z.array(z.string().trim().min(1).refine((s) => !/[\\/#?]/.test(s), '标签不能包含 /、\\、#、?')).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { blog };
