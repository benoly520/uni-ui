/**
 * 组件展示视图（保留原 playground 的左侧分组列表 + 右侧 React / Vue 双栏并排对比）。
 * 以「挂载 / 卸载」方式提供，便于路由切换时清理 React / Vue 实例。
 */
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createApp, type App } from 'vue';
import { categories, allItems, reactDemos, vueDemos } from './registry';

export interface ShowcaseHandle {
  /** 卸载并清理 React / Vue 实例，避免离开路由后残留 DOM */
  destroy(): void;
}

/** 在给定容器上创建组件展示视图 */
export function createShowcase(view: HTMLElement): ShowcaseHandle {
  view.innerHTML = `
    <div class="pg-body">
      <aside class="pg-side" id="pg-side"></aside>
      <main class="pg-main">
        <div class="pg-demo-head"><span id="pg-title"></span><code id="pg-path"></code></div>
        <div class="pg-panels">
          <section class="pg-panel"><h3>React</h3><div class="pg-stage" id="pg-react"></div></section>
          <section class="pg-panel"><h3>Vue</h3><div class="pg-stage" id="pg-vue"></div></section>
        </div>
      </main>
    </div>
  `;

  const side = view.querySelector<HTMLElement>('#pg-side')!;
  const reactStage = view.querySelector<HTMLElement>('#pg-react')!;
  const vueStage = view.querySelector<HTMLElement>('#pg-vue')!;
  const titleEl = view.querySelector<HTMLElement>('#pg-title')!;
  const pathEl = view.querySelector<HTMLElement>('#pg-path')!;

  let reactRoot: Root | null = null;
  let vueApp: App | null = null;

  /** 选中某个组件：卸载旧实例，渲染 React / Vue 双份 */
  function select(id: string): void {
    const meta = allItems.find((i) => i.id === id);
    if (!meta) return;
    titleEl.textContent = meta.label;
    pathEl.textContent = `import { ${id} } from 'uni-ui/react'  ·  uni-ui/vue`;

    if (reactRoot) reactRoot.unmount();
    reactRoot = createRoot(reactStage);
    reactRoot.render(React.createElement(reactDemos[id]));

    if (vueApp) vueApp.unmount();
    vueApp = createApp(vueDemos[id]);
    vueApp.mount(vueStage);

    side
      .querySelectorAll('button')
      .forEach((b) =>
        b.classList.toggle('active', (b as HTMLButtonElement).dataset.id === id),
      );
  }

  // 构建左侧分组列表
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
      btn.title = it.desc;
      btn.onclick = () => select(it.id);
      group.appendChild(btn);
    }
    side.appendChild(group);
  }

  select(allItems[0].id);

  return {
    destroy() {
      reactRoot?.unmount();
      vueApp?.unmount();
      reactRoot = null;
      vueApp = null;
    },
  };
}
