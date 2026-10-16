import React, { useState, useRef } from 'react';
import {
  Button,
  Tag,
  Badge,
  Avatar,
  Accordion,
  Input,
  Switch,
  Select,
  NumberInput,
  DatePicker,
  Segmented,
  Search,
  Stat,
  Progress,
  Skeleton,
  Empty,
  Form,
  Tabs,
  Breadcrumb,
  Steps,
  Pagination,
  Tooltip,
  Popover,
  Dialog,
  Drawer,
  ContextMenu,
  Tree,
  Slider,
  DataTable,
  VirtualTable,
  toast,
  showMessage,
} from 'uni-ui/react';
import type { AccordionItemData, FormField, VTableColumn } from 'uni-ui/react';

/** 单个用例：标题 + 说明 + React 代码片段 + 实时 demo 组件（title/desc/code 为单一来源） */
export interface DemoCase {
  title: string;
  desc: string;
  code: string;
  Comp: React.FC;
}

const treeData = [
  {
    key: '1',
    label: '金融',
    count: 128,
    children: [
      { key: '1-1', label: '银行', count: 42 },
      { key: '1-2', label: '券商', count: 51 },
      { key: '1-3', label: '保险', count: 35 },
    ],
  },
  {
    key: '2',
    label: '消费',
    count: 86,
    children: [
      { key: '2-1', label: '白酒', count: 19 },
      { key: '2-2', label: '家电', count: 67 },
    ],
  },
];

const tableColumns = [
  { key: 'name', title: '名称', sticky: true },
  { key: 'code', title: '代码', numeric: true },
  { key: 'price', title: '最新价', numeric: true, sortable: true },
  { key: 'chg', title: '涨跌幅', numeric: true },
];
const tableData = [
  { name: '贵州茅台', code: '600519', price: 1685.2, chg: '+1.24%' },
  { name: '宁德时代', code: '300750', price: 241.8, chg: '-0.86%' },
  { name: '招商银行', code: '600036', price: 38.42, chg: '+0.31%' },
];

const accordionItems: AccordionItemData[] = [
  { key: '1', title: '行业研究', badge: '12', content: '覆盖 31 个申万一级行业。' },
  { key: '2', title: '个股追踪', content: '实时跟踪持仓标的异动。' },
  { key: '3', title: '风险提示', content: '市场有风险，投资需谨慎。' },
];

const formFields: FormField[] = [
  {
    name: 'name',
    label: '标的名称',
    placeholder: '如：贵州茅台',
    rules: [{ required: true, message: '请输入标的名称' }],
  },
  {
    name: 'code',
    label: '标的代码',
    placeholder: '6 位数字',
    rules: [{ pattern: /^\d{6}$/, message: '需为 6 位数字' }],
  },
];

const vtableColumns: VTableColumn[] = [
  { key: 'code', title: '代码', sticky: true, width: '120px' },
  { key: 'name', title: '名称', width: '1fr' },
  {
    key: 'price',
    title: '最新价',
    numeric: true,
    width: '100px',
    trend: (row) => (row.price > 0 ? 'up' : 'down'),
  },
];
const vtableRows = Array.from({ length: 5000 }, (_, i) => ({
  code: 'GN' + (1000 + i),
  name: '标的 ' + i,
  price: (i % 3) - 1,
}));

/** 演示用「自备图标」：24×24 viewBox + currentColor，形状与 lucide `plus` / `star` / `search` 一致 */
const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const StarIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 3l2.7 6.3 6.8.6-5.2 4.5 1.6 6.6L12 17.4 6.1 21l1.6-6.6L2.5 9.9l6.8-.6z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx={11} cy={11} r={7} />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const reactDocs: Record<string, DemoCase[]> = {
  Button: [
    {
      title: '语义变体',
      desc: '通过 variant 表达操作层级：primary 主操作、default 次操作、ghost 轻量、outline 描边、danger 危险操作。',
      code: `<Button>默认</Button>\n<Button variant="primary">主要</Button>\n<Button variant="ghost">幽灵</Button>\n<Button variant="outline">描边</Button>\n<Button variant="danger">危险</Button>`,
      Comp: () => (
        <div className="demo-row">
          <Button>默认</Button>
          <Button variant="primary">主要</Button>
          <Button variant="ghost">幽灵</Button>
          <Button variant="outline">描边</Button>
          <Button variant="danger">危险</Button>
        </div>
      ),
    },
    {
      title: '尺寸与胶囊',
      desc: 'size 提供 lg/md/sm/xs 四档；pill 叠加任意变体形成胶囊按钮。',
      code: `<Button size="lg" variant="primary">大</Button>\n<Button variant="primary">中</Button>\n<Button size="sm" variant="primary">小</Button>\n<Button size="xs" variant="primary">超小</Button>\n<Button pill>胶囊</Button>`,
      Comp: () => (
        <div className="demo-row">
          <Button size="lg" variant="primary">大</Button>
          <Button variant="primary">中</Button>
          <Button size="sm" variant="primary">小</Button>
          <Button size="xs" variant="primary">超小</Button>
          <Button pill>胶囊</Button>
        </div>
      ),
    },
    {
      title: '加载与禁用',
      desc: 'loading 显示 spinner 并禁用点击；disabled 进入原生禁用态；icon 可在文本前加图标。',
      code: `<Button loading variant="primary">提交中</Button>\n<Button disabled>禁用</Button>\n<Button variant="outline" icon={<span>★</span>}>带图标</Button>`,
      Comp: () => (
        <div className="demo-row">
          <Button loading variant="primary">提交中</Button>
          <Button disabled>禁用</Button>
          <Button variant="outline" icon={<span>★</span>}>带图标</Button>
        </div>
      ),
    },
  ],

  Tag: [
    {
      title: '语义类型与可关闭',
      desc: 'type 控制底色语义；closable 渲染关闭按钮并触发 onClose。',
      code: `<Tag>常规</Tag>\n<Tag type="brand">品牌</Tag>\n<Tag type="up">上涨</Tag>\n<Tag type="down">下跌</Tag>\n<Tag closable onClose={() => {}}>可关闭</Tag>`,
      Comp: () => (
        <div className="demo-row">
          <Tag>常规</Tag>
          <Tag type="brand">品牌</Tag>
          <Tag type="up">上涨</Tag>
          <Tag type="down">下跌</Tag>
          <Tag closable onClose={() => {}}>可关闭</Tag>
        </div>
      ),
    },
    {
      title: '自定义色',
      desc: 'color 直接覆盖 type 配色，适合品牌定制场景。',
      code: `<Tag color="#7c5cff">紫</Tag>\n<Tag color="#00b894">青</Tag>`,
      Comp: () => (
        <div className="demo-row">
          <Tag color="#7c5cff">紫</Tag>
          <Tag color="#00b894">青</Tag>
        </div>
      ),
    },
  ],

  Badge: [
    {
      title: '计数与圆点',
      desc: 'count 显示数字并配合 max 截断为 99+；dot 仅显示状态圆点；showZero 控制 0 值是否渲染。',
      code: `<Badge tone="brand" count={9} />\n<Badge tone="danger" count={120} />\n<Badge tone="success" dot />`,
      Comp: () => (
        <div className="demo-row">
          <Badge tone="brand" count={9}><Avatar text="A" /></Badge>
          <Badge tone="danger" count={120}><Avatar text="B" /></Badge>
          <Badge tone="success" dot><Avatar text="C" /></Badge>
        </div>
      ),
    },
    {
      title: '附着于元素',
      desc: 'Badge 通过 children 包裹任意元素（头像、按钮等）形成角标。',
      code: `<Badge tone="danger" count={99}><Button>消息</Button></Badge>`,
      Comp: () => (
        <div className="demo-row">
          <Badge tone="danger" count={99}><Button>消息</Button></Badge>
          <Badge tone="warning" dot><Button variant="outline">待办</Button></Badge>
        </div>
      ),
    },
  ],

  Avatar: [
    {
      title: '文字 / 图片 / 图标',
      desc: 'text 取首字生成底色头像；src 优先渲染图片；icon 渲染自备图标头像（24×24 + currentColor）。',
      code: `<Avatar text="茅台" tone="brand" />\n<Avatar text="宁" tone="success" />\n<Avatar icon={<StarIcon />} tone="warning" />\n<Avatar src="https://i.pravatar.cc/80?img=12" />`,
      Comp: () => (
        <div className="demo-row">
          <Avatar text="茅台" tone="brand" />
          <Avatar text="宁" tone="success" />
          <Avatar icon={<StarIcon />} tone="warning" />
          <Avatar src="https://i.pravatar.cc/80?img=12" />
        </div>
      ),
    },
    {
      title: '尺寸档位',
      desc: 'size 支持 xs/sm/md/lg 预设，也接受数字自定义像素。',
      code: `<Avatar size="xs" text="A" />\n<Avatar size="sm" text="B" />\n<Avatar size="md" text="C" />\n<Avatar size="lg" text="D" />`,
      Comp: () => (
        <div className="demo-row">
          <Avatar size="xs" text="A" />
          <Avatar size="sm" text="B" />
          <Avatar size="md" text="C" />
          <Avatar size="lg" text="D" />
        </div>
      ),
    },
  ],

  Input: [
    {
      title: '受控与状态',
      desc: 'value + onChange 受控；error 进入错误描边；disabled 禁用。',
      code: `const [v, setV] = useState('');\n<Input value={v} onChange={setV} placeholder="搜索标的 / 代码" />\n<Input defaultValue="错误示例" error />\n<Input defaultValue="不可编辑" disabled />`,
      Comp: () => {
        const [v, setV] = useState('');
        return (
          <div className="demo-row">
            <Input value={v} onChange={(val: string) => setV(val)} placeholder="搜索标的 / 代码" />
            <Input defaultValue="错误示例" error />
            <Input defaultValue="不可编辑" disabled />
          </div>
        );
      },
    },
    {
      title: '前后缀装饰',
      desc: 'prefix / suffix 接收自备图标节点或文本，常用于搜索与单位场景。',
      code: `<Input prefix={<SearchIcon />} placeholder="搜索" />\n<Input suffix="%" defaultValue="12" />`,
      Comp: () => (
        <div className="demo-row">
          <Input prefix={<SearchIcon />} placeholder="搜索" />
          <Input suffix="%" defaultValue="12" />
        </div>
      ),
    },
  ],

  Switch: [
    {
      title: '受控开关',
      desc: 'checked + onChange 受控；label 提供无障碍标签（role=switch）。',
      code: `const [on, setOn] = useState(true);\n<Switch checked={on} onChange={setOn} label="实时行情" />`,
      Comp: () => {
        const [on, setOn] = useState(true);
        return (
          <div className="demo-row">
            <Switch checked={on} onChange={setOn} label="实时行情" />
            <span className="ui-label">{on ? '开' : '关'}</span>
          </div>
        );
      },
    },
    {
      title: '非受控与尺寸',
      desc: 'defaultChecked 非受控初始；size 提供四档尺寸；disabled 禁用。',
      code: `<Switch defaultChecked size="lg" />\n<Switch size="sm" disabled />`,
      Comp: () => (
        <div className="demo-row">
          <Switch defaultChecked size="lg" />
          <Switch size="sm" disabled />
        </div>
      ),
    },
  ],

  Select: [
    {
      title: '单选',
      desc: 'options 提供选项，placeholder 占位，选中后回调 value 与选项对象。',
      code: `<Select options={[\n  { label: '贵州茅台', value: '600519' },\n  { label: '宁德时代', value: '300750' },\n]} placeholder="选择标的" />`,
      Comp: () => (
        <div className="demo-row">
          <Select
            options={[
              { label: '贵州茅台', value: '600519' },
              { label: '宁德时代', value: '300750' },
              { label: '招商银行', value: '600036' },
            ]}
            placeholder="选择标的"
          />
        </div>
      ),
    },
    {
      title: '多选 + 搜索',
      desc: 'multiple 开启多选（值为数组）；searchable 启用输入过滤。',
      code: `<Select multiple searchable options={[...]} placeholder="多选 + 搜索" />`,
      Comp: () => (
        <div className="demo-row">
          <Select
            multiple
            searchable
            options={[
              { label: '银行', value: 'bank' },
              { label: '券商', value: 'broker' },
              { label: '保险', value: 'ins' },
            ]}
            placeholder="多选 + 搜索"
          />
        </div>
      ),
    },
  ],

  NumberInput: [
    {
      title: '千分位与符号',
      desc: 'precision 控制小数位并自动千分位；prefix / suffix 附加货币或单位符号。',
      code: `<NumberInput prefix="¥" precision={2} defaultValue={1234567.5} />\n<NumberInput suffix="%" precision={1} defaultValue={12.3} />`,
      Comp: () => (
        <div className="demo-row">
          <NumberInput prefix="¥" precision={2} defaultValue={1234567.5} />
          <NumberInput suffix="%" precision={1} defaultValue={12.3} />
        </div>
      ),
    },
    {
      title: '上下限钳制',
      desc: 'min / max 钳制范围；step 控制步进，录入中保留草稿，失焦/步进才格式化。',
      code: `<NumberInput min={0} max={100} step={5} defaultValue={50} suffix="%" />`,
      Comp: () => (
        <div className="demo-row">
          <NumberInput min={0} max={100} step={5} defaultValue={50} suffix="%" />
        </div>
      ),
    },
  ],

  DatePicker: [
    {
      title: '单日选择',
      desc: 'defaultValue 传入 YYYY-MM-DD；点击外部关闭。',
      code: `<DatePicker defaultValue="2026-01-01" />`,
      Comp: () => (
        <div className="demo-row">
          <DatePicker defaultValue="2026-01-01" />
        </div>
      ),
    },
    {
      title: '区间选择',
      desc: 'range 开启区间模式，仅当起止两日均选满才触发 onChange。',
      code: `<DatePicker range defaultValue={['2026-01-01', '2026-01-31']} />`,
      Comp: () => (
        <div className="demo-row">
          <DatePicker range defaultValue={['2026-01-01', '2026-01-31']} />
        </div>
      ),
    },
  ],

  Segmented: [
    {
      title: '基础分段',
      desc: 'options 定义选项，defaultValue 非受控初始，滑块平滑跟随选中项。',
      code: `<Segmented options={[\n  { label: '日K', value: 'd' },\n  { label: '周K', value: 'w' },\n  { label: '月K', value: 'm' },\n]} defaultValue="d" />`,
      Comp: () => (
        <div className="demo-row">
          <Segmented
            options={[
              { label: '日K', value: 'd' },
              { label: '周K', value: 'w' },
              { label: '月K', value: 'm' },
            ]}
            defaultValue="d"
          />
        </div>
      ),
    },
    {
      title: '尺寸与禁用',
      desc: 'size 四档尺寸；disabled 整组禁用。',
      code: `<Segmented size="sm" options={[...]} defaultValue="d" />\n<Segmented disabled options={[...]} defaultValue="d" />`,
      Comp: () => (
        <div className="demo-row">
          <Segmented
            size="sm"
            options={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]}
            defaultValue="a"
          />
          <Segmented
            disabled
            options={[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]}
            defaultValue="a"
          />
        </div>
      ),
    },
  ],

  Search: [
    {
      title: '联想与键盘导航',
      desc: 'options 提供联想项，支持 ↑↓ 选择、Enter 确认、Esc 关闭，并可带代码/涨跌标签。',
      code: `<Search options={[\n  { label: '贵州茅台', value: '600519', code: 'SH', tag: { text: '白酒', variant: 'up' } },\n  { label: '宁德时代', value: '300750', code: 'SZ' },\n]} placeholder="搜索股票 / 代码" />`,
      Comp: () => (
        <div className="demo-row">
          <Search
            options={[
              { label: '贵州茅台', value: '600519', code: 'SH', tag: { text: '白酒', variant: 'up' } },
              { label: '宁德时代', value: '300750', code: 'SZ' },
            ]}
            placeholder="搜索股票 / 代码"
          />
        </div>
      ),
    },
  ],

  Stat: [
    {
      title: '涨跌着色',
      desc: 'trend 走全局涨跌色约定（up/down），muted 为中性灰；prefix/suffix 附加单位。',
      code: `<Stat label="上证指数" value={3218.45} delta="+1.24%" trend="up" />\n<Stat label="创业板指" value={2012.8} delta="-0.86%" trend="down" />\n<Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />`,
      Comp: () => (
        <div className="demo-row">
          <Stat label="上证指数" value={3218.45} delta="+1.24%" trend="up" />
          <Stat label="创业板指" value={2012.8} delta="-0.86%" trend="down" />
          <Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />
        </div>
      ),
    },
  ],

  Progress: [
    {
      title: '确定与不确定',
      desc: 'value/max 表达进度比例；indeterminate 表示加载中未知进度。',
      code: `<Progress value={68} />\n<Progress value={32} />\n<Progress indeterminate />`,
      Comp: () => (
        <div className="demo-row" style={{ width: 260, flexDirection: 'column', alignItems: 'stretch' }}>
          <Progress value={68} />
          <Progress value={32} />
          <Progress indeterminate />
        </div>
      ),
    },
  ],

  Skeleton: [
    {
      title: '占位形状',
      desc: 'shape 支持 text / circle / rect；active 控制微光动画。',
      code: `<Skeleton shape="circle" />\n<Skeleton />\n<Skeleton shape="rect" style={{ width: 220, height: 16 }} />`,
      Comp: () => (
        <div className="demo-row">
          <Skeleton shape="circle" />
          <Skeleton />
          <Skeleton shape="rect" style={{ width: 220, height: 16 }} />
        </div>
      ),
    },
  ],

  Empty: [
    {
      title: '空状态占位',
      desc: 'description 提供文案，children 作为操作区（如「新建」按钮）。',
      code: `<Empty description="暂无自选标的">\n  <Button variant="primary">添加自选</Button>\n</Empty>`,
      Comp: () => (
        <div className="demo-row">
          <Empty description="暂无自选标的">
            <Button variant="primary">添加自选</Button>
          </Empty>
        </div>
      ),
    },
  ],

  Tabs: [
    {
      title: '标签切换',
      desc: 'items 定义标签与面板内容，支持受控 value 与非受控 defaultValue。',
      code: `<Tabs items={[\n  { key: 'a', label: '概况', content: <p>公司基本面。</p> },\n  { key: 'b', label: '财务', content: <p>营收 / 利润。</p> },\n  { key: 'c', label: '研报', content: <p>券商观点。</p> },\n]} />`,
      Comp: () => (
        <Tabs
          items={[
            { key: 'a', label: '概况', content: <p>公司基本面与行业地位。</p> },
            { key: 'b', label: '财务', content: <p>营收 / 利润 / 现金流。</p> },
            { key: 'c', label: '研报', content: <p>近期券商观点。</p> },
          ]}
        />
      ),
    },
  ],

  Breadcrumb: [
    {
      title: '路径导航',
      desc: 'items 描述路径，末项自动标记为当前页；separator 自定义分隔符。',
      code: `<Breadcrumb items={[\n  { label: '研究', href: '#' },\n  { label: '行业', href: '#' },\n  { label: '白酒' },\n]} />`,
      Comp: () => (
        <Breadcrumb
          items={[
            { label: '研究', href: '#' },
            { label: '行业', href: '#' },
            { label: '白酒' },
          ]}
        />
      ),
    },
  ],

  Steps: [
    {
      title: '流程向导',
      desc: 'steps 描述流程，defaultCurrent 非受控初始；clickable 时点击步骤触发 onChange。',
      code: `<Steps steps={[\n  { title: '选股', desc: '筛选池' },\n  { title: '回测', desc: '历史验证' },\n  { title: '实盘', desc: '跟踪' },\n]} defaultCurrent={1} />`,
      Comp: () => (
        <Steps
          steps={[
            { title: '选股', desc: '筛选池' },
            { title: '回测', desc: '历史验证' },
            { title: '实盘', desc: '跟踪' },
          ]}
          defaultCurrent={1}
        />
      ),
    },
  ],

  Pagination: [
    {
      title: '分页',
      desc: 'total + pageSize 推导页数，defaultPage 非受控初始；onChange 翻页回调。',
      code: `<Pagination total={240} pageSize={10} defaultPage={3} />`,
      Comp: () => <Pagination total={240} pageSize={10} defaultPage={3} />,
    },
  ],

  Tooltip: [
    {
      title: '提示变体',
      desc: 'variant=invert 反转色；surface 跟随主题表面并带毛玻璃。默认 placement=top。',
      code: `<Tooltip content="这是一条提示"><Button>悬停查看</Button></Tooltip>\n<Tooltip content="跟随主题表面" variant="surface"><Button variant="outline">surface</Button></Tooltip>`,
      Comp: () => (
        <div className="demo-row">
          <Tooltip content="这是一条提示"><Button>悬停查看</Button></Tooltip>
          <Tooltip content="跟随主题表面" variant="surface"><Button variant="outline">surface</Button></Tooltip>
        </div>
      ),
    },
  ],

  Popover: [
    {
      title: '可交互浮层',
      desc: 'content 可放置按钮等可交互元素（区别于 Tooltip），hover/focus 弹出，外部点击关闭。',
      code: `<Popover content={<div>面板可放<strong>可交互</strong>内容。</div>}>\n  <Button>触发浮层</Button>\n</Popover>`,
      Comp: () => (
        <div className="demo-row">
          <Popover content={<div>面板可放<strong>可交互</strong>内容，如按钮。</div>}>
            <Button>触发浮层</Button>
          </Popover>
        </div>
      ),
    },
  ],

  Dialog: [
    {
      title: '模态对话框',
      desc: 'open 为必填受控；内置焦点陷阱、Esc / 点遮罩关闭；title / footer 配置头部与底部。',
      code: `const [open, setOpen] = useState(false);\n<Button onClick={() => setOpen(true)}>打开 Dialog</Button>\n<Dialog open={open} onOpenChange={setOpen} title="新建策略"\n  footer={<Button variant="primary" onClick={() => setOpen(false)}>确定</Button>}>\n  <p>支持焦点陷阱与 Esc 关闭。</p>\n</Dialog>`,
      Comp: () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>打开 Dialog</Button>
            <Dialog
              open={open}
              onOpenChange={setOpen}
              title="新建策略"
              footer={<Button variant="primary" onClick={() => setOpen(false)}>确定</Button>}
            >
              <p>Dialog 支持焦点陷阱、Esc / 点遮罩关闭，纯走 theme.css。</p>
            </Dialog>
          </>
        );
      },
    },
  ],

  Drawer: [
    {
      title: '侧滑抽屉',
      desc: 'side 控制滑出方向（right/left/bottom）；showClose 控制关闭按钮；同样具备焦点陷阱。',
      code: `const [open, setOpen] = useState(false);\n<Drawer open={open} onOpenChange={setOpen} title="筛选条件" subtitle="右侧滑出">\n  <p>承载较复杂的筛选 / 表单。</p>\n</Drawer>`,
      Comp: () => {
        const [open, setOpen] = useState(false);
        return (
          <>
            <Button onClick={() => setOpen(true)}>打开 Drawer</Button>
            <Drawer open={open} onOpenChange={setOpen} title="筛选条件" subtitle="右侧滑出">
              <p>Drawer 用于承载较复杂的筛选 / 表单。</p>
            </Drawer>
          </>
        );
      },
    },
  ],

  ContextMenu: [
    {
      title: '右键菜单',
      desc: 'targetRef 指定右键目标；items 定义菜单项（支持 shortcut / danger / separator）；onSelect 回调 key。',
      code: `const target = useRef(null);\n<ContextMenu targetRef={target} items={[\n  { key: 'edit', label: '编辑' },\n  { key: 'copy', label: '复制' },\n  { key: 'del', label: '删除', danger: true },\n]} onSelect={(k) => toast('执行：' + k)} />\n<div ref={target} className="demo-target">右键此区域</div>`,
      Comp: () => {
        const target = useRef<HTMLDivElement>(null);
        return (
          <>
            <div ref={target} className="demo-target">右键此区域唤出菜单</div>
            <ContextMenu
              targetRef={target}
              items={[
                { key: 'edit', label: '编辑' },
                { key: 'copy', label: '复制', shortcut: '⌘C' },
                { key: 'del', label: '删除', danger: true },
              ]}
              onSelect={(k) => toast(`执行：${k}`)}
            />
          </>
        );
      },
    },
  ],

  Tree: [
    {
      title: '勾选与展开',
      desc: 'checkable 显示勾选框；defaultExpandedKeys / defaultCheckedKeys 控制初始展开与勾选。',
      code: `<Tree data={treeData} defaultExpandedKeys={['1']} defaultCheckedKeys={['1-1']} />`,
      Comp: () => (
        <Tree data={treeData} defaultExpandedKeys={['1']} defaultCheckedKeys={['1-1']} />
      ),
    },
  ],

  Slider: [
    {
      title: '区间滑块',
      desc: '双滑块选择区间；format 控制标签格式（pct/num）；支持拖拽与键盘微调。',
      code: `<Slider min={0} max={100} defaultValue={[20, 80]} format="pct" />`,
      Comp: () => (
        <div className="demo-row" style={{ width: 320 }}>
          <Slider min={0} max={100} defaultValue={[20, 80]} format="pct" />
        </div>
      ),
    },
  ],

  DataTable: [
    {
      title: '排序 / 选中 / 冻结列',
      desc: 'numeric 右对齐并涨跌着色；sticky 冻结首列；sortable 开启排序；selectable 行多选。',
      code: `<DataTable columns={columns} data={data} compact selectable\n  rowKey="code" />`,
      Comp: () => (
        <DataTable columns={tableColumns} data={tableData} compact selectable rowKey="code" />
      ),
    },
  ],

  Toast: [
    {
      title: '命令式轻提示',
      desc: 'toast(content, options) 单例挂载 body；duration=0 常驻，重复调用重置计时。',
      code: `toast('操作成功');\ntoast('正在保存…', { duration: 0 });`,
      Comp: () => (
        <div className="demo-row">
          <Button onClick={() => toast('操作成功')}>默认 Toast</Button>
          <Button variant="outline" onClick={() => toast('正在保存…', { duration: 0 })}>常驻 Toast</Button>
        </div>
      ),
    },
  ],

  Message: [
    {
      title: '命令式通知',
      desc: 'showMessage(text, type?, duration?) 支持 success/warning/info/danger 四种语义。',
      code: `showMessage('数据已更新', 'success');\nshowMessage('请求失败', 'danger');`,
      Comp: () => (
        <div className="demo-row">
          <Button onClick={() => showMessage('数据已更新', 'success')}>success</Button>
          <Button variant="outline" onClick={() => showMessage('请求失败', 'danger')}>danger</Button>
        </div>
      ),
    },
  ],

  // ——— 补齐 plain 侧已有、React/Vue 侧原先缺失的用例（Accordion / Form / VirtualTable）———
  Accordion: [
    {
      title: '手风琴',
      desc: 'items 数据集（可含 badge）；defaultActiveKeys 控制默认展开。',
      code: `<Accordion items={items} defaultActiveKeys={['1']} />`,
      Comp: () => <Accordion items={accordionItems} defaultActiveKeys={['1']} />,
    },
  ],

  Form: [
    {
      title: '表单',
      desc: 'fields 字段集；submit 时逐字段校验，未通过写行内错误，通过后回调 onSubmit。',
      code: `<Form fields={fields} onSubmit={(v) => showMessage('已提交 ' + v.code)} />`,
      Comp: () => (
        <Form fields={formFields} onSubmit={(v) => showMessage('已提交 ' + v.code, 'success')} />
      ),
    },
  ],

  VirtualTable: [
    {
      title: '虚拟表',
      desc: '5000 行仅渲染可视窗口；首列 sticky；trend 涨跌着色。',
      code: `<VirtualTable rows={rows} columns={cols} rowHeight={33} />`,
      Comp: () => <VirtualTable rows={vtableRows} columns={vtableColumns} rowHeight={33} />,
    },
  ],

  // ——— Icon 契约页（无 Icon 组件导出，演示的是 icon 插槽如何承接外部图标）———
  Icon: [
    {
      title: '自备图标传入',
      desc: '组件不内置图标库：任意 24×24 viewBox + currentColor 的节点都能塞进 icon 插槽。三端入参形态不同——React 传节点，Vue 传组件，Plain 传「调用子组件」的结果。',
      code: `const PlusIcon = () => (\n  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"\n       strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">\n    <path d="M12 5v14M5 12h14" />\n  </svg>\n);\n\n<Button icon={<PlusIcon />} variant="primary">新建</Button>\n<Tag icon={<StarIcon />} type="brand">重点</Tag>`,
      Comp: () => (
        <div className="demo-row">
          <Button icon={<PlusIcon />} variant="primary">新建</Button>
          <Tag icon={<StarIcon />} type="brand">重点</Tag>
        </div>
      ),
    },
    {
      title: '尺寸跟随容器',
      desc: '图标自身不写 width/height，尺寸由容器的 .ui-icon 与 --ui-icon-size 决定，随 size 档位自动缩放。',
      code: `<Button size="lg" variant="primary" icon={<PlusIcon />}>大</Button>\n<Button variant="primary" icon={<PlusIcon />}>中</Button>\n<Button size="sm" variant="primary" icon={<PlusIcon />}>小</Button>`,
      Comp: () => (
        <div className="demo-row">
          <Button size="lg" variant="primary" icon={<PlusIcon />}>大</Button>
          <Button variant="primary" icon={<PlusIcon />}>中</Button>
          <Button size="sm" variant="primary" icon={<PlusIcon />}>小</Button>
        </div>
      ),
    },
    {
      title: '可覆盖与不可覆盖',
      desc: '内容类图标（Empty 的占位图）走 icon 插槽，可整段覆盖；状态类图标（Steps 已完成步的 check）是组件语义的一部分，内置且不可替换。',
      code: `<Empty description="可覆盖：传入自备图标" icon={<StarIcon />} />\n<Steps steps={[{ title: '选股' }, { title: '回测' }, { title: '实盘' }]} defaultCurrent={2} />`,
      Comp: () => (
        <div className="demo-row">
          <Empty description="可覆盖：传入自备图标" icon={<StarIcon />} />
          <Steps
            steps={[{ title: '选股' }, { title: '回测' }, { title: '实盘' }]}
            defaultCurrent={2}
          />
        </div>
      ),
    },
  ],
};
