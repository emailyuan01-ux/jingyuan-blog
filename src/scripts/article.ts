async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // 本地非安全地址或禁用 Clipboard API 的浏览器提供兼容回退。
    const focused = document.activeElement as HTMLElement | null;
    const field = document.createElement('textarea');
    field.value = text;
    field.className = 'clipboard-fallback';
    document.body.append(field);
    field.select();
    const success = document.execCommand('copy');
    field.remove();
    focused?.focus();
    if (!success) throw new Error('Clipboard unavailable');
  }
}

function bindCopy(button: HTMLButtonElement, text: () => string, successText: string) {
  const original = button.textContent;
  button.addEventListener('click', async () => {
    button.disabled = true;
    try { await copyText(text()); button.textContent = successText; }
    catch { button.textContent = '复制失败，请手动复制'; }
    finally { setTimeout(() => { button.textContent = original; button.disabled = false; }, 2000); }
  });
}

export function initArticle() {
  const link = document.querySelector<HTMLButtonElement>('[data-copy-link]');
  if (link) bindCopy(link, () => window.location.href.split('#')[0], '已复制链接');
  document.querySelectorAll<HTMLElement>('.prose pre').forEach((pre) => {
    const code = pre.querySelector('code');
    if (!code) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const label = document.createElement('span');
    label.textContent = pre.dataset.language || pre.className.match(/language-(\w+)/)?.[1] || 'CODE';
    const button = document.createElement('button');
    button.className = 'copy-code';
    button.type = 'button';
    button.textContent = '复制代码';
    button.setAttribute('aria-live', 'polite');
    bindCopy(button, () => code.textContent ?? '', '已复制');
    toolbar.append(label, button);
    wrapper.append(toolbar, pre);
  });
}
