import type { FC } from 'react';
import { reactDocs } from './react-demos';
import { vueDocs } from './vue-demos';
import { plainDocs } from './plain-demos';

export interface ApiRow {
  /** 属性 / 事件名 */
  name: string;
  /** TS 类型或事件参数 */
  type: string;
  /** 默认值 */
  default: string;
  /** 一句话说明 */
  desc: string;
}

export interface ComponentDoc {
  /** 组件导出名，须与 reactDocs / vueDocs 的 key 一致 */
  id: string;
  label: string;
  category: string;
  /** 组件整体简介（一句话） */
  summary: string;
  /** Props / 事件速查表 */
  api: ApiRow[];
  /**
   * 页头 import 提示的覆盖文案。
   * 仅用于「非组件条目」（如 Icon 契约页），缺省按 `import { <id> } from 'uni-ui/react'` 生成。
   */
  importHint?: string;
}

/** 合并后的单个用例：标题 / 说明 + React/Vue/Plain 实时 demo + 可复制代码 */
export interface FullCase {
  title: string;
  desc: string;
  reactCode: string;
  vueCode: string;
  plainCode: string;
  reactComp: FC;
  vueComp: unknown;
  plainComp: unknown;
}

/**
 * 每个组件的简介与 API 速查表（title/desc/代码在 react-demos、vue-demos 中）。
 * 顺序与 reactDocs / vueDocs 的 key 对齐即可。
 */
export const docs: ComponentDoc[] = [
  {
    id: 'Button',
    label: 'Button 按钮',
    category: '基础',
    summary: '承载主操作与次要操作的点击控件，支持语义变体、尺寸、胶囊、加载与图标。',
    api: [
      { name: 'variant', type: "'primary' | 'default' | 'ghost' | 'outline' | 'danger'", default: "'default'", desc: '语义变体，决定颜色与强调程度（三端一致）' },
      { name: 'size', type: "'lg' | 'md' | 'sm' | 'xs'", default: "'md'", desc: '尺寸修饰' },
      { name: 'pill', type: 'boolean', default: 'false', desc: '胶囊形状，可叠加任意变体' },
      { name: 'loading', type: 'boolean', default: 'false', desc: '文字透明 + spinner，禁用点击' },
      { name: 'icon', type: 'ReactNode', default: '—', desc: '前置 24×24 图标' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '原生禁用' },
      { name: 'onClick', type: '(e: MouseEvent) => void', default: '—', desc: '点击事件（React）/ @click（Vue）' },
    ],
  },
  {
    id: 'Tag',
    label: 'Tag 标签',
    category: '基础',
    summary: '用于标记状态、分类或属性的小标签，支持语义类型、可关闭与自定义色。',
    api: [
      { name: 'type', type: "'brand' | 'up' | 'down' | 'default'", default: "'default'", desc: '语义类型，决定底色' },
      { name: 'closable', type: 'boolean', default: 'false', desc: '渲染关闭按钮' },
      { name: 'color', type: 'string', default: '—', desc: '自定义色，覆盖 type' },
      { name: 'icon', type: 'ReactNode', default: '—', desc: '前置图标' },
      { name: 'onClose', type: '() => void', default: '—', desc: '关闭时回调（React）/ @close（Vue）' },
    ],
  },
  {
    id: 'Badge',
    label: 'Badge 徽标',
    category: '基础',
    summary: '附着在头像、按钮等元素角落的状态指示，支持计数、圆点与最大值截断。',
    api: [
      { name: 'tone', type: "'brand' | 'danger' | 'success' | 'warning' | 'info'", default: "'brand'", desc: '语义色' },
      { name: 'count', type: 'number', default: '—', desc: '计数值，配合 max 截断为 99+' },
      { name: 'max', type: 'number', default: '99', desc: '计数截断阈值' },
      { name: 'dot', type: 'boolean', default: 'false', desc: '前置状态圆点' },
      { name: 'showZero', type: 'boolean', default: 'false', desc: 'count 为 0 时是否仍渲染' },
    ],
  },
  {
    id: 'Avatar',
    label: 'Avatar 头像',
    category: '基础',
    summary: '展示用户或标的头像，支持文字、图片、图标三种来源与多种尺寸/语义色。',
    api: [
      { name: 'src', type: 'string', default: '—', desc: '图片地址，存在时忽略 text/icon' },
      { name: 'text', type: 'string', default: '—', desc: '文字头像' },
      { name: 'icon', type: 'ReactNode', default: '—', desc: '图标头像' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | number", default: "'md'", desc: '预设档 24/28/32/40px 或自定义像素' },
      { name: 'tone', type: "'brand' | 'danger' | 'success' | 'warning' | 'info'", default: "'brand'", desc: '文字/图标底色' },
    ],
  },
  {
    id: 'Input',
    label: 'Input 输入框',
    category: '输入',
    summary: '单行文本录入，支持尺寸、禁用、错误态、前后缀图标与原生属性透传。',
    api: [
      { name: 'value', type: 'string', default: '—', desc: '受控值' },
      { name: 'defaultValue', type: 'string', default: '—', desc: '非受控初始值' },
      { name: 'size', type: "'lg' | 'md' | 'sm' | 'xs'", default: "'md'", desc: '尺寸修饰' },
      { name: 'error', type: 'boolean', default: 'false', desc: '错误态（danger 描边）' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      { name: 'prefix / suffix', type: 'ReactNode', default: '—', desc: '前导/后导装饰图标' },
      { name: 'onChange', type: '(value: string, e) => void', default: '—', desc: '输入变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Switch',
    label: 'Switch 开关',
    category: '输入',
    summary: '二元状态切换控件，毛玻璃质感，支持受控/非受控、尺寸与无障碍标签。',
    api: [
      { name: 'checked', type: 'boolean', default: '—', desc: '受控开/关' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', desc: '非受控初始值' },
      { name: 'size', type: "'lg' | 'md' | 'sm' | 'xs'", default: "'md'", desc: '尺寸修饰' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      { name: 'label', type: 'string', default: '—', desc: '无障碍标签（role=switch）' },
      { name: 'onChange', type: '(checked: boolean) => void', default: '—', desc: '状态变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Select',
    label: 'Select 下拉',
    category: '输入',
    summary: '单/多选下拉，支持搜索过滤、禁用项与受控/非受控值，点击外部/Esc 关闭。',
    api: [
      { name: 'options', type: 'SelectOption[]', default: '—', desc: '{ label, value, disabled? }' },
      { name: 'value', type: 'string | string[]', default: '—', desc: '受控：单选 string / 多选 string[]' },
      { name: 'multiple', type: 'boolean', default: 'false', desc: '多选' },
      { name: 'searchable', type: 'boolean', default: 'false', desc: '搜索过滤' },
      { name: 'placeholder', type: 'string', default: "'请选择'", desc: '占位文案' },
      { name: 'onChange', type: '(value, option) => void', default: '—', desc: '选中变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'NumberInput',
    label: 'NumberInput 数值',
    category: '输入',
    summary: '金融场景的数值录入，支持千分位、前缀/后缀符号、精度与上下限钳制。',
    api: [
      { name: 'min / max', type: 'number', default: '-∞ / ∞', desc: '下限/上限钳制' },
      { name: 'step', type: 'number', default: '1', desc: '步进增量' },
      { name: 'precision', type: 'number', default: '0', desc: '小数位（千分位 + 定点）' },
      { name: 'prefix / suffix', type: 'string', default: '—', desc: '前置/后置符号（如 ¥ / %）' },
      { name: 'defaultValue', type: 'number', default: '0', desc: '非受控初始值' },
      { name: 'onChange', type: '(value: number) => void', default: '—', desc: '数值变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'DatePicker',
    label: 'DatePicker 日期',
    category: '输入',
    summary: '单日或区间日期选择，周一起始、上下月导航，区间模式选满两日才回调。',
    api: [
      { name: 'range', type: 'boolean', default: 'false', desc: '范围模式（选起止两日）' },
      { name: 'value', type: "string | [string, string] | null", default: '—', desc: "受控值，单日 'YYYY-MM-DD'，范围 [起, 止]" },
      { name: 'defaultValue', type: '同上', default: 'null', desc: '非受控初始值' },
      { name: 'placeholder', type: 'string', default: "单日'选择日期'/范围'选择日期区间'", desc: '占位文案' },
      { name: 'onChange', type: '(value) => void', default: '—', desc: '选中变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Segmented',
    label: 'Segmented 分段',
    category: '输入',
    summary: '苹果风分段控件，滑块跟随选中项平滑移动，支持尺寸与整组禁用。',
    api: [
      { name: 'options', type: 'SegmentedOption[]', default: '—', desc: '{ label, value, disabled? }' },
      { name: 'value', type: 'string | number', default: '—', desc: '受控选中值' },
      { name: 'defaultValue', type: 'string | number', default: '首项 value', desc: '非受控初始值' },
      { name: 'size', type: "'lg' | 'md' | 'sm' | 'xs'", default: "'md'", desc: '尺寸修饰' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '整组禁用' },
      { name: 'onChange', type: '(value) => void', default: '—', desc: '选中变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Search',
    label: 'Search 搜索',
    category: '输入',
    summary: '带联想列表的搜索框，支持键盘上下导航、回车确认与标的代码/标签展示。',
    api: [
      { name: 'options', type: 'SearchOption[]', default: '[]', desc: '{ label, value, code?, tag? }' },
      { name: 'value', type: 'string', default: '—', desc: '受控值' },
      { name: 'placeholder', type: 'string', default: "'搜索…'", desc: '占位文案' },
      { name: 'onChange', type: '(value: string) => void', default: '—', desc: '输入变更（React）/ @change（Vue）' },
      { name: 'onSelect', type: '(option) => void', default: '—', desc: '选中联想项（React）/ @select（Vue）' },
    ],
  },
  {
    id: 'Form',
    label: 'Form 表单',
    category: '输入',
    summary: '栅格化表单 + 字段校验，提交时逐字段校验并把错误写到行内提示。',
    api: [
      { name: 'fields', type: 'FormField[]', default: '—', desc: '{ name, label, type?, placeholder?, defaultValue?, rules? }' },
      { name: 'grid', type: 'boolean', default: 'true', desc: '字段栅格布局' },
      { name: 'submitText', type: 'string', default: "'提交'", desc: '提交按钮文案' },
      { name: 'idPrefix', type: 'string', default: '—', desc: '字段 id 命名空间前缀，同页多表单需传唯一值' },
      { name: 'rules', type: 'FormRule[]', default: '—', desc: '{ required?, pattern?, min?, message? }，命中首条规则即报错' },
      { name: 'onSubmit', type: '(values: Record<string, string>) => void', default: '—', desc: '校验通过回调（React）/ @submit（Vue）' },
    ],
  },
  {
    id: 'Stat',
    label: 'Stat 指标卡',
    category: '展示',
    summary: '行情/指标展示卡，主值等宽数字，涨跌着色跟随全局涨跌色约定。',
    api: [
      { name: 'label', type: 'string', default: '—', desc: '指标名' },
      { name: 'value', type: 'string | number', default: '—', desc: '主值' },
      { name: 'prefix / suffix', type: 'string', default: '—', desc: '前后缀（如 ¥ / 亿）' },
      { name: 'delta', type: 'string', default: '—', desc: '涨跌文案' },
      { name: 'trend', type: "'up' | 'down' | 'muted'", default: '—', desc: '涨跌着色（muted 为灰）' },
    ],
  },
  {
    id: 'Progress',
    label: 'Progress 进度',
    category: '展示',
    summary: '线性进度条，支持确定值与不确定（加载）态，带 progressbar 语义。',
    api: [
      { name: 'value', type: 'number', default: '0', desc: '当前进度' },
      { name: 'max', type: 'number', default: '100', desc: '满值' },
      { name: 'indeterminate', type: 'boolean', default: 'false', desc: '不确定态（无具体进度）' },
    ],
  },
  {
    id: 'Skeleton',
    label: 'Skeleton 骨架',
    category: '展示',
    summary: '加载占位骨架，支持文本/圆形/矩形形状、自定义尺寸与微光动画。',
    api: [
      { name: 'shape', type: "'text' | 'circle' | 'rect'", default: "'rect'", desc: '占位形状' },
      { name: 'width / height', type: 'string | number', default: '—', desc: '尺寸（数字转 px）' },
      { name: 'active', type: 'boolean', default: 'true', desc: '是否显示微光动画' },
    ],
  },
  {
    id: 'Empty',
    label: 'Empty 空态',
    category: '展示',
    summary: '无数据占位，支持自定义描述文案、图标与操作插槽。',
    api: [
      { name: 'description', type: 'ReactNode / string', default: '—', desc: '空状态描述文案' },
      { name: 'icon', type: 'ReactNode', default: '内置 table', desc: '图标插槽（默认内置 table 内联 SVG，可覆盖）' },
      { name: 'children / 默认插槽', type: '—', default: '—', desc: '操作区插槽' },
    ],
  },
  {
    id: 'Accordion',
    label: 'Accordion 折叠面板',
    category: '展示',
    summary: '分组折叠面板，多组可同时展开，支持受控/非受控展开键与 max-height 过渡。',
    api: [
      { name: 'items', type: 'AccordionItem[]', default: '—', desc: '{ key, title, badge?, content? }' },
      { name: 'activeKeys', type: 'string[]', default: '—', desc: '受控展开的 key 列表' },
      { name: 'defaultActiveKeys', type: 'string[]', default: '[]', desc: '非受控初始展开' },
      { name: 'onChange', type: '(keys: string[]) => void', default: '—', desc: '展开集合变化（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Tabs',
    label: 'Tabs 标签页',
    category: '导航',
    summary: '标签切换容器，支持受控/非受控、横向滚动与方向键导航。',
    api: [
      { name: 'items', type: 'TabItem[]', default: '—', desc: '{ key, label, content }' },
      { name: 'value', type: 'string', default: '—', desc: '受控选中 key' },
      { name: 'defaultValue', type: 'string', default: '首项 key', desc: '非受控初始' },
      { name: 'ariaLabel', type: 'string', default: "'标签页'", desc: 'tablist 无障碍标签' },
      { name: 'onChange', type: '(key: string) => void', default: '—', desc: '切换回调（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Breadcrumb',
    label: 'Breadcrumb 面包屑',
    category: '导航',
    summary: '路径导航，末项自动标记为当前页，支持自定义分隔符。',
    api: [
      { name: 'items', type: 'BreadcrumbItem[]', default: '—', desc: '{ label, href? }' },
      { name: 'separator', type: 'ReactNode / string', default: "'/'", desc: '分隔符' },
      { name: 'ariaLabel', type: 'string', default: "'路径导航'", desc: '根 nav 标签' },
    ],
  },
  {
    id: 'Steps',
    label: 'Steps 步骤条',
    category: '导航',
    summary: '流程向导，已完成步实心品牌色 + check，当前步高亮，可点击跳转。',
    api: [
      { name: 'steps', type: 'StepItem[]', default: '—', desc: '{ title, desc? }' },
      { name: 'current', type: 'number', default: '—', desc: '受控当前步索引' },
      { name: 'defaultCurrent', type: 'number', default: '0', desc: '非受控初始' },
      { name: 'clickable', type: 'boolean', default: 'true', desc: '点击步骤重算并回调' },
      { name: 'onChange', type: '(index: number) => void', default: '—', desc: '步骤变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Pagination',
    label: 'Pagination 分页',
    category: '导航',
    summary: '数据分页，支持受控/非受控、省略号与相邻页码数配置。',
    api: [
      { name: 'total', type: 'number', default: '—', desc: '总条目数' },
      { name: 'pageSize', type: 'number', default: '10', desc: '每页条目数' },
      { name: 'page', type: 'number', default: '—', desc: '受控当前页（1-based）' },
      { name: 'defaultPage', type: 'number', default: '1', desc: '非受控初始' },
      { name: 'siblingCount', type: 'number', default: '1', desc: '当前页两侧保留页码数' },
      { name: 'onChange', type: '(page: number) => void', default: '—', desc: '翻页回调（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'Tooltip',
    label: 'Tooltip 提示',
    category: '浮层',
    summary: '轻量 hover/focus 提示气泡，支持 invert/surface 两种变体与延迟显示。',
    api: [
      { name: 'content', type: 'ReactNode / 插槽', default: '—', desc: '气泡内容' },
      { name: 'variant', type: "'invert' | 'surface'", default: "'invert'", desc: 'invert=反转色；surface=跟随主题表面' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", desc: '方位（top 已完备支持）' },
      { name: 'delay', type: 'number', default: '0', desc: '显示延迟 (ms)' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用提示' },
      { name: 'onOpenChange', type: '(open) => void', default: '—', desc: '显隐变更（React）/ @open-change（Vue）' },
    ],
  },
  {
    id: 'Popover',
    label: 'Popover 浮层',
    category: '浮层',
    summary: '可承载可交互内容的浮层，区别于 Tooltip，面板内按钮可点击。',
    api: [
      { name: 'content', type: 'ReactNode / 插槽', default: '—', desc: '面板内容（可含交互元素）' },
      { name: 'open', type: 'boolean', default: '—', desc: '受控显示' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', desc: '非受控初始' },
      { name: 'ariaLabel', type: 'string', default: "'Popover'", desc: '面板无障碍标签' },
      { name: 'onOpenChange', type: '(open) => void', default: '—', desc: '显隐变更（React）/ @open-change（Vue）' },
    ],
  },
  {
    id: 'Dialog',
    label: 'Dialog 对话框',
    category: '浮层',
    summary: '模态对话框，内置焦点陷阱、Esc / 点遮罩关闭，open 为必填受控。',
    api: [
      { name: 'open', type: 'boolean', default: '必填', desc: '受控打开状态' },
      { name: 'title', type: 'ReactNode', default: '—', desc: '标题' },
      { name: 'footer', type: 'ReactNode / 插槽', default: '—', desc: '底部操作区' },
      { name: 'closeOnOverlay', type: 'boolean', default: 'true', desc: '点击遮罩是否关闭' },
      { name: 'onOpenChange', type: '(open) => void', default: '—', desc: '显隐变更（React）/ @open-change（Vue）' },
    ],
  },
  {
    id: 'Drawer',
    label: 'Drawer 抽屉',
    category: '浮层',
    summary: '侧滑/底部抽屉面板，承载复杂筛选或表单，焦点陷阱同 Dialog。',
    api: [
      { name: 'open', type: 'boolean', default: '必填', desc: '受控打开状态' },
      { name: 'side', type: "'right' | 'left' | 'bottom'", default: "'right'", desc: '滑出方向' },
      { name: 'title / subtitle', type: 'ReactNode', default: '—', desc: '标题 / 副标题' },
      { name: 'showClose', type: 'boolean', default: 'true', desc: '是否显示关闭按钮' },
      { name: 'closeOnOverlay', type: 'boolean', default: 'true', desc: '点击遮罩是否关闭' },
      { name: 'onOpenChange', type: '(open) => void', default: '—', desc: '显隐变更（React）/ @open-change（Vue）' },
    ],
  },
  {
    id: 'ContextMenu',
    label: 'ContextMenu 右键',
    category: '浮层',
    summary: '右键光标处唤出的上下文菜单，近边缘自动翻转，支持快捷键与危险项。',
    api: [
      { name: 'items', type: 'ContextMenuItem[]', default: '—', desc: '{ key, label, shortcut?, danger?, separator? }' },
      { name: 'targetRef', type: 'Ref<HTMLElement>', default: '—', desc: '右键触发目标' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', desc: '非受控初始' },
      { name: 'onSelect', type: '(key: string) => void', default: '—', desc: '菜单项选中（React）/ @select（Vue）' },
      { name: 'onOpenChange', type: '(open) => void', default: '—', desc: '显隐变更（React）/ @open-change（Vue）' },
    ],
  },
  {
    id: 'Tree',
    label: 'Tree 树',
    category: '数据',
    summary: '层级数据展示，支持勾选、默认展开/勾选、受控展开与勾选键。',
    api: [
      { name: 'data', type: 'TreeData[]', default: '—', desc: '{ key, label, count?, children? }' },
      { name: 'checkable', type: 'boolean', default: 'true', desc: '是否显示勾选框' },
      { name: 'defaultExpandedKeys', type: 'string[]', default: '父节点', desc: '非受控默认展开' },
      { name: 'defaultCheckedKeys', type: 'string[]', default: '[]', desc: '非受控默认勾选' },
      { name: 'onExpand', type: '(keys, info) => void', default: '—', desc: '展开变更（React）/ @expand（Vue）' },
      { name: 'onCheck', type: '(keys, info) => void', default: '—', desc: '勾选变更（React）/ @check（Vue）' },
    ],
  },
  {
    id: 'Slider',
    label: 'Slider 滑块',
    category: '数据',
    summary: '双滑块区间选择器，支持拖拽、键盘微调、格式化显示与边界约束。',
    api: [
      { name: 'min / max', type: 'number', default: '0 / 100', desc: '下限/上限' },
      { name: 'step', type: 'number', default: '1', desc: '步进' },
      { name: 'value', type: '[number, number]', default: '—', desc: '受控值 [低, 高]' },
      { name: 'defaultValue', type: '[number, number]', default: '[min, max]', desc: '非受控默认' },
      { name: 'format', type: "'pct' | 'num' | (v) => string", default: "'num'", desc: '显示格式' },
      { name: 'onChange', type: '(value) => void', default: '—', desc: '值变更（React）/ @change（Vue）' },
    ],
  },
  {
    id: 'DataTable',
    label: 'DataTable 表格',
    category: '数据',
    summary: '投研紧凑表格，支持数值右对齐涨跌着色、冻结列、排序与行多选。',
    api: [
      { name: 'columns', type: 'DataTableColumn[]', default: '—', desc: '{ key, title, numeric?, sortable?, sticky?, render? }' },
      { name: 'data', type: 'Record<string, any>[]', default: '—', desc: '行数据' },
      { name: 'compact', type: 'boolean', default: 'false', desc: '紧凑密度' },
      { name: 'selectable', type: 'boolean', default: 'false', desc: '行多选 + 表头全选' },
      { name: 'rowKey', type: 'string', default: "'id'", desc: '行标识键' },
      { name: 'onSort', type: '(key, dir) => void', default: '—', desc: '排序回调（React）/ @sort（Vue）' },
      { name: 'onSelect', type: '(keys) => void', default: '—', desc: '选中回调（React）/ @select（Vue）' },
    ],
  },
  {
    id: 'VirtualTable',
    label: 'VirtualTable 虚拟表格',
    category: '数据',
    summary: '固定行高的虚拟滚动表，仅渲染可视窗口，5000 行也只保留约 20 个行节点。',
    api: [
      { name: 'rows', type: 'Record<string, any>[]', default: '—', desc: '行数据（支持 5000+ 行）' },
      { name: 'columns', type: 'VTableColumn[]', default: '—', desc: '{ key, title, numeric?, sticky?, trend?, width? }' },
      { name: 'rowHeight', type: 'number', default: '33', desc: '固定行高（px），窗口化基准' },
      { name: 'buffer', type: 'number', default: '6', desc: '上下缓冲行数，防白屏' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '滚动容器无障碍标签' },
    ],
  },
  {
    id: 'Toast',
    label: 'Toast 轻提示',
    category: '反馈',
    summary: '命令式轻提示，单例容器挂 body，支持图标、时长与重复调用重置计时。',
    api: [
      { name: "toast(content, options?)", type: '(content, options?) => void', default: '—', desc: '命令式入口' },
      { name: 'options.icon', type: 'ReactNode', default: '—', desc: '前置图标' },
      { name: 'options.duration', type: 'number', default: '2400', desc: '自动关闭时长（0=常驻）' },
    ],
  },
  {
    id: 'Message',
    label: 'Message 通知',
    category: '反馈',
    summary: '命令式通知条，支持 success/warning/info/danger 四种语义类型。',
    api: [
      { name: 'showMessage(text, type?, duration?)', type: '(text, type?, duration?) => void', default: '—', desc: '命令式入口' },
      { name: 'type', type: "'success' | 'warning' | 'info' | 'danger'", default: "'info'", desc: '语义类型' },
      { name: 'duration', type: 'number', default: '2600', desc: '自动关闭时长（0=常驻）' },
    ],
  },
  {
    id: 'Icon',
    label: 'Icon 图标',
    category: '基础',
    summary: '组件不内置图标库：只内置少量「状态驱动」的内联 SVG，其余图标一律由使用方经 icon 插槽传入。',
    importHint: '无 Icon 组件导出 · 图标统一经 `icon` 插槽传入，契约见 contracts/icon.md',
    api: [
      { name: 'icon', type: 'ReactNode', default: '—', desc: '传节点：<Button icon={<Plus />}>（React）/ 传组件或 VNode，内部以 <component :is="icon" /> 渲染（Vue）' },
      { name: 'icon（Plain）', type: 'Renderable | (() => Renderable)', default: '—', desc: '传「调用子组件」的结果或返回节点的函数，如 icon={PlusIcon()}' },
      { name: '插槽契约', type: '—', default: '—', desc: '24×24 viewBox + stroke/fill="currentColor"，零图标库运行时' },
      { name: '尺寸', type: '—', default: '--ui-icon-size', desc: '由 .ui-icon 容器决定并随 .ui-size-* 档位缩放，svg 自身不写 width/height' },
      { name: '颜色', type: '—', default: 'currentColor', desc: '继承文字色，无需额外传色值' },
      { name: '内置图标', type: '—', default: '7 个', desc: 'chevron-down / chevron-left / chevron-right / check / search / calendar / table；状态驱动，不可替换' },
      { name: '推荐图标库', type: '—', default: 'lucide', desc: 'React 用 lucide-react、Vue 用 lucide-vue-next，务必具名按需导入以免破坏 tree-shaking' },
    ],
  },
];

/** 左侧分组（与旧结构保持一致，仅保留导航所需） */
export const categories: { name: string; items: { id: string; label: string }[] }[] = [
  { name: '基础 Basic', items: [
    { id: 'Button', label: 'Button 按钮' },
    { id: 'Tag', label: 'Tag 标签' },
    { id: 'Badge', label: 'Badge 徽标' },
    { id: 'Avatar', label: 'Avatar 头像' },
    { id: 'Icon', label: 'Icon 图标' },
  ] },
  { name: '输入 Input', items: [
    { id: 'Input', label: 'Input 输入框' },
    { id: 'Switch', label: 'Switch 开关' },
    { id: 'Select', label: 'Select 下拉' },
    { id: 'NumberInput', label: 'NumberInput 数值' },
    { id: 'DatePicker', label: 'DatePicker 日期' },
    { id: 'Segmented', label: 'Segmented 分段' },
    { id: 'Search', label: 'Search 搜索' },
    { id: 'Form', label: 'Form 表单' },
  ] },
  { name: '展示 Display', items: [
    { id: 'Stat', label: 'Stat 指标卡' },
    { id: 'Progress', label: 'Progress 进度' },
    { id: 'Skeleton', label: 'Skeleton 骨架' },
    { id: 'Empty', label: 'Empty 空态' },
    { id: 'Accordion', label: 'Accordion 折叠面板' },
  ] },
  { name: '导航 Nav', items: [
    { id: 'Tabs', label: 'Tabs 标签页' },
    { id: 'Breadcrumb', label: 'Breadcrumb 面包屑' },
    { id: 'Steps', label: 'Steps 步骤条' },
    { id: 'Pagination', label: 'Pagination 分页' },
  ] },
  { name: '浮层 Overlay', items: [
    { id: 'Tooltip', label: 'Tooltip 提示' },
    { id: 'Popover', label: 'Popover 浮层' },
    { id: 'Dialog', label: 'Dialog 对话框' },
    { id: 'Drawer', label: 'Drawer 抽屉' },
    { id: 'ContextMenu', label: 'ContextMenu 右键' },
  ] },
  { name: '数据 Data', items: [
    { id: 'Tree', label: 'Tree 树' },
    { id: 'Slider', label: 'Slider 滑块' },
    { id: 'DataTable', label: 'DataTable 表格' },
    { id: 'VirtualTable', label: 'VirtualTable 虚拟表格' },
  ] },
  { name: '反馈 Feedback', items: [
    { id: 'Toast', label: 'Toast 轻提示' },
    { id: 'Message', label: 'Message 通知' },
  ] },
];

export const allItems: { id: string; label: string }[] = categories.flatMap((c) => c.items);

export function getDoc(id: string): ComponentDoc | undefined {
  return docs.find((d) => d.id === id);
}

/**
 * 合并 React 与 Vue 用例为完整用例列表。
 * reactDocs[id] 提供 title/desc/reactCode/reactComp；vueDocs[id] 按相同顺序提供 vueCode/vueComp。
 */
/**
 * 合并 React / Vue / Plain 用例为完整用例列表。
 * reactDocs[id] 提供 title/desc/reactCode/reactComp；vueDocs / plainDocs 按相同顺序提供对应实现。
 */
export function getCases(id: string): FullCase[] {
  const r = reactDocs[id] ?? [];
  const v = vueDocs[id] ?? [];
  const p = plainDocs[id] ?? [];
  const n = Math.max(r.length, v.length, p.length);
  return Array.from({ length: n }, (_, i) => ({
    title: r[i]?.title ?? p[i]?.title ?? '',
    desc: r[i]?.desc ?? p[i]?.desc ?? '',
    reactCode: r[i]?.code ?? '',
    vueCode: v[i]?.code ?? '',
    plainCode: p[i]?.code ?? '',
    reactComp: r[i]?.Comp ?? (() => null),
    vueComp: v[i]?.Comp ?? null,
    plainComp: p[i]?.Comp ?? null,
  }));
}
