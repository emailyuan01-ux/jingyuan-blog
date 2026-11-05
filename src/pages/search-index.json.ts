import { getPublishedPosts, getPostUrl, formatDate } from '../utils';

export async function GET() {
  const posts = await getPublishedPosts();
  return new Response(JSON.stringify(posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    date: formatDate(post.data.pubDate),
    category: post.data.category,
    url: getPostUrl(post),
    content: (post.body ?? '').replace(/<[^>]+>/g, ' ').replace(/[#*`>]/g, '').replace(/\s+/g, ' ').trim(),
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
