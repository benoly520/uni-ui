import { Button } from 'uni-ui-h5/plain';

/**
 * Plain 端用例，顺序与 cases.ts 的 buttonCases 一一对应。
 * 视图由 plain/vite 编译为直接 DOM。
 * 注意：plain 编译器只识别组件函数体中的 JSX，因此每个用例单独声明为函数，
 * 不能写成数组字面量里的内联箭头函数。
 */
function Variants() {
  return (
    <div class="pg-row">
      <Button>确定</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="outline">描边</Button>
      <Button variant="ghost">文字</Button>
      <Button variant="danger">删除</Button>
    </div>
  );
}

function Sizes() {
  return (
    <div class="pg-row">
      <Button size="large">大号</Button>
      <Button>默认</Button>
      <Button size="small">小号</Button>
    </div>
  );
}

function Shapes() {
  return (
    <div class="pg-stack">
      <Button block>通栏按钮</Button>
      <div class="pg-row">
        <Button round>胶囊</Button>
        <Button round variant="outline">
          胶囊描边
        </Button>
      </div>
    </div>
  );
}

function States() {
  return (
    <div class="pg-row">
      <Button loading>提交中</Button>
      <Button disabled>禁用</Button>
      <Button variant="secondary" icon="＋">
        带图标
      </Button>
    </div>
  );
}

export const plainCases: Array<() => any> = [Variants, Sizes, Shapes, States];
