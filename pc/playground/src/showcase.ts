/**
 * 组件展示视图（保留原 playground 的左侧分组列表，右侧为「多用例 + API 表」文档式布局）。
 * - 左侧：按分类分组的组件菜单（hover 才出现滚动条）。
 * - 右侧：组件简介 → 多个用例区块（标题 + 说明 + 实时 demo + 可复制代码）→ 底部 API 速查表。
 * - 框架切换在页头：React / Vue / Plain 三选一，demo 面板 / 代码块 / API 表均跟随所选框架。
 * 以「挂载 / 卸载」方式提供，便于路由切换时清理所有 React / Vue / Plain 实例。
 */
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createApp, type App } from 'vue';
import { mount } from 'plain';
import { categories, allItems, getDoc, getCases, type FullCase } from './registry';

export interface ShowcaseHandle {
  /** 卸载并清理所有 React / Vue / Plain 实例，避免离开路由后残留 DOM */
  destroy(): void;
}

type FW = 'react' | 'vue' | 'plain';

/** 单个用例的挂载记录：三块框架面板 + 各框架舞台容器 + 已挂载标记（惰性挂载） */
interface CaseRec {
  id: string;
  title: string;
  item: FullCase;
  panels: Record<FW, HTMLElement>;
  stages: Record<FW, HTMLElement>;
  mounted: Set<FW>;
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

  // 所有已挂载的 React / Vue / Plain 实例，便于销毁
  let reactRoots: Root[] = [];
  let vueApps: App[] = [];
  let plainEls: HTMLElement[] = [];
  // 当前组件的用例挂载记录（切换组件时重置）
  let caseRecs: CaseRec[] = [];

  // 框架偏好（React / Vue / Plain），持久化到 localStorage，跨组件与会话保留
  const FW_KEY = 'uni-ui:playground-fw';
  let currentFw: FW = 'react';
  try {
    const saved = localStorage.getItem(FW_KEY);
    if (saved === 'react' || saved === 'vue' || saved === 'plain') currentFw = saved;
  } catch {
    // localStorage 不可用时回退默认 React，不影响其余功能
  }

  /** 在容器中挂载一个 plain 组件（返回 DocumentFragment 的函数） */
  function mountPlain(el: HTMLElement, Comp: unknown): void {
    if (typeof Comp !== 'function') return;
    plainEls.push(el);
    try {
      mount(el, () => (Comp as () => any)());
    } catch (err) {
      // 记录详细错误，并在面板中给出友好提示
      console.error('[showcase] Plain 用例渲染失败', err);
      el.innerHTML = '<p class="pg-demo-error">该用例渲染失败，请查看控制台日志。</p>';
    }
  }

  /**
   * 惰性挂载某个用例在指定框架下的实时 demo（每个框架仅首次显示时挂载一次）。
   * 必须在面板可见后调用，避免 plain 组件在 display:none 容器中测量布局得到 0。
   */
  function mountCase(rec: CaseRec, fw: FW): void {
    if (rec.mounted.has(fw)) return;
    rec.mounted.add(fw);
    const stage = rec.stages[fw];
    try {
      if (fw === 'react') {
        const root = createRoot(stage);
        root.render(React.createElement(rec.item.reactComp));
        reactRoots.push(root);
      } else if (fw === 'vue') {
        const app = createApp(rec.item.vueComp as Parameters<typeof createApp>[0]);
        app.mount(stage);
        vueApps.push(app);
      } else {
        mountPlain(stage, rec.item.plainComp);
      }
    } catch (err) {
      console.error(`[showcase] ${fw} 用例渲染失败：${rec.id} - ${rec.title}`, err);
      stage.innerHTML = '<p class="pg-demo-error">该用例渲染失败，请查看控制台日志。</p>';
    }
  }

  /** 切换当前框架：先显隐各用例面板，再对当前框架执行惰性挂载 */
  function showFw(fw: FW): void {
    for (const rec of caseRecs) {
      (Object.keys(rec.panels) as FW[]).forEach((k) => {
        rec.panels[k].hidden = k !== fw;
      });
      mountCase(rec, fw);
    }
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

    // 清理上一组件的 React / Vue / Plain 实例
    reactRoots.forEach((r) => r.unmount());
    vueApps.forEach((a) => a.unmount());
    plainEls.forEach((el) => (el.innerHTML = ''));
    reactRoots = [];
    vueApps = [];
    plainEls = [];
    caseRecs = [];

    const cases = getCases(id);
    const docApi = doc.api;

    const head = document.createElement('div');
    head.className = 'pg-demo-head';
    head.innerHTML = `<span id="pg-title"></span><code id="pg-path"></code>`;
    head.querySelector('#pg-title')!.textContent = doc.label;
    head.querySelector('#pg-path')!.textContent =
      doc.importHint ?? `import { ${id} } from 'uni-ui/react' · 'uni-ui/vue' · 'uni-ui/plain'`;

    // 组件级框架切换（React / Vue / Plain）：控制 demo 面板、代码块与 API 表
    const fwTabs = document.createElement('div');
    fwTabs.className = 'pg-fw-tabs';
    fwTabs.innerHTML = `
      <button type="button" class="pg-fw" data-fw="react">React</button>
      <button type="button" class="pg-fw" data-fw="vue">Vue</button>
      <button type="button" class="pg-fw" data-fw="plain">Plain</button>
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

      // demo 面板：每框架一块，由组件级框架切换控制显隐（非当前框架 hidden 且惰性挂载）
      const panels = document.createElement('div');
      panels.className = 'pg-panels';
      panels.innerHTML = `
        <section class="pg-panel" data-fw="react" hidden><div class="pg-stage" data-stage="react"></div></section>
        <section class="pg-panel" data-fw="vue" hidden><div class="pg-stage" data-stage="vue"></div></section>
        <section class="pg-panel" data-fw="plain" hidden><div class="pg-stage" data-stage="plain"></div></section>
      `;

      // 代码区：三套代码（React / Vue / Plain），由组件级框架切换控制显隐
      const code = document.createElement('div');
      code.className = 'pg-code';
      code.innerHTML = `
        <div class="pg-code-bar">
          <button type="button" class="pg-copy">复制</button>
        </div>
        <pre class="pg-code-block" data-code-fw="react"><code></code></pre>
        <pre class="pg-code-block" data-code-fw="vue" hidden><code></code></pre>
        <pre class="pg-code-block" data-code-fw="plain" hidden><code></code></pre>
      `;
      const reactCodeEl = code.querySelector<HTMLElement>('pre[data-code-fw="react"] code')!;
      const vueCodeEl = code.querySelector<HTMLElement>('pre[data-code-fw="vue"] code')!;
      const plainCodeEl = code.querySelector<HTMLElement>('pre[data-code-fw="plain"] code')!;
      reactCodeEl.textContent = c.reactCode;
      vueCodeEl.textContent = c.vueCode;
      plainCodeEl.textContent = c.plainCode;

      section.appendChild(title);
      section.appendChild(desc);
      section.appendChild(panels);
      section.appendChild(code);
      casesWrap.appendChild(section);

      // 复制当前框架对应的代码
      const copyBtn = code.querySelector<HTMLButtonElement>('.pg-copy')!;
      copyBtn.onclick = () => {
        const map: Record<FW, HTMLElement> = { react: reactCodeEl, vue: vueCodeEl, plain: plainCodeEl };
        const text = map[currentFw].textContent ?? '';
        navigator.clipboard?.writeText(text).then(
          () => {
            const old = copyBtn.textContent;
            copyBtn.textContent = '已复制';
            window.setTimeout(() => (copyBtn.textContent = old), 1200);
          },
          () => {},
        );
      };

      // 登记用例：实时 demo 由 showFw(currentFw) 在面板可见后惰性挂载（避免隐藏态测量为 0）
      const panelOf = (k: FW): HTMLElement =>
        panels.querySelector<HTMLElement>(`.pg-panel[data-fw="${k}"]`)!;
      caseRecs.push({
        id,
        title: c.title,
        item: c,
        panels: { react: panelOf('react'), vue: panelOf('vue'), plain: panelOf('plain') },
        stages: {
          react: panels.querySelector<HTMLElement>('[data-stage="react"]')!,
          vue: panels.querySelector<HTMLElement>('[data-stage="vue"]')!,
          plain: panels.querySelector<HTMLElement>('[data-stage="plain"]')!,
        },
        mounted: new Set<FW>(),
      });
    });

    // 底部 API 表（事件名随框架切换：Vue 下 onXxx → @xxx；Plain 同 React）
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
      <tbody class="pg-api-tbody">${renderApiRows(docApi, currentFw)}</tbody>
    `;
    api.appendChild(table);

    /**
     * 统一应用框架：同步切换条激活态、demo 面板显隐、代码块显隐、API 表事件名。
     * 全部内容（面板 / 代码 / API）均跟随所选框架；非当前框架的面板隐藏且不挂载。
     */
    function setFw(fw: FW): void {
      currentFw = fw;
      try {
        localStorage.setItem(FW_KEY, fw);
      } catch {
        // 忽略持久化失败，不影响当前会话的切换体验
      }
      view.querySelectorAll<HTMLElement>('.pg-fw').forEach((b) => {
        b.classList.toggle('active', b.dataset.fw === fw);
      });
      // demo 面板跟随框架：显示当前框架并对其实时 demo 惰性挂载
      showFw(fw);
      main.querySelectorAll<HTMLElement>('[data-code-fw]').forEach((el) => {
        el.hidden = (el as HTMLElement).dataset.codeFw !== fw;
      });
      const apiBody = main.querySelector<HTMLElement>('.pg-api-tbody');
      if (apiBody) apiBody.innerHTML = renderApiRows(docApi, fw);
    }

    main.innerHTML = '';
    main.appendChild(head);
    main.appendChild(summary);
    main.appendChild(casesWrap);
    main.appendChild(api);

    // 绑定组件级框架切换，并应用持久化偏好（初始激活态 / 代码显隐 / API 表）
    fwTabs.querySelectorAll<HTMLButtonElement>('.pg-fw').forEach((b) => {
      b.onclick = () => setFw(b.dataset.fw as FW);
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
      plainEls.forEach((el) => (el.innerHTML = ''));
      reactRoots = [];
      vueApps = [];
      plainEls = [];
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

/** 按框架解析 API 名称：事件名 onXxx → @xxx（Vue）；Plain 与 React 一致（均为 onXxx） */
function apiNameForFw(name: string, fw: FW): string {
  if (fw === 'vue' && /^on[A-Z]/.test(name)) {
    const kebab = name
      .slice(2)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    return `@${kebab}`;
  }
  // 形如 "children / 默认插槽" 的框架二选一写法：Vue 取含「插槽」部分，React / Plain 取另一部分（children）
  if (name.includes(' / ') && name.includes('插槽')) {
    const parts = name.split(' / ').map((s) => s.trim());
    const slotPart = parts.find((p) => p.includes('插槽'));
    const otherPart = parts.find((p) => !p.includes('插槽'));
    return (fw === 'vue' ? slotPart : otherPart) ?? name;
  }
  return name;
}

/** 按框架替换类型中的节点类型：Vue→VNode，Plain→Renderable，React 保持 ReactNode */
function apiTypeForFw(type: string, fw: FW): string {
  if (fw === 'vue') return type.replace(/ReactNode/g, 'VNode');
  if (fw === 'plain') return type.replace(/ReactNode/g, 'Renderable');
  return type;
}

/**
 * 拆分 desc 中「X（React）/ Y（Vue）」的框架说明，按当前框架取对应部分。
 * Vue 下若说明仅为事件名且与当前 name 相同，则统一展示为「事件回调」，避免重复。
 */
function apiDescForFw(desc: string, fw: FW, fwName: string): string {
  const m = desc.match(/^(.*?)（React）\s*\/\s*(.*?)（Vue）\s*$/);
  if (!m) return desc;
  if (fw === 'react') return m[1].trim();
  if (fw === 'plain') return m[1].trim();
  const vuePart = m[2].trim();
  if (/^@[\w-]+$/.test(vuePart) && vuePart === fwName) return '事件回调';
  return vuePart;
}

/** 渲染 API 表行（name / type / desc 均随框架区分） */
function renderApiRows(
  rows: { name: string; type: string; default: string; desc: string }[],
  fw: FW,
): string {
  return rows
    .map((r) => {
      const fwName = apiNameForFw(r.name, fw);
      return `<tr><td><code>${escapeHtml(fwName)}</code></td><td><code>${escapeHtml(apiTypeForFw(r.type, fw))}</code></td><td><code>${escapeHtml(r.default)}</code></td><td>${escapeHtml(apiDescForFw(r.desc, fw, fwName))}</td></tr>`;
    })
    .join('');
}
