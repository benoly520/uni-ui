import React from 'react';
import { Button } from 'uni-ui-h5/react';

/** 演示用加号图标：24×24 viewBox + currentColor，尺寸由 .h5-btn__icon 接管。 */
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** React 端用例，顺序与 cases.ts 的 buttonCases 一一对应。 */
export const reactCases: React.FC[] = [
  () => (
    <div className="pg-row">
      <Button>确定</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="outline">描边</Button>
      <Button variant="ghost">文字</Button>
      <Button variant="danger">删除</Button>
    </div>
  ),
  () => (
    <div className="pg-row">
      <Button size="large">大号</Button>
      <Button>默认</Button>
      <Button size="small">小号</Button>
    </div>
  ),
  () => (
    <div className="pg-stack">
      <Button block>通栏按钮</Button>
      <div className="pg-row">
        <Button round>胶囊</Button>
        <Button round variant="outline">
          胶囊描边
        </Button>
      </div>
    </div>
  ),
  () => (
    <div className="pg-row">
      <Button loading>提交中</Button>
      <Button disabled>禁用</Button>
      <Button variant="secondary" icon={<PlusIcon />}>
        带图标
      </Button>
    </div>
  ),
];
