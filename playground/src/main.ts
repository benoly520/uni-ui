import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { createApp, type App } from 'vue';
import 'uni-ui/theme.css';
import './playground.css';
import { categories, allItems, reactDemos, vueDemos } from './registry';

const app = document.getElementById('app')!;
app.innerHTML = `
  <header class="pg-header">
    <div class="pg-brand">uni-ui <span>Playground</span></div>
    <div class="pg-hint">React 18 + Vue 3 双框架 · 同组件并排对比 · 从 <code>uni-ui/react</code> / <code>uni-ui/vue</code> 真实消费</div>
  </header>
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

const side = document.getElementById('pg-side')!;
const reactStage = document.getElementById('pg-react')!;
const vueStage = document.getElementById('pg-vue')!;
const titleEl = document.getElementById('pg-title')!;
const pathEl = document.getElementById('pg-path')!;

let reactRoot: Root | null = null;
let vueApp: App | null = null;

function select(id: string) {
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
    .forEach((b) => b.classList.toggle('active', (b as HTMLButtonElement).dataset.id === id));
}

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
