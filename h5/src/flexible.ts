export interface RemOptions {
  /** 设计稿宽度，默认 375 */
  designWidth?: number;
  /** 设计稿宽度对应的根字号，默认 37.5（即 1rem = 37.5px） */
  rootValue?: number;
  /** 最大适配宽度，超过后不再放大，默认 750（平板 / 桌面预览保持合理字号） */
  maxWidth?: number;
}

/**
 * 设置根字号，让 px → rem 的样式随视口等比缩放。
 * 应用启动时调用一次；返回函数用于移除监听（如微前端卸载场景）。
 *
 * ```ts
 * import { setupRem } from 'uni-ui-h5/flexible';
 * setupRem();
 * ```
 */
export function setupRem(options: RemOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const { designWidth = 375, rootValue = 37.5, maxWidth = 750 } = options;
  const root = document.documentElement;

  const apply = () => {
    const viewportWidth = root.clientWidth || window.innerWidth || designWidth;
    const width = Math.min(viewportWidth, maxWidth);
    root.style.fontSize = `${(width / designWidth) * rootValue}px`;
  };

  apply();
  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);
  window.addEventListener('pageshow', apply);

  return () => {
    window.removeEventListener('resize', apply);
    window.removeEventListener('orientationchange', apply);
    window.removeEventListener('pageshow', apply);
  };
}
