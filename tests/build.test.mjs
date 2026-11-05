import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(process.cwd(), 'dist');

test('static build contains the public routes', () => {
  for (const route of ['index.html', 'blog/index.html', 'about/index.html', 'categories/index.html', 'tags/index.html', 'archives/index.html', 'search/index.html', 'rss.xml', 'robots.txt', 'sitemap-index.xml']) {
    assert.equal(existsSync(join(dist, route)), true, `missing ${route}`);
  }
});

test('draft posts are excluded from generated pages and search index', () => {
  const homepage = readFileSync(join(dist, 'index.html'), 'utf8');
  const searchIndex = readFileSync(join(dist, 'search-index.json'), 'utf8');
  assert.equal(homepage.includes('draft-only'), false);
  assert.equal(searchIndex.includes('draft-only'), false);
});

test('article output includes metadata, heading links, and RSS items', () => {
  const article = readFileSync(join(dist, 'blog', 'first-note', 'index.html'), 'utf8');
  const rss = readFileSync(join(dist, 'rss.xml'), 'utf8');
  assert.match(article, /property="article:published_time"/);
  assert.match(article, /href="#写作是一种整理"/);
  assert.match(article, /复制文章链接/);
  assert.match(rss, /first-note/);
});
