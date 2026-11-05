import rss from '@astrojs/rss';
import { SITE } from '../config';
import { getPostUrl, getPublishedPosts } from '../utils';

export async function GET() {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title, description: SITE.description, site: SITE.url,
    customData: '<language>zh-cn</language>',
    items: posts.map((post) => ({
      title: post.data.title, description: post.data.description,
      pubDate: post.data.pubDate, link: getPostUrl(post), categories: [post.data.category]
    }))
  });
}

