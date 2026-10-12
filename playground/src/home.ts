/**
 * 首页（介绍页）内容：直接复用设计原型 uni-ui-design-preview.html 的
 * 「Hero」「设计定调」「Tokens」三块，保持对应样式与交互。
 */

// 三块原始结构（Hero / 设计定调 / Tokens），仅把 Hero 的 CTA 改为站内路由锚点
export const homeSections = /* html */ `
  <!-- Hero：非对称、左对齐、大气 -->
  <section class="section" style="padding-top: var(--ui-space-7);">
    <div class="reveal">
      <p class="eyebrow">面向产品的组件系统</p>
      <h1 style="font-size: var(--ui-fs-3xl); max-width: 14ch;">为产品而生的<br />克制与毛玻璃。</h1>
      <p class="section-sub" style="margin-top: var(--ui-space-4);">
        uni-ui 不是后台管理工具箱。它是一套有自身品牌声音、紧凑利落、原生支持暗色与多品牌换肤的组件系统——
        视觉由 token 驱动，DOM 结构跨框架统一。
      </p>
      <div class="row" style="margin-top: var(--ui-space-5);">
        <a class="ui-btn ui-btn--primary" href="#/components">开始使用</a>
        <a class="ui-btn ui-btn--default" href="#/components">查看组件</a>
      </div>
    </div>
  </section>

  <!-- 设计定调说明 -->
  <section class="section">
    <div class="ui-glass ui-card reveal" style="grid-column: span 12;">
      <h2 class="section-title" style="font-size: var(--ui-fs-xl);">设计定调（Design Direction）</h2>
      <div class="row" style="flex-wrap: wrap; gap: var(--ui-space-5); margin-top: var(--ui-space-4); align-items: flex-start;">
        <div style="flex: 1 1 200px;"><span class="ui-label">受众</span><p style="margin-top:6px;">面向 C 端 / B 端产品界面，非数据密集后台。</p></div>
        <div style="flex: 1 1 200px;"><span class="ui-label">调性</span><p style="margin-top:6px;">苹果 macOS 大气简约 + 毛玻璃半透明 + 紧凑利落。</p></div>
        <div style="flex: 1 1 200px;"><span class="ui-label">展示字 / 正文</span><p style="margin-top:6px;">Cabinet Grotesk / Satoshi，等宽 JetBrains Mono 用于 token。</p></div>
        <div style="flex: 1 1 200px;"><span class="ui-label">记忆点</span><p style="margin-top:6px;">毛玻璃材质 + 电光靛品牌色，换肤只动一个变量。</p></div>
      </div>
    </div>
  </section>

  <!-- Tokens -->
  <section class="section">
    <p class="eyebrow reveal">Design Tokens</p>
    <h2 class="section-title reveal">一套变量，驱动全部视觉</h2>
    <p class="section-sub reveal">颜色、字阶、间距、圆角、阴影全部语义化。暗色与换肤仅覆盖语义令牌，组件零改动。</p>

    <div class="gallery">
      <div class="cell cell-4 ui-glass reveal">
        <h3>品牌与语义色</h3>
        <div class="token-grid">
          <div><div class="swatch" style="background: var(--ui-color-brand);"></div><div class="token-label">--ui-color-brand</div></div>
          <div><div class="swatch" style="background: var(--ui-color-danger);"></div><div class="token-label">--ui-color-danger</div></div>
          <div><div class="swatch" style="background: var(--ui-text);"></div><div class="token-label">--ui-text</div></div>
          <div><div class="swatch" style="background: var(--ui-text-muted);"></div><div class="token-label">--ui-text-muted</div></div>
          <div><div class="swatch" style="background: var(--ui-bg);"></div><div class="token-label">--ui-bg</div></div>
          <div><div class="swatch" style="background: var(--ui-border);"></div><div class="token-label">--ui-border</div></div>
        </div>
      </div>

      <div class="cell cell-4 ui-glass reveal">
        <h3>字阶（模块化）</h3>
        <div style="display:flex; flex-direction:column; gap:10px;">
          <div style="font-family:var(--ui-font-display); font-size:var(--ui-fs-3xl);">Aa 64</div>
          <div style="font-family:var(--ui-font-display); font-size:var(--ui-fs-xl);">Aa 24</div>
          <div style="font-family:var(--ui-font-body); font-size:var(--ui-fs-lg);">产品界面 17</div>
          <div style="font-family:var(--ui-font-body); font-size:var(--ui-fs-md);">正文 14（紧凑）</div>
          <div style="font-family:var(--ui-font-mono); font-size:var(--ui-fs-sm);">token 13</div>
        </div>
      </div>

      <div class="cell cell-4 ui-glass reveal">
        <h3>圆角与间距（紧凑）</h3>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; gap:10px; align-items:center;"><div style="width:28px;height:28px;background:var(--ui-color-brand);border-radius:var(--ui-radius-sm);"></div><span class="ui-label">sm 4px</span></div>
          <div style="display:flex; gap:10px; align-items:center;"><div style="width:28px;height:28px;background:var(--ui-color-brand);border-radius:var(--ui-radius-md);"></div><span class="ui-label">md 7px</span></div>
          <div style="display:flex; gap:10px; align-items:center;"><div style="width:28px;height:28px;background:var(--ui-color-brand);border-radius:var(--ui-radius-lg);"></div><span class="ui-label">lg 12px</span></div>
          <div style="display:flex; gap:10px; align-items:center;"><div style="width:28px;height:28px;background:var(--ui-color-brand);border-radius:var(--ui-radius-pill);"></div><span class="ui-label">pill</span></div>
        </div>
      </div>

      <!-- 换肤演示 -->
      <div class="cell cell-12 ui-glass reveal">
        <h3>多品牌换肤 — 只覆盖 <code style="font-family:var(--ui-font-mono);">--ui-color-brand</code></h3>
        <div class="row">
          <button class="skin" style="background:#ff453a;" data-skin="#ff453a" aria-pressed="false" title="绯红" aria-label="绯红（红）"></button>
          <button class="skin" style="background:#ff6a00;" data-skin="#ff6a00" aria-pressed="false" title="丹橙" aria-label="丹橙（橙）"></button>
          <button class="skin" style="background:#ffd60a;" data-skin="#ffd60a" aria-pressed="false" title="流金" aria-label="流金（黄）"></button>
          <button class="skin" style="background:#00c896;" data-skin="#00c896" aria-pressed="false" title="翡翠" aria-label="翡翠（绿）"></button>
          <button class="skin" style="background:#0a84ff;" data-skin="#0a84ff" aria-pressed="true" title="晴空（默认）" aria-label="晴空（蓝·默认）"></button>
          <button class="skin" style="background:#5246e5;" data-skin="#5246e5" aria-pressed="false" title="绀青" aria-label="绀青（靛）"></button>
          <button class="skin" style="background:#a855f7;" data-skin="#a855f7" aria-pressed="false" title="紫菀" aria-label="紫菀（紫）"></button>
          <span class="ui-label" style="margin-left:var(--ui-space-3);">七色光谱 · 绯红 / 丹橙 / 流金 / 翡翠 / 晴空（默认）/ 绀青 / 紫菀；点击切换品牌色，全站按钮 / 焦点环 / 开关 / 分段选中实时跟随。</span>
        </div>
      </div>
      <div class="cell cell-12 ui-glass reveal">
        <h3>毛玻璃材质 — 透明度(%) 与 模糊半径(px) 实时可调</h3>
        <div class="row" style="align-items:center; gap:var(--ui-space-5); flex-wrap:wrap;">
          <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
            透明度 <output id="glassOpVal" style="font-family:var(--ui-font-mono); min-width:3ch;">45%</output>
            <input type="range" id="glassOp" min="0" max="100" value="45" style="accent-color:var(--ui-color-brand);" />
          </label>
          <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
            模糊半径 <output id="glassBlurVal" style="font-family:var(--ui-font-mono); min-width:4ch;">20px</output>
            <input type="range" id="glassBlur" min="0" max="40" value="20" style="accent-color:var(--ui-color-brand);" />
          </label>
          <span class="ui-label">上方滑块改“全局默认”（常规面：卡片 / 对话框 / Toast）。顶栏 / 按钮 / 输入框属“强面”，走各自独立旋钮——见下方「逐组件独立控制」。</span>
        </div>
        <div class="row" style="gap:var(--ui-space-4); flex-wrap:wrap; margin-top:var(--ui-space-4);">
          <div class="ui-glass" style="flex:1; min-width:150px; padding:var(--ui-space-4); text-align:center;">
            <div class="ui-label">全局默认</div>
            <div style="font-size:var(--ui-fs-sm); margin-top:var(--ui-space-2); opacity:.8;">跟随上方全局滑块</div>
          </div>
          <div class="ui-glass" style="--ui-glass-opacity:85%; --ui-glass-blur:4px; flex:1; min-width:150px; padding:var(--ui-space-4); text-align:center;">
            <div class="ui-label">实例覆盖 A</div>
            <div style="font-size:var(--ui-fs-sm); margin-top:var(--ui-space-2); opacity:.8;">透明度 15% · blur 4px（不随全局变）</div>
          </div>
          <div class="ui-glass" style="--ui-glass-opacity:30%; --ui-glass-blur:32px; flex:1; min-width:150px; padding:var(--ui-space-4); text-align:center;">
            <div class="ui-label">实例覆盖 B</div>
            <div style="font-size:var(--ui-fs-sm); margin-top:var(--ui-space-2); opacity:.8;">透明度 70% · blur 32px（不随全局变）</div>
          </div>
        </div>
      </div>

      <!-- 逐组件独立玻璃控制：每个组件有自己的旋钮，互不干扰 -->
      <div class="cell cell-12 ui-glass reveal">
        <h3>逐组件独立玻璃控制 — 透明度 / 模糊各自可调，互不干扰</h3>
        <p class="ui-label">每个玻璃组件都有独立旋钮（<code style="font-family:var(--ui-font-mono);">--ui-{comp}-glass-opacity</code> / <code style="font-family:var(--ui-font-mono);">--ui-{comp}-glass-blur</code>），未设时回退全局默认。透明度与模糊是两条独立通道；改任一组件不影响其它。</p>
        <div class="row" style="gap:var(--ui-space-4); flex-wrap:wrap; margin-top:var(--ui-space-4); align-items:stretch;">
          <!-- 实时场景 -->
          <div style="flex:1; min-width:280px; position:relative; height:240px; border-radius:var(--ui-radius-lg); overflow:hidden; border:1px solid var(--ui-border); background:linear-gradient(135deg, rgba(82,70,229,.25), rgba(0,184,212,.18) 50%, rgba(229,72,77,.15));">
            <div style="position:absolute; top:0; left:0; right:0; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;
                        background: rgb(var(--ui-glass-tint) / var(--ui-nav-glass-opacity, var(--ui-glass-opacity-strong)));
                        backdrop-filter: blur(var(--ui-nav-glass-blur, var(--ui-glass-blur))) saturate(var(--ui-glass-saturate));
                        -webkit-backdrop-filter: blur(var(--ui-nav-glass-blur, var(--ui-glass-blur))) saturate(var(--ui-glass-saturate));
                        border-bottom:1px solid var(--ui-border);">
              <span class="ui-label">顶栏 Nav</span>
              <button class="ui-btn ui-btn--primary ui-size-sm">按钮</button>
            </div>
            <div class="ui-glass" style="position:absolute; top:56px; left:14px; right:14px; padding:var(--ui-space-4);">
              <div class="ui-label">卡片 Card</div>
              <input class="ui-input" style="margin-top:8px; min-width:0; width:100%;" placeholder="输入框 Input" />
            </div>
            <div class="ui-toast ui-glass" style="position:absolute; right:14px; bottom:14px; transform:none; opacity:1;">
              <span class="ui-avatar" style="width:24px;height:24px;font-size:11px;">✓</span><span>Toast</span>
            </div>
            <span class="ui-tip ui-tip--surface ui-tip--demo" style="position:absolute; left:14px; bottom:52px;">
              <button class="ui-btn ui-btn--ghost ui-size-sm">Tooltip</button>
              <span class="bubble">跟随表面 · 可独立调透明度 / 模糊</span>
            </span>
          </div>
          <!-- 控制面板 -->
          <div style="flex:1; min-width:280px; display:flex; flex-direction:column; gap:var(--ui-space-3);">
            <div class="ui-label" style="font-weight:700;">独立旋钮（拖动只改对应组件）</div>
            <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
              <span style="min-width:3ch;">顶栏</span>
              透 <input type="range" data-comp="nav" data-prop="opacity" data-tier="strong" min="0" max="100" value="28" style="flex:1; accent-color:var(--ui-color-brand);" />
              糊 <input type="range" data-comp="nav" data-prop="blur" min="0" max="40" value="20" style="flex:1; accent-color:var(--ui-color-brand);" />
            </label>
            <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
              <span style="min-width:3ch;">卡片</span>
              透 <input type="range" data-comp="card" data-prop="opacity" data-tier="base" min="0" max="100" value="45" style="flex:1; accent-color:var(--ui-color-brand);" />
              糊 <input type="range" data-comp="card" data-prop="blur" min="0" max="40" value="20" style="flex:1; accent-color:var(--ui-color-brand);" />
            </label>
            <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
              <span style="min-width:3ch;">输入</span>
              透 <input type="range" data-comp="input" data-prop="opacity" data-tier="strong" min="0" max="100" value="28" style="flex:1; accent-color:var(--ui-color-brand);" />
              糊 <input type="range" data-comp="input" data-prop="blur" min="0" max="40" value="20" style="flex:1; accent-color:var(--ui-color-brand);" />
            </label>
            <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
              <span style="min-width:3ch;">Toast</span>
              透 <input type="range" data-comp="toast" data-prop="opacity" data-tier="base" min="0" max="100" value="45" style="flex:1; accent-color:var(--ui-color-brand);" />
              糊 <input type="range" data-comp="toast" data-prop="blur" min="0" max="40" value="20" style="flex:1; accent-color:var(--ui-color-brand);" />
            </label>
            <label class="ui-label" style="display:flex; align-items:center; gap:var(--ui-space-2);">
              <span style="min-width:3ch;">提示</span>
              透 <input type="range" data-comp="tooltip" data-prop="opacity" data-tier="base" min="0" max="100" value="45" style="flex:1; accent-color:var(--ui-color-brand);" />
              糊 <input type="range" data-comp="tooltip" data-prop="blur" min="0" max="40" value="20" style="flex:1; accent-color:var(--ui-color-brand);" />
            </label>
            <p class="ui-label" style="margin-top:var(--ui-space-2);">旋钮写在 <code style="font-family:var(--ui-font-mono);">:root</code> 即改该类型全部实例；写在单个元素 style 上只改那一个实例。两条通道（透明度 / 模糊）互不影响。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="site-footer">
    <span class="brand">uni<span class="dot">·</span>ui</span>
    <span class="ui-label">面向产品的跨框架组件系统 · React 18 + Vue 3 · 视觉由 token 驱动</span>
  </footer>
`;

/**
 * 首页交互绑定（每次渲染首页后调用）：换肤色板、毛玻璃全局旋钮、逐组件独立玻璃旋钮。
 * 仅在传入作用域内查询元素，避免重复绑定。
 */
export function initHome(scope: HTMLElement): void {
  const html = document.documentElement;

  // 多品牌换肤：只覆盖 --ui-color-brand，全站跟随
  scope.querySelectorAll<HTMLElement>('.skin').forEach((btn) => {
    btn.addEventListener('click', () => {
      const brand = btn.dataset.skin!;
      html.style.setProperty('--ui-color-brand', brand);
      scope
        .querySelectorAll('.skin')
        .forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
    });
  });
  // 进入首页时，把色板选中态与当前品牌色对齐（跨路由保持视觉一致）
  const currentBrand = getComputedStyle(html)
    .getPropertyValue('--ui-color-brand')
    .trim();
  if (currentBrand) {
    scope
      .querySelectorAll<HTMLElement>('.skin')
      .forEach((b) =>
        b.setAttribute(
          'aria-pressed',
          b.dataset.skin === currentBrand ? 'true' : 'false',
        ),
      );
  }

  // 毛玻璃全局旋钮：滑块显示“透明度”，写入时反转为 CSS 不透明度
  const glassOp = scope.querySelector<HTMLInputElement>('#glassOp');
  const glassBlur = scope.querySelector<HTMLInputElement>('#glassBlur');
  glassOp?.addEventListener('input', () => {
    const transparency = Number(glassOp.value);
    html.style.setProperty('--ui-glass-opacity', 100 - transparency + '%');
    const out = scope.querySelector('#glassOpVal');
    if (out) out.textContent = transparency + '%';
  });
  glassBlur?.addEventListener('input', () => {
    html.style.setProperty('--ui-glass-blur', glassBlur.value + 'px');
    const out = scope.querySelector('#glassBlurVal');
    if (out) out.textContent = glassBlur.value + 'px';
  });

  // 逐组件独立玻璃控制：透明度滑块显示“透明度”，写入时反转为不透明度
  const setCompGlass = (comp: string, prop: string, val: number) => {
    if (prop === 'opacity') {
      html.style.setProperty(`--ui-${comp}-glass-opacity`, 100 - val + '%');
    } else {
      html.style.setProperty(`--ui-${comp}-glass-blur`, val + 'px');
    }
  };
  scope.querySelectorAll<HTMLInputElement>('[data-comp]').forEach((slider) => {
    const comp = slider.dataset.comp!;
    const prop = slider.dataset.prop!;
    const tier = slider.dataset.tier!;
    let init: number;
    if (prop === 'opacity') {
      const op = parseFloat(
        getComputedStyle(html).getPropertyValue(
          tier === 'strong' ? '--ui-glass-opacity-strong' : '--ui-glass-opacity',
        ),
      );
      init = Math.round(100 - op);
    } else {
      init = parseFloat(
        getComputedStyle(html).getPropertyValue('--ui-glass-blur'),
      );
    }
    slider.value = String(init);
    slider.addEventListener('input', () =>
      setCompGlass(comp, prop, Number(slider.value)),
    );
  });
}
