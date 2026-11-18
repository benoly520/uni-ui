export type ClassValue = string | number | false | null | undefined;

/** 轻量 className 合并：过滤 falsy，空格连接。组件统一用它拼 class，避免手写三元嵌套。 */
export function cx(...parts: ClassValue[]): string {
  return parts.filter(Boolean).join(' ');
}
