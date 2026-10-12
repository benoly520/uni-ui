/**
 * 组件展示视图（保留原 playground 的左侧分组列表，右侧升级为「多用例 + API 表」文档式布局）。
 * - 左侧：按分类分组的组件菜单（hover 才出现滚动条）。
 * - 右侧：组件简介 → 多个用例区块（标题 + 说明 + React/Vue 实时 demo + 可复制代码）→ 底部 API 速查表。
 * 以「挂载 / 卸载」方式提供，便于路由切换时清理所有 React / Vue 实例。
 */
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createApp, type App } from 'vue';
import { categories, allItems, getDoc, getCases } from './registry';

export interface ShowcaseHandle {
  /** 卸载并清理所有 React / Vue 实例，避免离开路由后残留 DOM */
  destroy(): void;
}

/** 在给定容器上创建组件展示视图 */
export function createShowcase(view: HTMLElement): ShowcaseHandle {
  view.innerHTML = `
    <div class="pg-body">
      <aside class="pg-side" id="pg-side"></aside>
      <main class="pg-main" id="pg-main"></main>
    </div>
  `;

  const side = view.querySelector<HTMLElement>('#pg-side')!;
  const main = view.querySelector<HTMLElement>('#pg-main')!;

  // 所有已挂载的 React / Vue 实例，便于销毁
  let reactRoots: Root[] = [];
  let vueApps: App[] = [];

  /** 构建左侧分组列表 */
  for (const cat of categories) {
    const group = document.createElement('div');
    group.className = 'pg-group';
    const title = document.createElement('div');
    title.className = 'pg-group-title';
    title.textContent = cat.name;
    group.appendChild(title);
    for (const it of cat.items) {
      const btn = document.createElement('button');
      btn.dataset.id = it.id;
      btn.textContent = it.label;
      btn.onclick = () => select(it.id);
      group.appendChild(btn);
    }
    side.appendChild(group);
  }

  /** 选中某个组件：清理旧实例，渲染简介 / 用例 / API 表 */
  function select(id: string): void {
    const doc = getDoc(id);
    if (!doc) return;

    // 清理上一组件的 React / Vue 实例
    reactRoots.forEach((r) => r.unmount());
    vueApps.forEach((a) => a.unmount());
    reactRoots = [];
    vueApps = [];

    const cases = getCases(id);
    const meta = allItems.find((i) => i.id === id)!;

    const head = document.createElement('div');
    head.className = 'pg-demo-head';
    head.innerHTML = `<span id="pg-title"></span><code id="pg-path"></code>`;
    head.querySelector('#pg-title')!.textContent = doc.label;
    head.querySelector('#pg-path')!.textContent = `import { ${id} } from 'uni-ui/react'  ·  uni-ui/vue`;

    const summary = document.createElement('p');
    summary.className = 'pg-summary';
    summary.textContent = doc.summary;

    const casesWrap = document.createElement('div');
    casesWrap.className = 'pg-cases';

    cases.forEach((c) => {
      const section = document.createElement('section');
      section.className = 'pg-case';

      const title = document.createElement('h2');
      title.className = 'pg-case-title';
      title.textContent = c.title;

      const desc = document.createElement('p');
      desc.className = 'pg-case-desc';
      desc.textContent = c.desc;

      const panels = document.createElement('div');
      panels.className = 'pg-panels';
      panels.innerHTML = `
        <section class="pg-panel"><h3>React</h3><div class="pg-stage" data-react></div></section>
        <section class="pg-panel"><h3>Vue</h3><div class="pg-stage" data-vue></div></section>
      `;

      const code = document.createElement('div');
      code.className = 'pg-code';
      code.innerHTML = `
        <div class="pg-code-tabs">
          <button type="button" class="pg-fw active" data-fw="react">React</button>
          <button type="button" class="pg-fw" data-fw="vue">Vue</button>
          <button type="button" class="pg-copy">复制</button>
        </div>
        <pre class="pg-code-block" data-fw="react"><code></code></pre>
        <pre class="pg-code-block" data-fw="vue" hidden><code></code></pre>
      `;
      const reactCodeEl = code.querySelector<HTMLElement>('pre[data-fw="react"] code')!;
      const vueCodeEl = code.querySelector<HTMLElement>('pre[data-fw="vue"] code')!;
      reactCodeEl.textContent = c.reactCode;
      vueCodeEl.textContent = c.vueCode;

      // 框架切换
      const fwBtns = code.querySelectorAll<HTMLButtonElement>('.pg-fw');
      const reactPre = code.querySelector<HTMLElement>('pre[data-fw="react"]')!;
      const vuePre = code.querySelector<HTMLElement>('pre[data-fw="vue"]')!;
      fwBtns.forEach((b) => {
        b.onclick = () => {
          const fw = b.dataset.fw;
          fwBtns.forEach((x) => x.classList.toggle('active', x === b));
          reactPre.hidden = fw !== 'react';
          vuePre.hidden = fw !== 'vue';
        };
      });
      // 复制当前可见代码
      const copyBtn = code.querySelector<HTMLButtonElement>('.pg-copy')!;
      copyBtn.onclick = () => {
        const text = (reactPre.hidden ? vueCodeEl : reactCodeEl).textContent ?? '';
        navigator.clipboard?.writeText(text).then(
          () => {
            const old = copyBtn.textContent;
            copyBtn.textContent = '已复制';
            window.setTimeout(() => (copyBtn.textContent = old), 1200);
          },
          () => {},
        );
      };

      section.appendChild(title);
      section.appendChild(desc);
      section.appendChild(panels);
      section.appendChild(code);
      casesWrap.appendChild(section);

      // 挂载实时 demo（单个用例渲染失败不应影响其它用例与整页）
      const reactEl = panels.querySelector<HTMLElement>('[data-react]')!;
      const vueEl = panels.querySelector<HTMLElement>('[data-vue]')!;
      try {
        const rRoot = createRoot(reactEl);
        rRoot.render(React.createElement(c.reactComp));
        reactRoots.push(rRoot);
      } catch (err) {
        // 记录详细错误，并在面板中给出友好提示
        console.error(`[showcase] React 用例渲染失败：${id} - ${c.title}`, err);
        reactEl.innerHTML = '<p class="pg-demo-error">该用例渲染失败，请查看控制台日志。</p>';
      }
      try {
        const vApp = createApp(c.vueComp as Parameters<typeof createApp>[0]);
        vApp.mount(vueEl);
        vueApps.push(vApp);
      } catch (err) {
        // 记录详细错误，并在面板中给出友好提示
        console.error(`[showcase] Vue 用例挂载失败：${id} - ${c.title}`, err);
        vueEl.innerHTML = '<p class="pg-demo-error">该用例挂载失败，请查看控制台日志。</p>';
      }
    });

    // 底部 API 表
    const api = document.createElement('section');
    api.className = 'pg-api';
    const apiTitle = document.createElement('h2');
    apiTitle.className = 'pg-api-title';
    apiTitle.textContent = 'API';
    api.appendChild(apiTitle);
    const table = document.createElement('table');
    table.className = 'pg-api-table';
    table.innerHTML = `
      <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
      <tbody>${doc.api
        .map(
          (r) =>
            `<tr><td><code>${escapeHtml(r.name)}</code></td><td><code>${escapeHtml(r.type)}</code></td><td><code>${escapeHtml(r.default)}</code></td><td>${escapeHtml(r.desc)}</td></tr>`,
        )
        .join('')}</tbody>
    `;
    api.appendChild(table);

    main.innerHTML = '';
    main.appendChild(head);
    main.appendChild(summary);
    main.appendChild(casesWrap);
    main.appendChild(api);

    side
      .querySelectorAll('button')
      .forEach((b) => b.classList.toggle('active', (b as HTMLButtonElement).dataset.id === id));

    main.scrollTop = 0;
  }

  select(allItems[0].id);

  return {
    destroy() {
      reactRoots.forEach((r) => r.unmount());
      vueApps.forEach((a) => a.unmount());
      reactRoots = [];
      vueApps = [];
    },
  };
}

/** 转义 HTML 特殊字符，避免 API 文本破坏表格结构 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
