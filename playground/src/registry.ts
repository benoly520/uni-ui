import { reactDemos } from './react-demos';
import { vueDemos } from './vue-demos';

export interface DemoMeta {
  /** 组件导出名，须与 reactDemos / vueDemos 的 key 一致 */
  id: string;
  label: string;
  category: string;
  desc: string;
}

export const categories: { name: string; items: DemoMeta[] }[] = [
  {
    name: '基础 Basic',
    items: [
      { id: 'Button', label: 'Button 按钮', category: '基础', desc: '主操作 / 毛玻璃 / 禁用' },
      { id: 'Tag', label: 'Tag 标签', category: '基础', desc: '状态 / 分类标签' },
      { id: 'Badge', label: 'Badge 徽标', category: '基础', desc: '计数 / 角标' },
      { id: 'Avatar', label: 'Avatar 头像', category: '基础', desc: '文字 / 图片头像' },
    ],
  },
  {
    name: '输入 Input',
    items: [
      { id: 'Input', label: 'Input 输入框', category: '输入', desc: '单行文本录入' },
      { id: 'Switch', label: 'Switch 开关', category: '输入', desc: '毛玻璃开关' },
      { id: 'Select', label: 'Select 下拉', category: '输入', desc: '单 / 多选 + 搜索' },
      { id: 'NumberInput', label: 'NumberInput 数值', category: '输入', desc: '千分位 / ¥% 金融录入' },
      { id: 'DatePicker', label: 'DatePicker 日期', category: '输入', desc: '单日 / 区间' },
      { id: 'Segmented', label: 'Segmented 分段', category: '输入', desc: '苹果风分段控件' },
      { id: 'Search', label: 'Search 搜索', category: '输入', desc: '联想 + 键盘导航' },
    ],
  },
  {
    name: '展示 Display',
    items: [
      { id: 'Stat', label: 'Stat 指标卡', category: '展示', desc: '涨跌着色' },
      { id: 'Progress', label: 'Progress 进度', category: '展示', desc: '线性进度' },
      { id: 'Skeleton', label: 'Skeleton 骨架', category: '展示', desc: '加载占位' },
      { id: 'Empty', label: 'Empty 空态', category: '展示', desc: '无数据占位' },
    ],
  },
  {
    name: '导航 Nav',
    items: [
      { id: 'Tabs', label: 'Tabs 标签页', category: '导航', desc: '标签切换' },
      { id: 'Breadcrumb', label: 'Breadcrumb 面包屑', category: '导航', desc: '路径导航' },
      { id: 'Steps', label: 'Steps 步骤条', category: '导航', desc: '流程向导' },
      { id: 'Pagination', label: 'Pagination 分页', category: '导航', desc: '翻页' },
    ],
  },
  {
    name: '浮层 Overlay',
    items: [
      { id: 'Tooltip', label: 'Tooltip 提示', category: '浮层', desc: 'hover 提示' },
      { id: 'Popover', label: 'Popover 浮层', category: '浮层', desc: '可交互资料卡' },
      { id: 'Dialog', label: 'Dialog 对话框', category: '浮层', desc: '模态 + 焦点陷阱' },
      { id: 'Drawer', label: 'Drawer 抽屉', category: '浮层', desc: '侧滑面板' },
      { id: 'ContextMenu', label: 'ContextMenu 右键', category: '浮层', desc: '右键菜单' },
    ],
  },
  {
    name: '数据 Data',
    items: [
      { id: 'Tree', label: 'Tree 树', category: '数据', desc: '行业 / 板块层级' },
      { id: 'Slider', label: 'Slider 滑块', category: '数据', desc: '双滑块区间' },
      { id: 'DataTable', label: 'DataTable 表格', category: '数据', desc: '投研紧凑表格' },
    ],
  },
  {
    name: '反馈 Feedback',
    items: [
      { id: 'Toast', label: 'Toast 轻提示', category: '反馈', desc: '命令式 toast()' },
      { id: 'Message', label: 'Message 通知', category: '反馈', desc: '命令式 showMessage()' },
    ],
  },
];

export const allItems: DemoMeta[] = categories.flatMap((c) => c.items);

export { reactDemos, vueDemos };
