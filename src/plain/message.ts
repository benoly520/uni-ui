import { signal, mount } from 'plain';
import { Message, type MessageType } from './Message';

let container: HTMLElement | null = null;
const showS = signal(false);
const contentS = signal<any>('');
const typeS = signal<MessageType>('info');
const glassS = signal(true);
let timer: ReturnType<typeof setTimeout> | null = null;

function ensureMount(): void {
  if (container) return;
  container = document.createElement('div');
  document.body.appendChild(container);
  mount(container, () =>
    Message({
      get show() { return showS(); },
      get type() { return typeS(); },
      get content() { return contentS(); },
      get glass() { return glassS(); },
    }),
  );
}

/**
 * showMessage · 命令式顶部通知（Plain）
 * - 单例容器挂 body，切换 .show 触发入场/退场动画
 * - duration 默认 2600ms，0 不自动关闭；重复调用重置计时器
 * - glass 传 false 可回退为不透明实心面（默认 true）
 * - 与 React / Vue 版 showMessage() 行为一致
 */
export function showMessage(
  text: any,
  type: MessageType = 'info',
  duration = 2600,
  glass = true,
): void {
  contentS.set(text);
  typeS.set(type);
  glassS.set(glass);
  ensureMount();
  showS.set(true);
  if (timer) clearTimeout(timer);
  if (duration > 0) timer = setTimeout(() => showS.set(false), duration);
}
