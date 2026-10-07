# Slider · DOM 结构契约（slider.dom.md）

> 快照对拍基准。描述既有实现 `src/react/Slider.tsx` / `src/vue/Slider.vue` 真实产出的 DOM（两侧一致）。

## 通用结构

```html
<div class="ui-slider-wrap">
  <div class="ui-slider">
    <div class="ui-slider-track">
      <div class="ui-slider-fill" style="left:..%; width:..%"></div>
      <div class="ui-slider-thumb" data-handle="0" tabindex="0" role="slider"
           aria-valuemin="0" aria-valuemax="60" aria-valuenow="8" aria-label="最小值"
           style="left:..%"></div>
      <div class="ui-slider-thumb" data-handle="1" tabindex="0" role="slider"
           aria-valuemin="0" aria-valuemax="60" aria-valuenow="35" aria-label="最大值"
           style="left:..%"></div>
    </div>
  </div>
  <div class="ui-slider-vals">
    <span class="s-min">8</span>
    <span class="s-max">35</span>
  </div>
</div>
```

## 子元素顺序（对齐预览）
- 根 `ui-slider-wrap` → `ui-slider` → `ui-slider-track`。
- `ui-slider-track` 内：`ui-slider-fill` 居中、`ui-slider-thumb` data-handle="0" 在前、`data-handle="1"` 在后。
- 同级 `ui-slider-vals`（`s-min` / `s-max`）。

## 属性要点
- `role="slider"`、`tabindex="0"`、`aria-valuemin/max/now`、`aria-label` 全部挂在两个 thumb 上。
- `data-handle="0"` 为低值手柄（`minLabel`），`data-handle="1"` 为高值手柄（`maxLabel`）。
- 定位用内联 `style.left`（百分比），`fill` 额外 `style.width`。

## 约束
1. **根 class 为 `ui-slider-wrap`**（非 `ui-slider`）；`ui-slider` 为轨道外层，二者均手写稳定。
2. class 顺序：根 `ui-slider-wrap` 必首位；track 内 `ui-slider-fill` 先于两个 `ui-slider-thumb`。
3. 颜色零硬编码：fill / thumb 描边走 `var(--ui-color-brand)`。
