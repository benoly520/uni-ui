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
