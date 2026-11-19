import 'uni-ui-h5/theme.css';
import './playground.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createApp } from 'vue';
import { mount as mountPlain } from 'plain';
import { setupRem } from 'uni-ui-h5/flexible';
import { buttonCases } from './cases';
import { reactCases } from './react-demos';
import { vueCases } from './vue-demos';
import { plainCases } from './plain-demos';

// 演示以手机宽度封顶，避免桌面端根字号被放大；生产环境按产品需要选择 maxWidth。
setupRem({ maxWidth: 430 });

const app = document.getElementById('app')!;
app.innerHTML = `
  <header class="pg-head">
    <div class="pg-brand">uni<span>·</span>h5</div>
    <div class="pg-head-actions">
      <span class="pg-root" id="pg-root"></span>
      <button class="h5-btn h5-btn--ghost h5-btn--small" id="pg-theme" type="button">暗色</button>
    </div>
  </header>
  <p class="pg-hint">React / Vue / Plain 渲染同一组用例；根字号随视口缩放，组件尺寸由 rem 驱动。</p>
  <main class="pg-main" id="pg-main"></main>
`;

const main = document.getElementById('pg-main')!;

/** 创建单个框架面板，并按 buttonCases 顺序挂载该框架的用例。 */
function createPanel(
  label: string,
  sub: string,
  mountCase: (stage: HTMLElement, index: number) => void,
): void {
  const panel = document.createElement('section');
  panel.className = 'pg-panel';

  const head = document.createElement('div');
  head.className = 'pg-panel-head';
  const fw = document.createElement('span');
  fw.className = 'pg-fw';
  fw.textContent = label;
  const subLabel = document.createElement('span');
  subLabel.className = 'pg-sub';
  subLabel.textContent = sub;
  head.append(fw, subLabel);
  panel.append(head);

  buttonCases.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'pg-card';
    const title = document.createElement('h2');
    title.textContent = `${index + 1}. ${item.title}`;
    const desc = document.createElement('p');
    desc.textContent = item.desc;
    const stage = document.createElement('div');
    stage.className = 'pg-stage';
    card.append(title, desc, stage);
    panel.append(card);

    try {
      mountCase(stage, index);
    } catch (error) {
      console.error(`[playground] ${label} 用例「${item.title}」渲染失败`, error);
      stage.innerHTML = '<p class="pg-error">该用例渲染失败，请查看控制台。</p>';
    }
  });

  main.append(panel);
}

createPanel('React', 'react 18', (stage, index) => {
  createRoot(stage).render(React.createElement(reactCases[index]));
});

createPanel('Vue 3', 'vue 3', (stage, index) => {
  createApp({ render: vueCases[index] }).mount(stage);
});

createPanel('Plain', 'direct DOM', (stage, index) => {
  mountPlain(stage, () => plainCases[index]());
});

/* — 明暗主题切换 — */
const themeBtn = document.getElementById('pg-theme') as HTMLButtonElement;
let dark = false;
try {
  dark = localStorage.getItem('uni-ui-h5:theme') === 'dark';
} catch (error) {
  console.warn('[playground] 读取主题偏好失败，使用默认亮色', error);
}

function applyTheme(): void {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  themeBtn.textContent = dark ? '亮色' : '暗色';
}

applyTheme();
themeBtn.addEventListener('click', () => {
  dark = !dark;
  applyTheme();
  try {
    localStorage.setItem('uni-ui-h5:theme', dark ? 'dark' : 'light');
  } catch (error) {
    console.warn('[playground] 保存主题偏好失败', error);
  }
});

/* — 展示当前视口与根字号，直观看到 rem 适配 — */
const rootLabel = document.getElementById('pg-root')!;

function updateRootLabel(): void {
  const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  rootLabel.textContent = `${Math.round(window.innerWidth)}px 视口 · 1rem=${fontSize.toFixed(1)}px`;
}

updateRootLabel();
window.addEventListener('resize', updateRootLabel);
