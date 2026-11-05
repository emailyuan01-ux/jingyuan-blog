interface SearchPost {
  title: string;
  description: string;
  date: string;
  category: string;
  url: string;
  content: string;
}

// 全部 DOM 文本使用 textContent，文章或查询中的 HTML 不会被执行。
export function initSearch() {
  const form = document.querySelector<HTMLFormElement>('[data-search-form]');
  const input = form?.querySelector<HTMLInputElement>('input');
  const results = document.querySelector<HTMLElement>('[data-search-results]');
  const status = document.querySelector<HTMLElement>('[data-search-status]');
  if (!form || !input || !results || !status) return;
  let index: Promise<SearchPost[]> | undefined;
  let revision = 0;
  let timer: ReturnType<typeof setTimeout>;

  function loadIndex() {
    index ??= fetch('/search-index.json').then((response) => {
      if (!response.ok) throw new Error('搜索索引加载失败');
      return response.json() as Promise<SearchPost[]>;
    }).catch((error) => { index = undefined; throw error; });
    return index;
  }

  async function search() {
    if (!input || !results || !status) return;
    const current = ++revision;
    const query = input.value.trim();
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    results.replaceChildren();
    if (!query) { status.textContent = '输入关键词开始搜索。'; return; }
    status.textContent = '正在搜索…';
    try {
      const posts = await loadIndex();
      if (current !== revision) return;
      const terms = query.toLocaleLowerCase().split(/\s+/);
      const matches = posts.filter((post) => {
        const text = `${post.title} ${post.description} ${post.content}`.toLocaleLowerCase();
        return terms.every((term) => text.includes(term));
      });
      status.textContent = matches.length ? `找到 ${matches.length} 篇相关文章。` : '没有找到相关文章，试试更短的关键词。';
      const fragment = document.createDocumentFragment();
      for (const post of matches) {
        const article = document.createElement('article');
        article.className = 'search-result';
        const meta = document.createElement('div');
        meta.className = 'post-card-meta';
        meta.textContent = `${post.date} / ${post.category}`;
        const heading = document.createElement('h2');
        const link = document.createElement('a');
        link.href = post.url;
        link.textContent = post.title;
        heading.append(link);
        const summary = document.createElement('p');
        const position = post.content.toLocaleLowerCase().indexOf(terms[0]);
        const start = Math.max(0, position - 35);
        summary.textContent = position >= 0 ? `${start > 0 ? '…' : ''}${post.content.slice(start, start + 150)}${post.content.length > start + 150 ? '…' : ''}` : post.description;
        article.append(meta, heading, summary);
        fragment.append(article);
      }
      results.append(fragment);
    } catch {
      if (current === revision) status.textContent = '暂时无法加载搜索索引，请检查网络后再次点击搜索。';
    }
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); clearTimeout(timer); void search(); });
  input.addEventListener('input', () => { ++revision; clearTimeout(timer); timer = setTimeout(() => { void search(); }, 180); });
  const initial = new URLSearchParams(window.location.search).get('q');
  if (initial) { input.value = initial; void search(); }
}
