# Tabs · DOM 结构契约（tabs.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-tabs-wrap">
  <button class="ui-tabs-arrow ui-tabs-arrow--left" aria-label="向左滚动标签" type="button"></button>
  <div class="ui-tabs-scroll">
    <div class="ui-tabs" role="tablist" aria-label="标签页">
      <button role="tab" id="tab-KEY" aria-selected="true" aria-controls="panel-KEY" tabindex="0">标签</button>
      <button role="tab" id="tab-KEY2" aria-selected="false" aria-controls="panel-KEY2" tabindex="-1">标签2</button>
      ...
    </div>
  </div>
  <button class="ui-tabs-arrow ui-tabs-arrow--right" aria-label="向右滚动标签" type="button"></button>
</div>
<div class="ui-tabpanel" id="panel-KEY" role="tabpanel" aria-labelledby="tab-KEY">面板内容</div>
<div class="ui-tabpanel" id="panel-KEY2" role="tabpanel" aria-labelledby="tab-KEY2" hidden>面板内容2</div>
```

## 约束
1. `.ui-tabs-wrap` 为可选（横滚时）外层；内部顺序固定：左箭头 → `.ui-tabs-scroll > .ui-tabs[role=tablist]` → 右箭头。
2. tab 按钮必须 `flex:none; white-space:nowrap`（theme.css 已写死），保证不挤压换行。
3. 选中 tab：`aria-selected="true"` + `tabindex="0"`；其余 `aria-selected="false"` + `tabindex="-1"`。
4. 面板紧随 wrap 之后，作为同级兄弟；非激活面板带 `hidden`。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定字符串。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 三标签 | 见上通用结构；首标签 `aria-selected="true" tabindex="0"`，余 `false / -1` |
| 标签过多 | `.ui-tabs-wrap` 内 16 个 `role="tab"`，左右箭头在可滚动时显 `is-visible` |

## 主题缺口（由中央补 theme.css）
- 无（本组件所用 class 规则 theme.css 均已具备：`ui-tabs-wrap/ui-tabs-scroll/ui-tabs-arrow(-left/-right)/.is-visible/ui-tabs[role=tablist]/ui-tabpanel[hidden]`）。
