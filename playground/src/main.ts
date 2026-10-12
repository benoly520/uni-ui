import 'uni-ui/theme.css';
import './playground.css';
import { createShowcase, type ShowcaseHandle } from './showcase';
import { homeSections, initHome } from './home';
import { initGlobalControls, observeReveal } from './controls';

const app = document.getElementById('app')!;

/**
 * 全局布局：顶部毛玻璃导航（品牌 + 路由 + 全局控件）始终存在，
 * 下方 #view 根据 hash 路由切换「首页」或「组件展示」。
 */
app.innerHTML = `
  <nav class="nav">
    <div class="brand">uni<span class="dot">·</span>ui</div>
    <div class="nav-links">
      <a class="nav-link" href="#/" data-route="home">首页</a>
      <a class="nav-link" href="#/components" data-route="components">组件</a>
    </div>
    <div class="nav-controls">
      <button class="ui-btn ui-btn--ghost ui-size-sm" id="themeBtn" aria-label="切换明暗主题">◐ 主题</button>
      <button class="ui-btn ui-btn--ghost ui-size-sm" id="mktBtn" aria-label="切换涨跌色约定">涨跌色：中国</button>
      <button class="ui-btn ui-btn--ghost ui-size-sm" id="densityBtn" aria-label="切换信息密度">密度：紧凑</button>
      <button class="ui-btn ui-btn--primary ui-size-sm" id="skinReset">默认品牌色</button>
    </div>
  </nav>
  <div id="view"></div>
`;

const view = document.getElementById('view')!;
initGlobalControls();

let showcase: ShowcaseHandle | null = null;

/** 根据 hash 渲染对应视图 */
function route(): void {
  const name = (location.hash.replace(/^#\/?/, '') || 'home').split('/')[0];
  const isComponents = name === 'components';

  // 离开旧视图时清理 React / Vue 实例
  if (showcase) {
    showcase.destroy();
    showcase = null;
  }

  if (isComponents) {
    showcase = createShowcase(view);
  } else {
    view.innerHTML = `<main class="wrap">${homeSections}</main>`;
    initHome(view);
    observeReveal(view);
  }

  // 同步导航高亮
  document.querySelectorAll<HTMLElement>('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === (isComponents ? 'components' : 'home'));
  });

  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();
