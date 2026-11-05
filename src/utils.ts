import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORIES } from './config';

export type BlogPost = CollectionEntry<'blog'>;

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC', ...options }).format(date);
}

export function sortPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf() || a.id.localeCompare(b.id));
}

export async function getPublishedPosts() {
  return sortPosts(await getCollection('blog', ({ data }) => !data.draft));
}

export function getCategories(posts: BlogPost[]) {
  return [...new Set([...CATEGORIES, ...posts.map((post) => post.data.category)])];
}

export function getTags(posts: BlogPost[]) {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function readingTime(text = '') {
  const chinese = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const words = (text.match(/[a-zA-Z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil(chinese / 350 + words / 220));
}

export function getPostUrl(post: BlogPost) {
  return `/blog/${post.id.split('/').map(encodeURIComponent).join('/')}/`;
}

export const PAGE_SIZE = 5;
