/**
 * Plain 组件共享层（编译版）。
 * 仅保留类型别名与 cx 透传；视图一律用 plain 的 JSX 编写，由 plain 编译器编译为直接 DOM。
 *
 * 规则（对照 plain 契约 lint）：
 * - 不解构 props（PLAIN_E1105）；一律用 resolve(props.x) 读取，默认值的写法包成 thunk：
 *   `const variant = () => resolve(props.variant) ?? 'default'`。
 * - 不快照 props（PLAIN_E1112）；不要把 props 取值存进变量，在会重跑的上下文里 resolve。
 * - 不 resolve on* 事件 prop（PLAIN_E1108）；事件 prop 编译器不包 getter，直接 props.onXxx(...)。
 * - 不用 JSX 属性展开（PLAIN_E1008 编译期硬错）；透传属性显式列出。
 */
import { cx as cxFn } from '../utils/cx';
import type { Renderable } from 'plain';

export const cx = cxFn;

/**
 * 可传「值」或「取值函数」的响应式入参。
 * plain 的 JSX 内建属性用的是同语义的 JSX.MayGetter<T>，这里作为组件 props 的模块级别名，
 * 方便在组件 Props 接口里书写。
 */
export type MaybeGetter<T> = T | (() => T);

export type { Renderable };

/** 布尔属性 -> '' | undefined（约定：真返回空串使属性生效，假返回 undefined 不渲染） */
export function numAttr(b: any): string | undefined {
  return b ? '' : undefined;
}

/**
 * 纯布尔 HTML 属性（hidden / disabled 等）的取值：真 -> ''（渲染成 `hidden=""`，与 React 一致），
 * 假 -> undefined（不渲染）。返回类型放宽为 any 是为了能直接喂给 JSX 的布尔属性位。
 */
export function boolAttr(b: boolean): any {
  return b ? '' : undefined;
}

/**
 * 合并内联样式：base 为组件计算值，extra 为外部传入的 style。
 * 注意：plain 编译器的 style 属性只接受「对象或字符串」的求值结果，
 * **不接受取值函数**（`style={() => ({...})}` 会被静默丢弃），
 * 而属性表达式本身就在 effect 内求值，因此这里直接用对象即可保持响应式。
 * extra 为字符串时无法与组件计算值合并，按对象语义忽略（与 React 端 CSSProperties 一致）。
 */
export function mergeStyle(
  base: Record<string, any>,
  extra?: string | Record<string, any>,
): Record<string, any> {
  if (!extra || typeof extra === 'string') return base;
  return { ...base, ...extra };
}
