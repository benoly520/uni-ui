// Plain 版组件演示（与 react-demos / vue-demos 一一对应：同样的用例、同样的行布局与文案）。
// 视图用 plain 的 TSX + 编译器编写（直接构建 DOM，无虚拟 DOM）。
// 每个 demo 的 Comp 是「返回 DocumentFragment 的函数」，由 showcase 用 plain 的 mount 挂载。
//
// 注意（plain 编译器约定）：
//   · 结构一律用 <div class="demo-row"> 包裹，保证与 React/Vue 的横向排布一致；
//   · 不能把 JSX 直接写进属性（会被编译器丢弃/报错），需要 JSX 属性时改为「调用子组件」传入；
//   · 内联样式用 kebab-case 字符串，避免 camelCase 转换差异。
import { signal } from 'plain';
import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  ContextMenu,
  DataTable,
  DatePicker,
  Dialog,
  Drawer,
  Empty,
  Form,
  Input,
  Message,
  NumberInput,
  Pagination,
  Popover,
  Progress,
  Search,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Stat,
  Steps,
  Switch,
  Tabs,
  Tag,
  Toast,
  Tooltip,
  Tree,
  VirtualTable,
  toast,
  showMessage,
} from 'uni-ui/plain';
import type { DatePickerValue } from 'uni-ui/plain';

export interface PlainCase {
  title: string;
  desc: string;
  code: string;
  Comp: () => any;
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

/** Dialog 底部操作区：plain 不能把 JSX 写进属性，改为「调用子组件」传值 */
const DialogFooter = (props: { onClose: () => void }) => (
  <div class="demo-row">
    <Button variant="ghost" onClick={props.onClose}>
      取消
    </Button>
    <Button variant="primary" onClick={props.onClose}>
      确定
    </Button>
  </div>
);

/** Popover 面板内容：同上 */
const PopoverPanel = () => (
  <div>
    面板可放<strong>可交互</strong>内容，如按钮。
  </div>
);

/** 演示用「自备图标」：24×24 viewBox + currentColor，形状与 lucide `plus` / `star` / `search` 一致 */
function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 5v14M5 12h14"></path>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 3l2.7 6.3 6.8.6-5.2 4.5 1.6 6.6L12 17.4 6.1 21l1.6-6.6L2.5 9.9l6.8-.6z"></path>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="7"></circle>
      <path d="M21 21l-4.3-4.3"></path>
    </svg>
  );
}

export const plainDocs: Record<string, PlainCase[]> = {
  Button: [
    {
      title: '语义变体',
      desc: '通过 variant 表达操作层级：primary 主操作、default 次操作、ghost 轻量、outline 描边、danger 危险操作。',
      code: `<Button>默认</Button>\n<Button variant="primary">主要</Button>\n<Button variant="ghost">幽灵</Button>\n<Button variant="outline">描边</Button>\n<Button variant="danger">危险</Button>`,
      Comp: () => (
        <div class="demo-row">
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
        <div class="demo-row">
          <Button size="lg" variant="primary">
            大
          </Button>
          <Button variant="primary">中</Button>
          <Button size="sm" variant="primary">
            小
          </Button>
          <Button size="xs" variant="primary">
            超小
          </Button>
          <Button pill>胶囊</Button>
        </div>
      ),
    },
    {
      title: '加载与禁用',
      desc: 'loading 显示 spinner 并禁用点击；disabled 进入原生禁用态；icon 可在文本前加图标。',
      code: `<Button loading variant="primary">提交中</Button>\n<Button disabled>禁用</Button>\n<Button variant="outline" icon="★">带图标</Button>`,
      Comp: () => (
        <div class="demo-row">
          <Button loading variant="primary">
            提交中
          </Button>
          <Button disabled>禁用</Button>
          <Button variant="outline" icon="★">
            带图标
          </Button>
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<Button variant="default">默认：磨砂</Button>\n<Button variant="default" glass={false}>关闭：实心</Button>`,
      Comp: () => (
        <div class="demo-row">
          <Button variant="default">默认：磨砂</Button>
          <Button variant="default" glass={false}>关闭：实心</Button>
        </div>
      ),
    },
    {
      title: '原生 type',
      desc: 'type 决定按钮在表单内的提交行为：submit 触发表单提交、button 仅响应点击、reset 重置表单。',
      code: `<Button type="submit" variant="primary">type=submit</Button>\n<Button type="button" variant="outline">type=button</Button>\n<Button type="reset" variant="ghost">type=reset</Button>`,
      Comp: () => {
        return (
          <div class="demo-row">
            <Button type="submit" variant="primary">type=submit</Button>
            <Button type="button" variant="outline">type=button</Button>
            <Button type="reset" variant="ghost">type=reset</Button>
            <p class="demo-hint">表单内 submit 会触发表单提交，button 只响应 onClick。</p>
          </div>
        );
      },
    },
  ],

  Tag: [
    {
      title: '语义类型与可关闭',
      desc: 'type 控制底色语义；closable 渲染关闭按钮并触发 onClose。',
      code: `<Tag>常规</Tag>\n<Tag type="brand">品牌</Tag>\n<Tag type="up">上涨</Tag>\n<Tag type="down">下跌</Tag>\n<Tag closable onClose={() => {}}>可关闭</Tag>`,
      Comp: () => (
        <div class="demo-row">
          <Tag>常规</Tag>
          <Tag type="brand">品牌</Tag>
          <Tag type="up">上涨</Tag>
          <Tag type="down">下跌</Tag>
          <Tag closable onClose={() => {}}>
            可关闭
          </Tag>
        </div>
      ),
    },
    {
      title: '自定义色',
      desc: 'color 直接覆盖 type 配色，适合品牌定制场景。',
      code: `<Tag color="#7c5cff">紫</Tag>\n<Tag color="#00b894">青</Tag>`,
      Comp: () => (
        <div class="demo-row">
          <Tag color="#7c5cff">紫</Tag>
          <Tag color="#00b894">青</Tag>
        </div>
      ),
    },
    {
      title: '图标前缀（icon）',
      desc: 'icon 接收 24×24 且沿用 currentColor 的节点，渲染进 .ui-icon，可与 closable / color 叠加。',
      code: `<Tag type="brand" icon={StarIcon()}>重点关注</Tag>\n<Tag type="up" icon={PlusIcon()}>加自选</Tag>\n<Tag closable icon={StarIcon()}>可关闭 + 图标</Tag>`,
      Comp: () => {
        return (
          <div class="demo-row">
            <Tag type="brand" icon={StarIcon()}>重点关注</Tag>
            <Tag type="up" icon={PlusIcon()}>加自选</Tag>
            <Tag closable icon={StarIcon()}>可关闭 + 图标</Tag>
          </div>
        );
      },
    },
  ],

  Badge: [
    {
      title: '计数与圆点',
      desc: 'count 显示数字并配合 max 截断为 99+；dot 仅显示状态圆点；showZero 控制 0 值是否渲染。',
      code: `<Badge tone="brand" count={9}><Avatar text="A" /></Badge>\n<Badge tone="danger" count={120}><Avatar text="B" /></Badge>\n<Badge tone="success" dot><Avatar text="C" /></Badge>`,
      Comp: () => (
        <div class="demo-row">
          <Badge tone="brand" count={9}>
            <Avatar text="A" />
          </Badge>
          <Badge tone="danger" count={120}>
            <Avatar text="B" />
          </Badge>
          <Badge tone="success" dot>
            <Avatar text="C" />
          </Badge>
        </div>
      ),
    },
    {
      title: '附着于元素',
      desc: 'Badge 通过 children 包裹任意元素（头像、按钮等）形成角标。',
      code: `<Badge tone="danger" count={99}><Button>消息</Button></Badge>\n<Badge tone="warning" dot><Button variant="outline">待办</Button></Badge>`,
      Comp: () => (
        <div class="demo-row">
          <Badge tone="danger" count={99}>
            <Button>消息</Button>
          </Badge>
          <Badge tone="warning" dot>
            <Button variant="outline">待办</Button>
          </Badge>
        </div>
      ),
    },
    {
      title: '上限与零值',
      desc: 'max 超出后显示 max+；showZero 决定 count=0 时是否仍渲染徽标（默认 false 隐藏）。',
      code: `<Badge tone="danger" count={120} max={99} />\n<Badge tone="brand" count={0} showZero />\n<Badge tone="brand" count={0} />`,
      Comp: () => {
        return (
          <div class="demo-row">
            <Badge tone="danger" count={120} max={99} />
            <Badge tone="brand" count={0} showZero />
            <Badge tone="brand" count={0} />
            <p class="demo-hint">第三个 count=0 且未开 showZero，不渲染。</p>
          </div>
        );
      },
    },
  ],

  Avatar: [
    {
      title: '文字 / 图片 / 图标',
      desc: 'text 取首字生成底色头像；src 优先渲染图片；icon 渲染自备图标头像（24×24 + currentColor）。',
      code: `<Avatar text="茅台" tone="brand" />\n<Avatar text="宁" tone="success" />\n<Avatar icon={StarIcon()} tone="warning" />\n<Avatar src="https://i.pravatar.cc/80?img=12" alt="用户头像" size={48} />`,
      Comp: () => (
        <div class="demo-row">
          <Avatar text="茅台" tone="brand" />
          <Avatar text="宁" tone="success" />
          <Avatar icon={StarIcon()} tone="warning" />
          <Avatar src="https://i.pravatar.cc/80?img=12" alt="用户头像" size={48} />
        </div>
      ),
    },
    {
      title: '尺寸档位',
      desc: 'size 支持 xs/sm/md/lg 预设，也接受数字自定义像素。',
      code: `<Avatar size="xs" text="A" />\n<Avatar size="sm" text="B" />\n<Avatar size="md" text="C" />\n<Avatar size="lg" text="D" />`,
      Comp: () => (
        <div class="demo-row">
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
      code: `const v = signal('');\n<Input value={v()} onChange={(val: string) => v.set(val)} placeholder="搜索标的 / 代码" />\n<Input defaultValue="错误示例" error />\n<Input defaultValue="不可编辑" disabled />`,
      Comp: () => {
        const v = signal('');
        return (
          <div class="demo-row">
            <Input value={v()} onChange={(val: string) => v.set(val)} placeholder="搜索标的 / 代码" />
            <Input defaultValue="错误示例" error />
            <Input defaultValue="不可编辑" disabled />
          </div>
        );
      },
    },
    {
      title: '前后缀装饰',
      desc: 'prefix / suffix 接收自备图标节点或文本，常用于搜索与单位场景。',
      code: `<Input prefix={SearchIcon()} placeholder="搜索" />\n<Input suffix="%" defaultValue="12" />`,
      Comp: () => (
        <div class="demo-row">
          <Input prefix={SearchIcon()} placeholder="搜索" />
          <Input suffix="%" defaultValue="12" />
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<Input placeholder="默认：磨砂" />\n<Input placeholder="关闭：实心" glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <Input placeholder="默认：磨砂" />
          <Input placeholder="关闭：实心" glass={false} />
        </div>
      ),
    },
    {
      title: '尺寸 / 类型 / 长度',
      desc: 'size 四档尺寸；type 透传原生 input 类型（password / number / email 等）；maxLength 限制输入长度。',
      code: `<Input size="lg" placeholder="size=lg" />\n<Input size="sm" placeholder="size=sm" />\n<Input type="password" defaultValue="secret" />\n<Input maxLength={6} defaultValue="600519" placeholder="maxLength=6" />`,
      Comp: () => {
        return (
          <div class="demo-row">
            <Input size="lg" placeholder="size=lg" />
            <Input size="sm" placeholder="size=sm" />
            <Input type="password" defaultValue="secret" />
            <Input maxLength={6} defaultValue="600519" placeholder="maxLength=6" />
          </div>
        );
      },
    },
  ],

  Switch: [
    {
      title: '受控开关',
      desc: 'checked + onChange 受控；label 提供无障碍标签（role=switch）。',
      code: `const on = signal(true);\n<Switch checked={on()} onChange={(v: boolean) => on.set(v)} label="实时行情" />`,
      Comp: () => {
        const on = signal(true);
        return (
          <div class="demo-row">
            <Switch checked={on()} onChange={(v: boolean) => on.set(v)} label="实时行情" />
            <span class="ui-label">{on() ? '开' : '关'}</span>
          </div>
        );
      },
    },
    {
      title: '非受控与尺寸',
      desc: 'defaultChecked 非受控初始；size 提供四档尺寸；disabled 禁用。',
      code: `<Switch defaultChecked size="lg" />\n<Switch size="sm" disabled />`,
      Comp: () => (
        <div class="demo-row">
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
        <div class="demo-row">
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
        <div class="demo-row">
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
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<Select options={options} placeholder="默认：磨砂" />\n<Select options={options} placeholder="关闭：实心" glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <Select
            options={[
              { label: '贵州茅台', value: '600519' },
              { label: '宁德时代', value: '300750' },
            ]}
            placeholder="默认：磨砂"
          />
          <Select
            glass={false}
            options={[
              { label: '贵州茅台', value: '600519' },
              { label: '宁德时代', value: '300750' },
            ]}
            placeholder="关闭：实心"
          />
        </div>
      ),
    },
    {
      title: '受控值（value）',
      desc: 'value + onChange 受控（多选时传数组），非受控用 defaultValue。',
      code: `const v = signal<string>('600519');\n<Select options={options} value={() => v()} onChange={(val) => v.set(val as string)} />\n<p>当前值：{v()}</p>`,
      Comp: () => {
        const v = signal<string>('600519');
        return (
          <div>
            <Select
              options={[
                { label: '贵州茅台', value: '600519' },
                { label: '宁德时代', value: '300750' },
                { label: '招商银行', value: '600036' },
              ]}
              value={() => v()}
              onChange={(val: string | string[]) => v.set(val as string)}
            />
            <p class="demo-hint">当前值：{v()}</p>
          </div>
        );
      },
    },
    {
      title: '选项禁用 / 初始值',
      desc: 'SelectOption.disabled 置灰单项且不可选；defaultValue 为非受控初始选中值。',
      code: `<Select defaultValue="600519" options={[\n  { label: '贵州茅台', value: '600519' },\n  { label: '宁德时代', value: '300750', disabled: true },\n]} />
<p>宁德时代为 disabled，展开后不可点选。</p>`,
      Comp: () => {
        return (
          <div>
            <Select
              defaultValue="600519"
              options={[
                { label: '贵州茅台', value: '600519' },
                { label: '宁德时代', value: '300750', disabled: true },
                { label: '招商银行', value: '600036' },
              ]}
            />
            <p class="demo-hint">宁德时代为 disabled，展开后不可点选。</p>
          </div>
        );
      },
    },
  ],

  NumberInput: [
    {
      title: '千分位与符号',
      desc: 'precision 控制小数位并自动千分位；prefix / suffix 附加货币或单位符号。',
      code: `<NumberInput prefix="¥" precision={2} defaultValue={1234567.5} />\n<NumberInput suffix="%" precision={1} defaultValue={12.3} />`,
      Comp: () => (
        <div class="demo-row">
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
        <div class="demo-row">
          <NumberInput min={0} max={100} step={5} defaultValue={50} suffix="%" />
        </div>
      ),
    },
    {
      title: '受控值（value）',
      desc: 'value + onChange 受控（配合 precision 定点），非受控用 defaultValue。',
      code: `const n = signal(1234.5);\n<NumberInput value={() => n()} onChange={(v) => n.set(v)} precision={2} prefix="¥" />\n<p>当前值：{n()}</p>`,
      Comp: () => {
        const n = signal(1234.5);
        return (
          <div>
            <NumberInput value={() => n()} onChange={(v: number) => n.set(v)} precision={2} prefix="¥" />
            <p class="demo-hint">当前值：{n()}</p>
          </div>
        );
      },
    },
  ],

  DatePicker: [
    {
      title: '单日选择',
      desc: 'defaultValue 传入 YYYY-MM-DD；点击外部关闭。',
      code: `<DatePicker defaultValue="2026-01-01" />`,
      Comp: () => (
        <div class="demo-row">
          <DatePicker defaultValue="2026-01-01" />
        </div>
      ),
    },
    {
      title: '区间选择',
      desc: 'range 开启区间模式，仅当起止两日均选满才触发 onChange。',
      code: `<DatePicker range defaultValue={['2026-01-01', '2026-01-31']} />`,
      Comp: () => (
        <div class="demo-row">
          <DatePicker range defaultValue={['2026-01-01', '2026-01-31']} />
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<DatePicker defaultValue="2026-01-01" />\n<DatePicker defaultValue="2026-01-01" glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <DatePicker defaultValue="2026-01-01" />
          <DatePicker defaultValue="2026-01-01" glass={false} />
        </div>
      ),
    },
    {
      title: '受控值（value）',
      desc: 'value + onChange 受控，配合 placeholder 自定义占位；非受控用 defaultValue。',
      code: `const v = signal<string | null>('2026-01-01');\n<DatePicker value={() => v()} onChange={(val) => v.set(val)} placeholder="选择报告日期" />\n<p>当前值：{v() || '未选择'}</p>`,
      Comp: () => {
        const v = signal<DatePickerValue>('2026-01-01');
        return (
          <div>
            <DatePicker
              value={() => v()}
              onChange={(val: DatePickerValue) => v.set(val)}
              placeholder="选择报告日期"
            />
            <p class="demo-hint">当前值：{v() || '未选择'}</p>
          </div>
        );
      },
    },
  ],

  Segmented: [
    {
      title: '基础分段',
      desc: 'options 定义选项，defaultValue 非受控初始，滑块平滑跟随选中项。',
      code: `<Segmented options={[\n  { label: '日K', value: 'd' },\n  { label: '周K', value: 'w' },\n  { label: '月K', value: 'm' },\n]} defaultValue="d" />`,
      Comp: () => (
        <div class="demo-row">
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
      code: `<Segmented size="sm" options={[...]} defaultValue="a" />\n<Segmented disabled options={[...]} defaultValue="a" />`,
      Comp: () => (
        <div class="demo-row">
          <Segmented
            size="sm"
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]}
            defaultValue="a"
          />
          <Segmented
            disabled
            options={[
              { label: 'A', value: 'a' },
              { label: 'B', value: 'b' },
            ]}
            defaultValue="a"
          />
        </div>
      ),
    },
    {
      title: '受控切换（value / onChange）',
      desc: 'value + onChange 受控当前段；onChange 回传选项 value（string | number），非受控用 defaultValue。',
      code: `const v = signal<string | number>('d');\n<Segmented options={options} value={() => v()} onChange={(val) => v.set(val)} />\n<p>当前：{v()}</p>`,
      Comp: () => {
        const v = signal<string | number>('d');
        return (
          <div>
            <Segmented
              options={[
                { label: '日K', value: 'd' },
                { label: '周K', value: 'w' },
                { label: '月K', value: 'm' },
              ]}
              value={() => v()}
              onChange={(val: string | number) => v.set(val)}
            />
            <p class="demo-hint">当前：{String(v())}</p>
          </div>
        );
      },
    },
  ],

  Search: [
    {
      title: '联想与键盘导航',
      desc: 'options 提供联想项，支持 ↑↓ 选择、Enter 确认、Esc 关闭，并可带代码/涨跌标签。',
      code: `<Search options={[\n  { label: '贵州茅台', value: '600519', code: 'SH', tag: { text: '白酒', variant: 'up' } },\n  { label: '宁德时代', value: '300750', code: 'SZ' },\n]} placeholder="搜索股票 / 代码" />`,
      Comp: () => (
        <div class="demo-row">
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
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<Search options={options} placeholder="默认：磨砂" />\n<Search options={options} placeholder="关闭：实心" glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <Search
            options={[
              { label: '贵州茅台', value: '600519', code: 'SH' },
              { label: '宁德时代', value: '300750', code: 'SZ' },
            ]}
            placeholder="默认：磨砂"
          />
          <Search
            glass={false}
            options={[
              { label: '贵州茅台', value: '600519', code: 'SH' },
              { label: '宁德时代', value: '300750', code: 'SZ' },
            ]}
            placeholder="关闭：实心"
          />
        </div>
      ),
    },
    {
      title: '受控输入 / 初始值 / 选中回调',
      desc: 'value + onChange 受控关键词（非受控用 defaultValue）；onSelect 回传被选中的 option 对象（value / code / tag 全量）。',
      code: `const q = signal('茅台');\nconst picked = signal('未选择');\n<Search value={() => q()} onChange={(v) => q.set(v)} options={options}\n  onSelect={(o) => picked.set(o.label)} />\n<Search defaultValue="茅台" options={options} />\n<p>当前输入：{q()} · 已选：{picked()}</p>`,
      Comp: () => {
        const q = signal('茅台');
        const picked = signal('未选择');
        const options = [
          { label: '贵州茅台', value: '600519', code: 'SH' },
          { label: '宁德时代', value: '300750', code: 'SZ' },
        ];
        return (
          <div>
            <Search
              value={() => q()}
              onChange={(v: string) => q.set(v)}
              options={options}
              onSelect={(o: { label: string; code?: string }) =>
                picked.set(o.label + ' ' + (o.code ?? ''))}
            />
            <Search defaultValue="茅台" options={options} />
            <p class="demo-hint">当前输入：{q()} · 已选：{picked()}</p>
          </div>
        );
      },
    },
  ],

  Stat: [
    {
      title: '涨跌着色',
      desc: 'trend 走全局涨跌色约定（up/down），muted 为中性灰；prefix/suffix 附加单位。',
      code: `<Stat label="上证指数" value={3218.45} delta="+1.24%" trend="up" />\n<Stat label="创业板指" value={2012.8} delta="-0.86%" trend="down" />\n<Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />\n<Stat label="持仓市值" value="12.86" prefix="¥" suffix="万" trend="muted" />`,
      Comp: () => (
        <div class="demo-row">
          <Stat label="上证指数" value={3218.45} delta="+1.24%" trend="up" />
          <Stat label="创业板指" value={2012.8} delta="-0.86%" trend="down" />
          <Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />
          <Stat label="持仓市值" value="12.86" prefix="¥" suffix="万" trend="muted" />
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
        <div class="demo-row" style="width:260px;flex-direction:column;align-items:stretch">
          <Progress value={68} />
          <Progress value={32} />
          <Progress indeterminate />
        </div>
      ),
    },
    {
      title: '自定义上限（max）',
      desc: 'value / max 决定百分比，max 非 100 时按比例换算，便于「已完成 3/5 步」这类场景。',
      code: `<Progress value={3} max={5} />\n<Progress value={1} max={5} />`,
      Comp: () => {
        return (
          <div style="display: flex; flex-direction: column; gap: 10px; width: 280px">
            <Progress value={3} max={5} />
            <Progress value={1} max={5} />
            <p class="demo-hint">value=3 / max=5 → 60%；value=1 / max=5 → 20%。</p>
          </div>
        );
      },
    },
  ],

  Skeleton: [
    {
      title: '占位形状',
      desc: 'shape 支持 text / circle / rect；active 控制微光动画。',
      code: `<Skeleton shape="circle" />\n<Skeleton />\n<Skeleton shape="rect" width={220} height={16} />`,
      Comp: () => (
        <div class="demo-row">
          <Skeleton shape="circle" />
          <Skeleton />
          <Skeleton shape="rect" width={220} height={16} />
        </div>
      ),
    },
    {
      title: '关闭闪光（active）',
      desc: 'active 控制高光扫过动画；数据加载完成后若仍需占位，可关掉动画降低干扰。',
      code: `<Skeleton active />\n<Skeleton active={false} />`,
      Comp: () => {
        return (
          <div class="demo-row">
            <Skeleton active />
            <Skeleton active={false} />
            <p class="demo-hint">左为默认闪光，右为静态占位。</p>
          </div>
        );
      },
    },
  ],

  Empty: [
    {
      title: '空状态占位',
      desc: 'description 提供文案，children 作为操作区（如「新建」按钮）。',
      code: `<Empty description="暂无自选标的">\n  <Button variant="primary">添加自选</Button>\n</Empty>`,
      Comp: () => (
        <div class="demo-row">
          <Empty description="暂无自选标的">
            <Button variant="primary">添加自选</Button>
          </Empty>
        </div>
      ),
    },
    {
      title: '自定义图标（icon）',
      desc: 'icon 覆盖内置 table 图形，接收 24×24 且沿用 currentColor 的节点；plain 侧用 icon={SearchIcon()} 传入本文件的内联 SVG。',
      code: `<Empty icon={SearchIcon()} description="没有匹配的标的">\n  <Button variant="outline">清空筛选</Button>\n</Empty>\n<Empty icon={StarIcon()} description="尚未添加自选" />`,
      Comp: () => (
        <div class="demo-row">
          <Empty icon={SearchIcon()} description="没有匹配的标的">
            <Button variant="outline">清空筛选</Button>
          </Empty>
          <Empty icon={StarIcon()} description="尚未添加自选" />
        </div>
      ),
    },
  ],

  Tabs: [
    {
      title: '标签切换',
      desc: 'items 定义标签与面板内容，支持受控 value 与非受控 defaultValue。',
      code: `<Tabs items={[\n  { key: 'a', label: '概况', content: '公司基本面与行业地位。' },\n  { key: 'b', label: '财务', content: '营收 / 利润 / 现金流。' },\n  { key: 'c', label: '研报', content: '近期券商观点。' },\n]} />`,
      Comp: () => (
        <div class="demo-row">
          <Tabs
            items={[
              { key: 'a', label: '概况', content: '公司基本面与行业地位。' },
              { key: 'b', label: '财务', content: '营收 / 利润 / 现金流。' },
              { key: 'c', label: '研报', content: '近期券商观点。' },
            ]}
          />
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<Tabs items={items} defaultValue="on-a" />\n<Tabs items={items} defaultValue="on-a" glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <Tabs
            defaultValue="on-a"
            items={[
              { key: 'on-a', label: '概况', content: '默认磨砂。滚动箭头随 glass 变化。' },
              { key: 'on-b', label: '财务', content: '营收 / 利润。' },
            ]}
          />
          <Tabs
            glass={false}
            defaultValue="off-a"
            items={[
              { key: 'off-a', label: '概况', content: '关闭玻璃：实心。' },
              { key: 'off-b', label: '财务', content: '营收 / 利润。' },
            ]}
          />
        </div>
      ),
    },
    {
      title: '受控选中（value）',
      desc: 'value + onChange 受控选中 key，非受控用 defaultValue。',
      code: `const v = signal('a');\n<Tabs items={items} value={() => v()} onChange={(k) => v.set(k)} />\n<p>当前 tab：{v()}</p>`,
      Comp: () => {
        const v = signal('a');
        return (
          <div>
            <Tabs
              value={() => v()}
              onChange={(k: string) => v.set(k)}
              items={[
                { key: 'a', label: '概况', content: '公司基本面与行业地位。' },
                { key: 'b', label: '财务', content: '营收 / 利润 / 现金流。' },
                { key: 'c', label: '研报', content: '近期券商观点。' },
              ]}
            />
            <p class="demo-hint">当前 tab：{v()}</p>
          </div>
        );
      },
    },
  ],

  Breadcrumb: [
    {
      title: '路径导航',
      desc: 'items 描述路径，末项自动标记为当前页；separator 自定义分隔符。',
      code: `<Breadcrumb items={[\n  { label: '研究', href: '#' },\n  { label: '行业', href: '#' },\n  { label: '白酒' },\n]} />`,
      Comp: () => (
        <div class="demo-row">
          <Breadcrumb
            items={[
              { label: '研究', href: '#' },
              { label: '行业', href: '#' },
              { label: '白酒' },
            ]}
          />
        </div>
      ),
    },
    {
      title: '自定义分隔符（separator）',
      desc: 'separator 接收节点，默认斜杠；末项始终为当前页，不渲染为链接。',
      code: `<Breadcrumb items={items} separator="›" />\n<Breadcrumb items={items} separator="→" />`,
      Comp: () => {
        const items = [
          { label: '研究', href: '#' },
          { label: '行业', href: '#' },
          { label: '白酒' },
        ];
        return (
          <div style="display: flex; flex-direction: column; gap: 10px">
            <Breadcrumb items={items} separator="›" />
            <Breadcrumb items={items} separator="→" />
            <p class="demo-hint">默认分隔符为「/」。</p>
          </div>
        );
      },
    },
  ],

  Steps: [
    {
      title: '流程向导',
      desc: 'steps 描述流程，defaultCurrent 非受控初始；clickable 时点击步骤触发 onChange。',
      code: `<Steps steps={[\n  { title: '选股', desc: '筛选池' },\n  { title: '回测', desc: '历史验证' },\n  { title: '实盘', desc: '跟踪' },\n]} defaultCurrent={1} />`,
      Comp: () => (
        <div class="demo-row">
          <Steps
            steps={[
              { title: '选股', desc: '筛选池' },
              { title: '回测', desc: '历史验证' },
              { title: '实盘', desc: '跟踪' },
            ]}
            defaultCurrent={1}
          />
        </div>
      ),
    },
    {
      title: '受控步骤与可点击',
      desc: 'current + onChange 受控当前步；clickable 允许点击步骤跳转（默认 true），关闭后仅作展示。',
      code: `const i = signal(1);\n<Steps steps={steps} current={() => i()} clickable onChange={(idx) => i.set(idx)} />\n<p>当前第 {i() + 1} 步</p>`,
      Comp: () => {
        const i = signal(1);
        return (
          <div>
            <Steps
              steps={[
                { title: '选股', desc: '筛选池' },
                { title: '回测', desc: '历史验证' },
                { title: '实盘', desc: '跟踪调仓' },
              ]}
              current={() => i()}
              clickable
              onChange={(idx: number) => i.set(idx)}
            />
            <p class="demo-hint">当前第 {i() + 1} 步</p>
          </div>
        );
      },
    },
  ],

  Pagination: [
    {
      title: '分页',
      desc: 'total + pageSize 推导页数，defaultPage 非受控初始；onChange 翻页回调。',
      code: `<Pagination total={240} pageSize={10} defaultPage={3} />`,
      Comp: () => (
        <div class="demo-row">
          <Pagination total={240} pageSize={10} defaultPage={3} />
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<Pagination total={240} pageSize={10} defaultPage={3} />\n<Pagination total={240} pageSize={10} defaultPage={3} glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <Pagination total={240} pageSize={10} defaultPage={3} />
          <Pagination total={240} pageSize={10} defaultPage={3} glass={false} />
        </div>
      ),
    },
    {
      title: '受控翻页与 siblingCount',
      desc: 'page + onChange 受控当前页；siblingCount 控制当前页两侧保留的页码数。',
      code: `const p = signal(1);\n<Pagination total={500} pageSize={10} page={() => p()} onChange={(v) => p.set(v)} siblingCount={2} />\n<p>当前第 {p()} 页</p>`,
      Comp: () => {
        const p = signal(1);
        return (
          <div>
            <Pagination
              total={500}
              pageSize={10}
              page={() => p()}
              onChange={(v: number) => p.set(v)}
              siblingCount={2}
            />
            <p class="demo-hint">当前第 {p()} 页</p>
          </div>
        );
      },
    },
  ],

  Tooltip: [
    {
      title: '提示变体',
      desc: '默认 surface 跟随主题表面并带毛玻璃；variant=invert 切换为反转色。默认 placement=top。',
      code: `<Tooltip content="这是一条提示"><Button>悬停查看</Button></Tooltip>\n<Tooltip content="反转色提示" variant="invert"><Button variant="outline">invert</Button></Tooltip>`,
      Comp: () => (
        <div class="demo-row">
          <Tooltip content="这是一条提示">
            <Button>悬停查看</Button>
          </Tooltip>
          <Tooltip content="反转色提示" variant="invert">
            <Button variant="outline">invert</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。',
      code: `<Tooltip content="默认：磨砂气泡"><Button>悬停：磨砂</Button></Tooltip>\n<Tooltip content="关闭：实心气泡" variant="surface" glass={false}><Button variant="outline">悬停：实心</Button></Tooltip>`,
      Comp: () => (
        <div class="demo-row">
          <Tooltip content="默认：磨砂气泡">
            <Button>悬停：磨砂</Button>
          </Tooltip>
          <Tooltip content="关闭：实心气泡" variant="surface" glass={false}>
            <Button variant="outline">悬停：实心</Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '方位 / 延迟 / 禁用',
      desc: 'placement 四向定位；delay 为显示延迟毫秒；disabled 为 true 时完全不弹层（仍保留无障碍标签）。',
      code: `<Tooltip content="上方" placement="top"><Button>top</Button></Tooltip>\n<Tooltip content="延迟 600ms" delay={600}><Button>delay</Button></Tooltip>\n<Tooltip content="不会出现" disabled><Button>disabled</Button></Tooltip>`,
      Comp: () => {
        return (
          <div class="demo-row">
            <Tooltip content="上方" placement="top"><Button>top</Button></Tooltip>
            <Tooltip content="右侧" placement="right"><Button>right</Button></Tooltip>
            <Tooltip content="下方" placement="bottom"><Button>bottom</Button></Tooltip>
            <Tooltip content="左侧" placement="left"><Button>left</Button></Tooltip>
            <Tooltip content="延迟 600ms 才出现" delay={600}><Button>delay=600</Button></Tooltip>
            <Tooltip content="不会出现" disabled><Button>disabled</Button></Tooltip>
          </div>
        );
      },
    },
    {
      title: '受控显隐（open）',
      desc: 'open + onOpenChange 受控显隐（非受控用 defaultOpen）；与校验/引导联动时可强制展示提示。',
      code: `const open = signal(false);\n<Tooltip content="受控提示" open={() => open()} onOpenChange={(v) => open.set(v)}>\n  <Button variant="outline">{open() ? '已展开' : '已收起'}</Button>\n</Tooltip>\n<p>当前状态：{open() ? '显示' : '隐藏'}</p>\n<Tooltip content="非受控：初始即显示" defaultOpen>\n  <Button variant="outline">defaultOpen</Button>\n</Tooltip>`,
      Comp: () => {
        const open = signal(false);
        return (
          <div>
            <Tooltip content="受控提示" open={() => open()} onOpenChange={(v: boolean) => open.set(v)}>
              <Button variant="outline">{open() ? '已展开' : '已收起'}</Button>
            </Tooltip>
            <Tooltip content="非受控：初始即显示" defaultOpen>
              <Button variant="outline">defaultOpen</Button>
            </Tooltip>
            <p class="demo-hint">当前状态：{open() ? '显示' : '隐藏'}</p>
          </div>
        );
      },
    },
  ],

  Popover: [
    {
      title: '可交互浮层',
      desc: 'content 可放置按钮等可交互元素（区别于 Tooltip），hover/focus 弹出，外部点击关闭。',
      code: `<Popover content={Panel()}>\n  <Button>触发浮层</Button>\n</Popover>`,
      Comp: () => (
        <div class="demo-row">
          <Popover content={PopoverPanel()}>
            <Button>触发浮层</Button>
          </Popover>
        </div>
      ),
    },
    {
      title: '受控显隐（open）',
      desc: 'open + onOpenChange 受控显隐；非受控用 defaultOpen；content 面板可放可交互内容。',
      code: `const open = signal(false);\n<Popover open={() => open()} onOpenChange={(v) => open.set(v)} content={panel}>\n  <Button variant="outline">受控浮层：{open() ? '已展开' : '已收起'}</Button>\n</Popover>\n<p>当前状态：{open() ? '展开' : '收起'}</p>\n<Popover defaultOpen content={panel}>\n  <Button variant="outline">defaultOpen</Button>\n</Popover>`,
      Comp: () => {
        const open = signal(false);
        return (
          <div>
            <Popover
              open={() => open()}
              onOpenChange={(v: boolean) => open.set(v)}
              content={PopoverPanel()}
            >
              <Button variant="outline">受控浮层：{open() ? '已展开' : '已收起'}</Button>
            </Popover>
            <Popover defaultOpen content={PopoverPanel()}>
              <Button variant="outline">defaultOpen</Button>
            </Popover>
            <p class="demo-hint">当前状态：{open() ? '展开' : '收起'}</p>
          </div>
        );
      },
    },
  ],

  Dialog: [
    {
      title: '模态对话框',
      desc: 'open 为必填受控；内置焦点陷阱、Esc / 点遮罩关闭；title / footer 配置头部与底部。',
      code: `const open = signal(false);\n<Button onClick={() => open.set(true)}>打开 Dialog</Button>\n<Dialog open={() => open()} onOpenChange={(v) => open.set(v)} title="新建策略"\n  footer={Footer({ onClose: () => open.set(false) })}>\n  <p>支持焦点陷阱与 Esc 关闭。</p>\n</Dialog>`,
      Comp: () => {
        const open = signal(false);
        return (
          <>
            <Button onClick={() => open.set(true)}>打开 Dialog</Button>
            <Dialog
              open={() => open()}
              onOpenChange={(v: boolean) => open.set(v)}
              title="新建策略"
              footer={DialogFooter({ onClose: () => open.set(false) })}
            >
              Dialog 支持焦点陷阱、Esc / 点遮罩关闭，纯走 theme.css。
            </Dialog>
          </>
        );
      },
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。',
      code: `const a = signal(false);\nconst b = signal(false);\n<Button onClick={() => a.set(true)}>默认：磨砂</Button>\n<Button variant="outline" onClick={() => b.set(true)}>关闭：实心</Button>\n<Dialog open={() => a()} onOpenChange={(v) => a.set(v)} title="磨砂面板">面板走 backdrop-filter。</Dialog>\n<Dialog open={() => b()} onOpenChange={(v) => b.set(v)} title="实心面板" glass={false}>背景不透明。</Dialog>`,
      Comp: () => {
        const a = signal(false);
        const b = signal(false);
        return (
          <div class="demo-row">
            <Button onClick={() => a.set(true)}>默认：磨砂</Button>
            <Button variant="outline" onClick={() => b.set(true)}>关闭：实心</Button>
            <Dialog open={() => a()} onOpenChange={(v: boolean) => a.set(v)} title="磨砂面板">
              面板背景走 backdrop-filter 毛玻璃。
            </Dialog>
            <Dialog open={() => b()} onOpenChange={(v: boolean) => b.set(v)} title="实心面板" glass={false}>
              背景为不透明实心面，无 backdrop-filter。
            </Dialog>
          </div>
        );
      },
    },
    {
      title: '点遮罩不关闭（closeOnOverlay）',
      desc: 'closeOnOverlay=false 时点击遮罩不关闭，只保留 Esc 与显式按钮，避免误触丢失填写内容。',
      code: `const open = signal(false);\n<Button onClick={() => open.set(true)}>打开（点遮罩不关闭）</Button>\n<Dialog open={() => open()} onOpenChange={(v) => open.set(v)} title="填写中"\n  closeOnOverlay={false}>\n  点击背景不会关闭，需点按钮或按 Esc。\n</Dialog>`,
      Comp: () => {
        const open = signal(false);
        return (
          <div class="demo-row">
            <Button onClick={() => open.set(true)}>打开（点遮罩不关闭）</Button>
            <Dialog
              open={() => open()}
              onOpenChange={(v: boolean) => open.set(v)}
              title="填写中"
              closeOnOverlay={false}
            >
              点击背景不会关闭，需点按钮或按 Esc。
            </Dialog>
          </div>
        );
      },
    },
  ],

  Drawer: [
    {
      title: '侧滑抽屉',
      desc: 'side 控制滑出方向（right/left/bottom）；showClose 控制关闭按钮；同样具备焦点陷阱。',
      code: `const open = signal(false);\n<Drawer open={() => open()} onOpenChange={(v) => open.set(v)} title="筛选条件" subtitle="右侧滑出">\n  承载较复杂的筛选 / 表单。\n</Drawer>`,
      Comp: () => {
        const open = signal(false);
        return (
          <>
            <Button onClick={() => open.set(true)}>打开 Drawer</Button>
            <Drawer
              open={() => open()}
              onOpenChange={(v: boolean) => open.set(v)}
              title="筛选条件"
              subtitle="右侧滑出"
            >
              Drawer 用于承载较复杂的筛选 / 表单。
            </Drawer>
          </>
        );
      },
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。',
      code: `const a = signal(false);\nconst b = signal(false);\n<Button onClick={() => a.set(true)}>默认：磨砂</Button>\n<Button variant="outline" onClick={() => b.set(true)}>关闭：实心</Button>\n<Drawer open={() => a()} onOpenChange={(v) => a.set(v)} title="磨砂抽屉">面板走 backdrop-filter。</Drawer>\n<Drawer open={() => b()} onOpenChange={(v) => b.set(v)} title="实心抽屉" glass={false}>背景不透明。</Drawer>`,
      Comp: () => {
        const a = signal(false);
        const b = signal(false);
        return (
          <div class="demo-row">
            <Button onClick={() => a.set(true)}>默认：磨砂</Button>
            <Button variant="outline" onClick={() => b.set(true)}>关闭：实心</Button>
            <Drawer open={() => a()} onOpenChange={(v: boolean) => a.set(v)} title="磨砂抽屉">
              抽屉面板背景走 backdrop-filter 毛玻璃。
            </Drawer>
            <Drawer open={() => b()} onOpenChange={(v: boolean) => b.set(v)} title="实心抽屉" glass={false}>
              背景为不透明实心面，无 backdrop-filter。
            </Drawer>
          </div>
        );
      },
    },
    {
      title: '方向 / 关闭按钮 / 遮罩行为',
      desc: 'side 支持 right / left / bottom；showClose=false 隐藏右上角关闭；closeOnOverlay=false 需显式关闭。',
      code: `const a = signal(false);\nconst b = signal(false);\n<Button onClick={() => a.set(true)}>底部 + 无关闭按钮</Button>\n<Button variant="outline" onClick={() => b.set(true)}>左侧 + 点遮罩不关闭</Button>\n<Drawer open={() => a()} onOpenChange={(v) => a.set(v)} title="底部抽屉"\n  side="bottom" showClose={false}>bottom 方向 + 隐藏关闭按钮。</Drawer>\n<Drawer open={() => b()} onOpenChange={(v) => b.set(v)} title="左侧抽屉"\n  side="left" closeOnOverlay={false}>左侧滑出，点遮罩不关闭。</Drawer>`,
      Comp: () => {
        const a = signal(false);
        const b = signal(false);
        return (
          <div class="demo-row">
            <Button onClick={() => a.set(true)}>底部 + 无关闭按钮</Button>
            <Button variant="outline" onClick={() => b.set(true)}>左侧 + 点遮罩不关闭</Button>
            <Drawer
              open={() => a()}
              onOpenChange={(v: boolean) => a.set(v)}
              title="底部抽屉"
              side="bottom"
              showClose={false}
            >
              side=bottom 从底部滑出，showClose=false 隐藏关闭按钮。
            </Drawer>
            <Drawer
              open={() => b()}
              onOpenChange={(v: boolean) => b.set(v)}
              title="左侧抽屉"
              side="left"
              closeOnOverlay={false}
            >
              side=left 从左侧滑出，closeOnOverlay=false 点遮罩不关闭。
            </Drawer>
          </div>
        );
      },
    },
  ],

  ContextMenu: [
    {
      title: '右键菜单',
      desc: 'target 指定右键目标；items 定义菜单项（支持 shortcut / danger / separator）；onSelect 回调 key。',
      code: `<div id="pg-cm" class="demo-target">右键此区域唤出菜单</div>\n<ContextMenu target={() => document.getElementById('pg-cm')} items={items} onSelect={(k) => toast('执行：' + k)} />`,
      Comp: () => {
        const items = [
          { key: 'edit', label: '编辑' },
          { key: 'copy', label: '复制', shortcut: '⌘C' },
          { key: 'del', label: '删除', danger: true },
        ];
        return (
          <>
            <div id="pg-cm" class="demo-target">
              右键此区域唤出菜单
            </div>
            <ContextMenu
              items={items}
              target={() => document.getElementById('pg-cm')}
              onSelect={(k: string) => toast('执行：' + k)}
            />
          </>
        );
      },
    },
    {
      title: '受控显隐与命令回调',
      desc: 'open + onOpenChange 受控显隐；onSelect 回传被点击的命令 key；items 支持 shortcut / danger / separator。',
      code: `const open = signal(false);\nconst last = signal('—');\n<ContextMenu target={() => document.getElementById('ctx-adv')} items={items}\n  open={() => open()} onOpenChange={(v) => open.set(v)}\n  onSelect={(k) => last.set(k)} />\n<div id="ctx-adv" class="demo-target">右键此区域</div>\n<p>菜单：{open() ? '展开' : '收起'} · 最近命令：{last()}</p>`,
      Comp: () => {
        const open = signal(false);
        const last = signal('—');
        return (
          <div>
            <div id="ctx-adv" class="demo-target">
              右键此区域唤出受控菜单
            </div>
            <ContextMenu
              target={() => document.getElementById('ctx-adv')}
              open={() => open()}
              onOpenChange={(v: boolean) => open.set(v)}
              onSelect={(k: string) => last.set(k)}
              items={[
                { key: 'edit', label: '编辑' },
                { key: 'copy', label: '复制', shortcut: '⌘C' },
                { key: 'sep', label: '', separator: true },
                { key: 'del', label: '删除', danger: true },
              ]}
            />
            <p class="demo-hint">
              菜单：{open() ? '展开' : '收起'} · 最近命令：{last()}
            </p>
          </div>
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
        <div class="demo-row">
          <Tree data={treeData} defaultExpandedKeys={['1']} defaultCheckedKeys={['1-1']} />
        </div>
      ),
    },
    {
      title: '受控展开与勾选',
      desc: 'expandedKeys / checkedKeys 受控；onExpand / onCheck 回传新集合与变更详情；checkable=false 时退化为纯展开树。',
      code: `const expanded = signal<string[]>(['1']);\nconst checked = signal<string[]>(['1-1']);\n<Tree data={treeData} checkable expandedKeys={() => expanded()}\n  checkedKeys={() => checked()} onExpand={(keys) => expanded.set(keys)}\n  onCheck={(keys) => checked.set(keys)} />\n<p>展开 {expanded().length} 组 / 勾选 {checked().length} 项</p>`,
      Comp: () => {
        const expanded = signal<string[]>(['1']);
        const checked = signal<string[]>(['1-1']);
        return (
          <div>
            <Tree
              data={treeData}
              checkable
              expandedKeys={() => expanded()}
              checkedKeys={() => checked()}
              onExpand={(keys: string[]) => expanded.set(keys)}
              onCheck={(keys: string[]) => checked.set(keys)}
            />
            <p class="demo-hint">
              展开 {expanded().length} 组 / 勾选 {checked().length} 项
            </p>
          </div>
        );
      },
    },
  ],

  Slider: [
    {
      title: '区间滑块',
      desc: '双滑块选择区间；format 控制标签格式（pct/num）；支持拖拽与键盘微调。',
      code: `<Slider min={0} max={100} defaultValue={[20, 80]} format="pct" />`,
      Comp: () => (
        <div class="demo-row" style="width:320px">
          <Slider min={0} max={100} defaultValue={[20, 80]} format="pct" />
        </div>
      ),
    },
    {
      title: '受控区间与步长',
      desc: 'value + onChange 受控区间值；step 控制微调粒度；minLabel / maxLabel 自定义两端标签。',
      code: `const v = signal<[number, number]>([20, 60]);\n<Slider min={0} max={100} step={5} value={() => v()}\n  onChange={(val) => v.set(val)} minLabel="保守" maxLabel="激进" />\n<p>当前区间：{v()[0]} – {v()[1]}</p>`,
      Comp: () => {
        const v = signal<[number, number]>([20, 60]);
        return (
          <div style="width: 360px">
            <Slider
              min={0}
              max={100}
              step={5}
              value={() => v()}
              onChange={(val: [number, number]) => v.set(val)}
              minLabel="保守"
              maxLabel="激进"
            />
            <p class="demo-hint">当前区间：{v()[0]} – {v()[1]}</p>
          </div>
        );
      },
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
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<DataTable columns={columns} data={data} compact />\n<DataTable columns={columns} data={data} compact glass={false} />`,
      Comp: () => (
        <div class="demo-row">
          <DataTable columns={tableColumns} data={tableData} compact />
          <DataTable columns={tableColumns} data={tableData} compact glass={false} />
        </div>
      ),
    },
    {
      title: '受控排序与选中',
      desc: 'sortKey + sortDir 受控排序列（组件只维护表头指示与回调，数据排序由业务侧执行）；selectedKeys + onSelect 受控选中行。',
      code: `const sort = signal<{ key: string; dir: 'asc' | 'desc' }>({ key: 'price', dir: 'desc' });\nconst sel = signal<string[]>([]);\nconst rows = () => [...tableData].sort((a, b) => sort().dir === 'asc' ? a.price - b.price : b.price - a.price);\n<DataTable columns={columns} data={() => rows()} compact selectable rowKey="code"\n  sortKey={() => sort().key} sortDir={() => sort().dir}\n  onSort={(key, dir) => sort.set({ key, dir })}\n  selectedKeys={() => sel()} onSelect={(keys) => sel.set(keys)} />\n<p>排序：{sort().key} {sort().dir} · 已选 {sel().length} 行</p>`,
      Comp: () => {
        const sort = signal<{ key: string; dir: 'asc' | 'desc' }>({ key: 'price', dir: 'desc' });
        const sel = signal<string[]>([]);
        const rows = () =>
          [...tableData].sort((a, b) =>
            sort().dir === 'asc' ? a.price - b.price : b.price - a.price,
          );
        return (
          <div>
            <DataTable
              columns={tableColumns}
              data={() => rows()}
              compact
              selectable
              rowKey="code"
              sortKey={() => sort().key}
              sortDir={() => sort().dir}
              onSort={(key: string, dir: 'asc' | 'desc') => sort.set({ key, dir })}
              selectedKeys={() => sel()}
              onSelect={(keys: string[]) => sel.set(keys)}
            />
            <p class="demo-hint">
              排序：{sort().key} {sort().dir === 'asc' ? '升序' : '降序'} · 已选 {sel().length} 行
            </p>
          </div>
        );
      },
    },
    {
      title: '自定义单元格与初始排序',
      desc: 'columns[].render 覆盖默认取值渲染任意节点（plain 侧示例返回字符串）；defaultSortKey / defaultSortDir 给出非受控初始排序指示。',
      code: `const columns = [\n  { key: 'name', title: '名称', sticky: true },\n  { key: 'price', title: '最新价', numeric: true, sortable: true },\n  { key: 'chg', title: '涨跌幅', numeric: true,\n    render: (row) => (String(row.chg).startsWith('+') ? '▲ ' : '▼ ') + row.chg },\n];\n<DataTable columns={columns} data={data} compact defaultSortKey="price" defaultSortDir="asc" />`,
      Comp: () => {
        const columns = [
          { key: 'name', title: '名称', sticky: true },
          { key: 'price', title: '最新价', numeric: true, sortable: true },
          {
            key: 'chg',
            title: '涨跌幅',
            numeric: true,
            render: (row: Record<string, any>) =>
              (String(row.chg).startsWith('+') ? '▲ ' : '▼ ') + row.chg,
          },
        ];
        return (
          <DataTable
            columns={columns}
            data={tableData}
            compact
            defaultSortKey="price"
            defaultSortDir="asc"
          />
        );
      },
    },
  ],

  Toast: [
    {
      title: '命令式轻提示',
      desc: 'toast(content, options) 单例挂载 body；duration=0 常驻（重复调用重置计时），icon 传前置图标节点。',
      code: `toast('操作成功');\ntoast('正在保存…', { duration: 0 });\ntoast('已加入自选', { icon: StarIcon() });`,
      Comp: () => (
        <div class="demo-row">
          <Button onClick={() => toast('操作成功')}>默认 Toast</Button>
          <Button variant="outline" onClick={() => toast('正在保存…', { duration: 0 })}>
            常驻 Toast
          </Button>
          <Button variant="ghost" onClick={() => toast('已加入自选', { icon: StarIcon() })}>
            带图标 Toast
          </Button>
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。',
      code: `toast('默认：磨砂');\ntoast('关闭：实心', { glass: false });`,
      Comp: () => (
        <div class="demo-row">
          <Button onClick={() => toast('默认：磨砂')}>默认 Toast</Button>
          <Button variant="outline" onClick={() => toast('关闭：实心', { glass: false })}>
            关闭玻璃 Toast
          </Button>
        </div>
      ),
    },
  ],

  Message: [
    {
      title: '命令式通知',
      desc: 'showMessage(text, type?, duration?) 支持 success/warning/info/danger 四种语义。',
      code: `showMessage('数据已更新', 'success');\nshowMessage('请求失败', 'danger');\nshowMessage('部分字段已忽略', 'warning');\nshowMessage('已切换到研究视图', 'info');`,
      Comp: () => (
        <div class="demo-row">
          <Button onClick={() => showMessage('数据已更新', 'success')}>success</Button>
          <Button variant="outline" onClick={() => showMessage('请求失败', 'danger')}>
            danger
          </Button>
          <Button variant="outline" onClick={() => showMessage('部分字段已忽略', 'warning')}>
            warning
          </Button>
          <Button variant="ghost" onClick={() => showMessage('已切换到研究视图', 'info')}>
            info
          </Button>
        </div>
      ),
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。',
      code: `showMessage('默认：磨砂', 'success');\nshowMessage('关闭：实心', 'success', 2600, false);`,
      Comp: () => (
        <div class="demo-row">
          <Button onClick={() => showMessage('默认：磨砂', 'success')}>默认 Message</Button>
          <Button variant="outline" onClick={() => showMessage('关闭：实心', 'success', 2600, false)}>
            关闭玻璃 Message
          </Button>
        </div>
      ),
    },
  ],

  // ——— Accordion / Form / VirtualTable：plain 侧用例（React/Vue 用例见 react-demos / vue-demos）———
  Accordion: [
    {
      title: '手风琴',
      desc: 'items 数据集（可含 badge）；defaultActiveKeys 控制默认展开。',
      code: `<Accordion items={items} defaultActiveKeys={['1']} />`,
      Comp: () => {
        const items = [
          { key: '1', title: '行业研究', badge: '12', content: '覆盖 31 个申万一级行业。' },
          { key: '2', title: '个股追踪', content: '实时跟踪持仓标的异动。' },
          { key: '3', title: '风险提示', content: '市场有风险，投资需谨慎。' },
        ];
        return <Accordion items={items} defaultActiveKeys={['1']} />;
      },
    },
    {
      title: '受控展开（activeKeys）',
      desc: 'activeKeys 传入受控展开的 key 列表，onChange 回传新列表；非受控用 defaultActiveKeys。',
      code: `const keys = signal<string[]>(['1']);\n<Accordion items={items} activeKeys={() => keys()} onChange={(k) => keys.set(k)} />\n<p>当前展开：{keys().join('、') || '无'}</p>`,
      Comp: () => {
        const keys = signal<string[]>(['1']);
        const items = [
          { key: '1', title: '行业研究', badge: '12', content: '覆盖 31 个申万一级行业。' },
          { key: '2', title: '个股追踪', content: '实时跟踪持仓标的异动。' },
        ];
        return (
          <div>
            <Accordion
              items={items}
              activeKeys={() => keys()}
              onChange={(k: string[]) => keys.set(k)}
            />
            <p class="demo-hint">当前展开：{keys().join('、') || '无'}</p>
          </div>
        );
      },
    },
  ],

  Form: [
    {
      title: '表单',
      desc: 'fields 字段集；submit 时逐字段校验，未通过写行内错误，通过后回调 onSubmit。',
      code: `<Form fields={fields} onSubmit={(v) => console.log(v)} />`,
      Comp: () => {
        const fields = [
          { name: 'name', label: '名称', rules: [{ required: true, message: '必填' }] },
          { name: 'code', label: '代码', rules: [{ pattern: /^[A-Z0-9]+$/, message: '大写字母数字' }] },
        ];
        return <Form fields={fields} onSubmit={(v: any) => console.log(v)} />;
      },
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。',
      code: `<Form fields={fields} idPrefix="glass-on" />\n<Form fields={fields} idPrefix="glass-off" glass={false} />`,
      Comp: () => {
        const fields = [
          { name: 'name', label: '名称', rules: [{ required: true, message: '必填' }] },
          { name: 'code', label: '代码', placeholder: '大写字母数字' },
        ];
        return (
          <div class="demo-row">
            <Form fields={fields} idPrefix="glass-on" onSubmit={() => {}} />
            <Form fields={fields} idPrefix="glass-off" glass={false} onSubmit={() => {}} />
          </div>
        );
      },
    },
    {
      title: '栅格开关 / 字段类型 / 提交文案',
      desc: 'grid 默认 true（字段排成栅格），false 退化为纵向单列；submitText 自定义提交按钮文案；FormField.type 支持 text / date / number / email。',
      code: `const fields = [\n  { name: 'name', label: '名称', defaultValue: '贵州茅台' },\n  { name: 'date', label: '调仓日', type: 'date' },\n];\n<Form fields={fields} submitText="保存筛选条件" />\n<Form fields={fields} grid={false} submitText="保存（纵向）" />`,
      Comp: () => {
        const fields = [
          { name: 'name', label: '名称', defaultValue: '贵州茅台' },
          { name: 'date', label: '调仓日', type: 'date' as const },
        ];
        return (
          <div class="demo-row">
            <Form fields={fields} submitText="保存筛选条件" onSubmit={() => {}} />
            <Form fields={fields} grid={false} submitText="保存（纵向）" onSubmit={() => {}} />
          </div>
        );
      },
    },
    {
      title: '数值下限校验（rules.min）',
      desc: 'FormField.type=number 配合 rules.min 校验数值下限，message 覆盖默认文案；校验通过后 onSubmit 才拿到全部字段值。',
      code: `const fields = [\n  { name: 'weight', label: '单票权重(%)', type: 'number', placeholder: '如 12.5', rules: [{ min: 0, message: '需大于 0' }] },\n  { name: 'price', label: '委托价', type: 'number', placeholder: '如 1685.2', rules: [{ min: 0, message: '不能为负' }] },\n];\n<Form fields={fields} submitText="校验并提交" onSubmit={(v) => showMessage('通过：' + JSON.stringify(v), 'success')} />`,
      Comp: () => {
        const fields = [
          {
            name: 'weight',
            label: '单票权重(%)',
            type: 'number' as const,
            placeholder: '如 12.5',
            rules: [{ min: 0, message: '需大于 0' }],
          },
          {
            name: 'price',
            label: '委托价',
            type: 'number' as const,
            placeholder: '如 1685.2',
            rules: [{ min: 0, message: '不能为负' }],
          },
        ];
        return (
          <Form
            fields={fields}
            submitText="校验并提交"
            onSubmit={(v: Record<string, string>) =>
              showMessage('通过：' + JSON.stringify(v), 'success')
            }
          />
        );
      },
    },
  ],

  VirtualTable: [
    {
      title: '虚拟表',
      desc: '5000 行仅渲染可视窗口；首列 sticky；trend 涨跌着色。',
      code: `<VirtualTable rows={rows} columns={cols} rowHeight={33} />`,
      Comp: () => {
        const cols = [
          { key: 'code', title: '代码', sticky: true, width: '120px' },
          { key: 'name', title: '名称', width: '1fr' },
          {
            key: 'price',
            title: '价格',
            numeric: true,
            width: '100px',
            trend: (r: any) => (r.price > 0 ? 'up' : 'down'),
          },
        ];
        const rows = Array.from({ length: 5000 }, (_, i) => ({
          code: 'GN' + (1000 + i),
          name: '标的 ' + i,
          price: (i % 3) - 1,
        }));
        return <VirtualTable rows={rows} columns={cols} rowHeight={33} />;
      },
    },
    {
      title: '玻璃开关（glass）',
      desc: 'glass 默认 true 保持磨砂观感；传 false 时组件根节点输出 data-glass="off"，theme.css 把半透明面回退为不透明实心面并真移除 backdrop-filter（不是把透明度压到 100%）。左为默认，右为关闭。',
      code: `<VirtualTable rows={rows} columns={columns} />\n<VirtualTable rows={rows} columns={columns} glass={false} />`,
      Comp: () => {
        const cols = [
          { key: 'code', title: '代码', sticky: true, width: '96px' },
          { key: 'name', title: '名称', width: '1fr' },
        ];
        const rows = Array.from({ length: 200 }, (_, i) => ({
          code: 'GN' + (1000 + i),
          name: '标的 ' + i,
        }));
        return (
          <div class="demo-row">
            <VirtualTable rows={rows} columns={cols} rowHeight={33} />
            <VirtualTable rows={rows} columns={cols} rowHeight={33} glass={false} />
          </div>
        );
      },
    },
    {
      title: '缓冲行与无障碍名',
      desc: 'buffer 控制可视窗口上下额外渲染的行数（越大滚动越稳、开销越高）；ariaLabel 提供表格无障碍名。',
      code: `<VirtualTable rows={rows} columns={cols} rowHeight={28} buffer={20}\n  ariaLabel="标的行情虚拟表" />`,
      Comp: () => {
        const cols = [
          { key: 'code', title: '代码', sticky: true, width: '96px' },
          { key: 'name', title: '名称', width: '1fr' },
        ];
        const rows = Array.from({ length: 2000 }, (_, i) => ({
          code: 'GN' + (1000 + i),
          name: '标的 ' + i,
        }));
        return (
          <div style="height: 200px">
            <VirtualTable
              rows={rows}
              columns={cols}
              rowHeight={28}
              buffer={20}
              ariaLabel="标的行情虚拟表"
            />
          </div>
        );
      },
    },
  ],

  // ——— Icon 契约页（Plain 侧不能把 JSX 写进属性，需「调用子组件」传入结果）———
  Icon: [
    {
      title: '自备图标传入',
      desc: '组件不内置图标库：任意 24×24 viewBox + currentColor 的节点都能塞进 icon 插槽。Plain 侧不能把 JSX 直接写进属性，要「调用子组件」传入结果。',
      code: `function PlusIcon() {\n  return (\n    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"\n         stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n      <path d="M12 5v14M5 12h14"></path>\n    </svg>\n  );\n}\n\n<Button icon={PlusIcon()} variant="primary">新建</Button>\n<Tag icon={StarIcon()} type="brand">重点</Tag>`,
      Comp: () => (
        <div class="demo-row">
          <Button icon={PlusIcon()} variant="primary">
            新建
          </Button>
          <Tag icon={StarIcon()} type="brand">
            重点
          </Tag>
        </div>
      ),
    },
    {
      title: '尺寸跟随容器',
      desc: '图标自身不写 width/height，尺寸由容器的 .ui-icon 与 --ui-icon-size 决定，随 size 档位自动缩放。',
      code: `<Button size="lg" variant="primary" icon={PlusIcon()}>大</Button>\n<Button variant="primary" icon={PlusIcon()}>中</Button>\n<Button size="sm" variant="primary" icon={PlusIcon()}>小</Button>`,
      Comp: () => (
        <div class="demo-row">
          <Button size="lg" variant="primary" icon={PlusIcon()}>
            大
          </Button>
          <Button variant="primary" icon={PlusIcon()}>
            中
          </Button>
          <Button size="sm" variant="primary" icon={PlusIcon()}>
            小
          </Button>
        </div>
      ),
    },
    {
      title: '可覆盖与不可覆盖',
      desc: '内容类图标（Empty 的占位图）走 icon 插槽，可整段覆盖；状态类图标（Steps 已完成步的 check）是组件语义的一部分，内置且不可替换。',
      code: `<Empty description="可覆盖：传入自备图标" icon={StarIcon()} />\n<Steps steps={[{ title: '选股' }, { title: '回测' }, { title: '实盘' }]} defaultCurrent={2} />`,
      Comp: () => (
        <div class="demo-row">
          <Empty description="可覆盖：传入自备图标" icon={StarIcon()} />
          <Steps
            steps={[{ title: '选股' }, { title: '回测' }, { title: '实盘' }]}
            defaultCurrent={2}
          />
        </div>
      ),
    },
  ],
};
