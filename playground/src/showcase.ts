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

  // 框架偏好（React / Vue），持久化到 localStorage，跨组件与会话保留
  const FW_KEY = 'uni-ui:playground-fw';
  let currentFw: 'react' | 'vue' = 'react';
  try {
    const saved = localStorage.getItem(FW_KEY);
    if (saved === 'react' || saved === 'vue') currentFw = saved;
  } catch {
    // localStorage 不可用时回退默认 React，不影响其余功能
  }

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
    const docApi = doc.api;

    const head = document.createElement('div');
    head.className = 'pg-demo-head';
    head.innerHTML = `<span id="pg-title"></span><code id="pg-path"></code>`;
    head.querySelector('#pg-title')!.textContent = doc.label;
    head.querySelector('#pg-path')!.textContent = `import { ${id} } from 'uni-ui/react'  ·  uni-ui/vue`;

    // 组件级框架切换（React / Vue）：控制整页 demo、代码与 API 表，偏好持久化
    const fwTabs = document.createElement('div');
    fwTabs.className = 'pg-fw-tabs';
    fwTabs.innerHTML = `
      <button type="button" class="pg-fw" data-fw="react">React</button>
      <button type="button" class="pg-fw" data-fw="vue">Vue</button>
    `;
    head.appendChild(fwTabs);

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

      // demo 面板：React / Vue 各一块，由组件级框架切换控制显隐（默认 React）
      const panels = document.createElement('div');
      panels.className = 'pg-panels';
      panels.innerHTML = `
        <section class="pg-panel" data-fw="react"><div class="pg-stage" data-react></div></section>
        <section class="pg-panel" data-fw="vue" hidden><div class="pg-stage" data-vue></div></section>
      `;

      // 代码区：仅保留复制按钮；React/Vue 由用例级框架切换统一控制
      const code = document.createElement('div');
      code.className = 'pg-code';
      code.innerHTML = `
        <div class="pg-code-bar">
          <button type="button" class="pg-copy">复制</button>
        </div>
        <pre class="pg-code-block" data-fw="react"><code></code></pre>
        <pre class="pg-code-block" data-fw="vue" hidden><code></code></pre>
      `;
      const reactCodeEl = code.querySelector<HTMLElement>('pre[data-fw="react"] code')!;
      const vueCodeEl = code.querySelector<HTMLElement>('pre[data-fw="vue"] code')!;
      reactCodeEl.textContent = c.reactCode;
      vueCodeEl.textContent = c.vueCode;

      section.appendChild(title);
      section.appendChild(desc);
      section.appendChild(panels);
      section.appendChild(code);
      casesWrap.appendChild(section);

      // 复制当前框架对应的代码
      const copyBtn = code.querySelector<HTMLButtonElement>('.pg-copy')!;
      copyBtn.onclick = () => {
        const text = (currentFw === 'react' ? reactCodeEl : vueCodeEl).textContent ?? '';
        navigator.clipboard?.writeText(text).then(
          () => {
            const old = copyBtn.textContent;
            copyBtn.textContent = '已复制';
            window.setTimeout(() => (copyBtn.textContent = old), 1200);
          },
          () => {},
        );
      };

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

    // 底部 API 表（事件名随框架切换：Vue 下 onXxx → @xxx）
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
      <tbody class="pg-api-tbody">${renderApiRows(doc.api, currentFw)}</tbody>
    `;
    api.appendChild(table);

    /**
     * 统一应用框架：同步切换条激活态、demo/代码显隐、API 表事件名。
     * 排除 .pg-fw 按钮自身，避免切换时把切换按钮一并隐藏（此前 case 级实现的 bug）。
     */
    function setFw(fw: 'react' | 'vue'): void {
      currentFw = fw;
      try {
        localStorage.setItem(FW_KEY, fw);
      } catch {
        // 忽略持久化失败，不影响当前会话的切换体验
      }
      view.querySelectorAll<HTMLElement>('.pg-fw').forEach((b) => {
        b.classList.toggle('active', b.dataset.fw === fw);
      });
      main.querySelectorAll<HTMLElement>('[data-fw]:not(.pg-fw)').forEach((el) => {
        el.hidden = el.dataset.fw !== fw;
      });
      const apiBody = main.querySelector<HTMLElement>('.pg-api-tbody');
      if (apiBody) apiBody.innerHTML = renderApiRows(docApi, fw);
    }

    main.innerHTML = '';
    main.appendChild(head);
    main.appendChild(summary);
    main.appendChild(casesWrap);
    main.appendChild(api);

    // 绑定组件级框架切换，并应用持久化偏好（初始显隐 / 激活态 / API 表）
    fwTabs.querySelectorAll<HTMLButtonElement>('.pg-fw').forEach((b) => {
      b.onclick = () => setFw(b.dataset.fw as 'react' | 'vue');
    });
    setFw(currentFw);

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

/** 按框架解析 API 名称：事件名 onXxx → @xxx；children / 默认插槽 类二选一写法按框架取值 */
function apiNameForFw(name: string, fw: 'react' | 'vue'): string {
  // React 事件名 onXxx 在 Vue 下映射为 @xxx（kebab-case）
  if (fw === 'vue' && /^on[A-Z]/.test(name)) {
    const kebab = name
      .slice(2)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    return `@${kebab}`;
  }
  // 形如 "children / 默认插槽" 的框架二选一写法：Vue 取含「插槽」部分，React 取另一部分
  if (name.includes(' / ') && name.includes('插槽')) {
    const parts = name.split(' / ').map((s) => s.trim());
    const slotPart = parts.find((p) => p.includes('插槽'));
    const otherPart = parts.find((p) => !p.includes('插槽'));
    return (fw === 'vue' ? slotPart : otherPart) ?? name;
  }
  return name;
}

/** Vue 下把类型中的 ReactNode 替换为 VNode（Vue 语境下的等价类型） */
function apiTypeForFw(type: string, fw: 'react' | 'vue'): string {
  return fw === 'vue' ? type.replace(/ReactNode/g, 'VNode') : type;
}

/**
 * 拆分 desc 中「X（React）/ Y（Vue）」的框架说明，按当前框架取对应部分。
 * Vue 下若说明仅为事件名且与当前 name 相同，则统一展示为「事件回调」，避免重复。
 */
function apiDescForFw(desc: string, fw: 'react' | 'vue', fwName: string): string {
  const m = desc.match(/^(.*?)（React）\s*\/\s*(.*?)（Vue）\s*$/);
  if (!m) return desc;
  if (fw === 'react') return m[1].trim();
  const vuePart = m[2].trim();
  if (/^@[\w-]+$/.test(vuePart) && vuePart === fwName) return '事件回调';
  return vuePart;
}

/** 渲染 API 表行（name / type / desc 均随框架区分） */
function renderApiRows(
  rows: { name: string; type: string; default: string; desc: string }[],
  fw: 'react' | 'vue',
): string {
  return rows
    .map((r) => {
      const fwName = apiNameForFw(r.name, fw);
      return `<tr><td><code>${escapeHtml(fwName)}</code></td><td><code>${escapeHtml(apiTypeForFw(r.type, fw))}</code></td><td><code>${escapeHtml(r.default)}</code></td><td>${escapeHtml(apiDescForFw(r.desc, fw, fwName))}</td></tr>`;
    })
    .join('');
}
