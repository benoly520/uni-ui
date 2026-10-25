/**
 * 全局控件：主题明暗、毛玻璃材质、涨跌色约定、信息密度、多品牌换肤。
 * 这些状态写入 documentElement，跨路由持久生效。
 */

/** 初始化顶部导航栏的全局控件（只在启动时调用一次） */
export function initGlobalControls(): void {
  const html = document.documentElement;

  // 主题明暗：覆盖 data-theme，仅语义令牌变化，组件代码不变
  const themeBtn = document.getElementById('themeBtn');
  themeBtn?.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    html.style.colorScheme = next;
  });

  // 毛玻璃材质：data-glass="off" 时 theme.css 把全站半透明面回退为不透明实心面
  // （同时真正移除 backdrop-filter，不是把 opacity 压到 100%）
  const glassBtn = document.getElementById('glassBtn');
  glassBtn?.addEventListener('click', () => {
    const off = html.dataset.glass !== 'off';
    if (off) html.dataset.glass = 'off';
    else delete html.dataset.glass;
    glassBtn.textContent = '玻璃：' + (off ? '关' : '开');
  });

  // 涨跌色约定：data-mkt=cn(红涨绿跌) / intl(绿涨红跌)
  const mktBtn = document.getElementById('mktBtn');
  mktBtn?.addEventListener('click', () => {
    const toIntl = html.dataset.mkt !== 'intl';
    html.dataset.mkt = toIntl ? 'intl' : 'cn';
    mktBtn.textContent = '涨跌色：' + (toIntl ? '国际' : '中国');
  });

  // 信息密度：紧凑 / 宽松（theme.css 的 html.density-cozy 控制）
  const densityBtn = document.getElementById('densityBtn');
  densityBtn?.addEventListener('click', () => {
    const cozy = html.classList.toggle('density-cozy');
    densityBtn.textContent = '密度：' + (cozy ? '宽松' : '紧凑');
  });

  // 多品牌换肤：复位品牌色到默认晴空蓝，并同步色板选中态
  const skinReset = document.getElementById('skinReset');
  skinReset?.addEventListener('click', () => {
    html.style.setProperty('--ui-color-brand', '#0a84ff');
    syncSkinPressed('#0a84ff');
  });
}

/** 把色板（.skin）的选中态与给定品牌色对齐 */
export function syncSkinPressed(brand: string): void {
  document.querySelectorAll<HTMLElement>('.skin').forEach((b) => {
    b.setAttribute('aria-pressed', b.dataset.skin === brand ? 'true' : 'false');
  });
}

/**
 * 滚动入场：进入视口后给 .reveal 元素加 .in，触发淡入上移动画。
 * 每次渲染新视图后调用，仅观察作用域内新出现的元素。
 */
export function observeReveal(scope: HTMLElement): void {
  const els = scope.querySelectorAll<HTMLElement>('.reveal');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  els.forEach((el) => io.observe(el));
}
