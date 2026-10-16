import { h, defineComponent, ref, type DefineComponent } from 'vue';
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
} from 'uni-ui/vue';

/** 单个 Vue 用例：代码片段 + 实时 demo 组件（title/desc 复用 reactDocs） */
export interface DemoCase {
  code: string;
  Comp: DefineComponent;
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

const accordionItems = [
  { key: '1', title: '行业研究', badge: '12', content: '覆盖 31 个申万一级行业。' },
  { key: '2', title: '个股追踪', content: '实时跟踪持仓标的异动。' },
  { key: '3', title: '风险提示', content: '市场有风险，投资需谨慎。' },
];

const formFields = [
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

const vtableColumns = [
  { key: 'code', title: '代码', sticky: true, width: '120px' },
  { key: 'name', title: '名称', width: '1fr' },
  {
    key: 'price',
    title: '最新价',
    numeric: true,
    width: '100px',
    trend: (row: Record<string, any>): 'up' | 'down' => (row.price > 0 ? 'up' : 'down'),
  },
];
const vtableRows = Array.from({ length: 5000 }, (_, i) => ({
  code: 'GN' + (1000 + i),
  name: '标的 ' + i,
  price: (i % 3) - 1,
}));

/** 静态用例助手：setup 直接返回渲染函数（makeRender() 即渲染函数），避免层级错位被 Vue 当文本渲染 */
const S = (makeRender: () => () => ReturnType<typeof h>): DefineComponent =>
  defineComponent({ setup: makeRender });

export const vueDocs: Record<string, DemoCase[]> = {
  Button: [
    {
      code: `<Button>默认</Button>\n<Button variant="primary">主要</Button>\n<Button variant="ghost">幽灵</Button>\n<Button variant="outline">描边</Button>\n<Button variant="danger">危险</Button>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, null, '默认'),
          h(Button, { variant: 'primary' }, '主要'),
          h(Button, { variant: 'ghost' }, '幽灵'),
          h(Button, { variant: 'outline' }, '描边'),
          h(Button, { variant: 'danger' }, '危险'),
        ]),
      ),
    },
    {
      code: `<Button size="lg" variant="primary">大</Button>\n<Button variant="primary">中</Button>\n<Button size="sm" variant="primary">小</Button>\n<Button size="xs" variant="primary">超小</Button>\n<Button pill>胶囊</Button>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { size: 'lg', variant: 'primary' }, '大'),
          h(Button, { variant: 'primary' }, '中'),
          h(Button, { size: 'sm', variant: 'primary' }, '小'),
          h(Button, { size: 'xs', variant: 'primary' }, '超小'),
          h(Button, { pill: true }, '胶囊'),
        ]),
      ),
    },
    {
      code: `<Button loading variant="primary">提交中</Button>\n<Button disabled>禁用</Button>\n<Button variant="outline" :icon="() => '★'">带图标</Button>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { loading: true, variant: 'primary' }, '提交中'),
          h(Button, { disabled: true }, '禁用'),
          h(Button, { variant: 'outline', icon: h('span', '★') }, '带图标'),
        ]),
      ),
    },
  ],

  Tag: [
    {
      code: `<Tag>常规</Tag>\n<Tag type="brand">品牌</Tag>\n<Tag type="up">上涨</Tag>\n<Tag type="down">下跌</Tag>\n<Tag closable @close="() => {}">可关闭</Tag>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Tag, null, '常规'),
          h(Tag, { type: 'brand' }, '品牌'),
          h(Tag, { type: 'up' }, '上涨'),
          h(Tag, { type: 'down' }, '下跌'),
          h(Tag, { closable: true, onClose: () => {} }, '可关闭'),
        ]),
      ),
    },
    {
      code: `<Tag color="#7c5cff">紫</Tag>\n<Tag color="#00b894">青</Tag>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Tag, { color: '#7c5cff' }, '紫'),
          h(Tag, { color: '#00b894' }, '青'),
        ]),
      ),
    },
  ],

  Badge: [
    {
      code: `<Badge tone="brand" :count="9"><Avatar text="A" /></Badge>\n<Badge tone="danger" :count="120"><Avatar text="B" /></Badge>\n<Badge tone="success" dot><Avatar text="C" /></Badge>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Badge, { tone: 'brand', count: 9 }, { default: () => h(Avatar, { text: 'A' }) }),
          h(Badge, { tone: 'danger', count: 120 }, { default: () => h(Avatar, { text: 'B' }) }),
          h(Badge, { tone: 'success', dot: true }, { default: () => h(Avatar, { text: 'C' }) }),
        ]),
      ),
    },
    {
      code: `<Badge tone="danger" :count="99"><Button>消息</Button></Badge>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Badge, { tone: 'danger', count: 99 }, { default: () => h(Button, null, '消息') }),
          h(Badge, { tone: 'warning', dot: true }, { default: () => h(Button, { variant: 'outline' }, '待办') }),
        ]),
      ),
    },
  ],

  Avatar: [
    {
      code: `<Avatar text="茅台" tone="brand" />\n<Avatar text="宁" tone="success" />\n<Avatar :icon="() => '★'" tone="warning" />\n<Avatar src="https://i.pravatar.cc/80?img=12" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Avatar, { text: '茅台', tone: 'brand' }),
          h(Avatar, { text: '宁', tone: 'success' }),
          h(Avatar, { icon: h('span', '★'), tone: 'warning' }),
          h(Avatar, { src: 'https://i.pravatar.cc/80?img=12' }),
        ]),
      ),
    },
    {
      code: `<Avatar size="xs" text="A" />\n<Avatar size="sm" text="B" />\n<Avatar size="md" text="C" />\n<Avatar size="lg" text="D" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Avatar, { size: 'xs', text: 'A' }),
          h(Avatar, { size: 'sm', text: 'B' }),
          h(Avatar, { size: 'md', text: 'C' }),
          h(Avatar, { size: 'lg', text: 'D' }),
        ]),
      ),
    },
  ],

  Input: [
    {
      code: `<script setup>\nconst v = ref('');\n</script>\n<Input :value="v" @change="v = $event" placeholder="搜索标的 / 代码" />\n<Input model-value="错误示例" error />\n<Input model-value="不可编辑" disabled />`,
      Comp: defineComponent({
        setup() {
          const v = ref('');
          return () =>
            h('div', { class: 'demo-row' }, [
              h(Input, { value: v.value, onChange: (val: string) => (v.value = val), placeholder: '搜索标的 / 代码' }),
              h(Input, { value: '错误示例', error: true }),
              h(Input, { value: '不可编辑', disabled: true }),
            ]);
        },
      }),
    },
    {
      code: `<Input :prefix="() => '🔍'" placeholder="搜索" />\n<Input :suffix="() => '%'" model-value="12" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Input, { prefix: h('span', '🔍'), placeholder: '搜索' }),
          h(Input, { suffix: h('span', '%'), value: '12' }),
        ]),
      ),
    },
  ],

  Switch: [
    {
      code: `<script setup>\nconst on = ref(true);\n</script>\n<Switch :checked="on" @change="on = $event" label="实时行情" />`,
      Comp: defineComponent({
        setup() {
          const on = ref(true);
          return () =>
            h('div', { class: 'demo-row' }, [
              h(Switch, { checked: on.value, onChange: (val: boolean) => (on.value = val), label: '实时行情' }),
              h('span', { class: 'ui-label' }, on.value ? '开' : '关'),
            ]);
        },
      }),
    },
    {
      code: `<Switch default-checked size="lg" />\n<Switch size="sm" disabled />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Switch, { defaultChecked: true, size: 'lg' }),
          h(Switch, { size: 'sm', disabled: true }),
        ]),
      ),
    },
  ],

  Select: [
    {
      code: `<Select :options="[{ label: '贵州茅台', value: '600519' }, { label: '宁德时代', value: '300750' }]" placeholder="选择标的" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Select, {
            options: [
              { label: '贵州茅台', value: '600519' },
              { label: '宁德时代', value: '300750' },
              { label: '招商银行', value: '600036' },
            ],
            placeholder: '选择标的',
          }),
        ]),
      ),
    },
    {
      code: `<Select multiple searchable :options="[{ label: '银行', value: 'bank' }, { label: '券商', value: 'broker' }, { label: '保险', value: 'ins' }]" placeholder="多选 + 搜索" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Select, {
            multiple: true,
            searchable: true,
            options: [
              { label: '银行', value: 'bank' },
              { label: '券商', value: 'broker' },
              { label: '保险', value: 'ins' },
            ],
            placeholder: '多选 + 搜索',
          }),
        ]),
      ),
    },
  ],

  NumberInput: [
    {
      code: `<NumberInput prefix="¥" :precision="2" :default-value="1234567.5" />\n<NumberInput suffix="%" :precision="1" :default-value="12.3" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(NumberInput, { prefix: '¥', precision: 2, defaultValue: 1234567.5 }),
          h(NumberInput, { suffix: '%', precision: 1, defaultValue: 12.3 }),
        ]),
      ),
    },
    {
      code: `<NumberInput :min="0" :max="100" :step="5" :default-value="50" suffix="%" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(NumberInput, { min: 0, max: 100, step: 5, defaultValue: 50, suffix: '%' }),
        ]),
      ),
    },
  ],

  DatePicker: [
    {
      code: `<DatePicker default-value="2026-01-01" />`,
      Comp: S(() => () => h('div', { class: 'demo-row' }, [h(DatePicker, { defaultValue: '2026-01-01' })])),
    },
    {
      code: `<DatePicker range :default-value="['2026-01-01', '2026-01-31']" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(DatePicker, { range: true, defaultValue: ['2026-01-01', '2026-01-31'] }),
        ]),
      ),
    },
  ],

  Segmented: [
    {
      code: `<Segmented :options="[{ label: '日K', value: 'd' }, { label: '周K', value: 'w' }, { label: '月K', value: 'm' }]" default-value="d" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Segmented, {
            options: [
              { label: '日K', value: 'd' },
              { label: '周K', value: 'w' },
              { label: '月K', value: 'm' },
            ],
            defaultValue: 'd',
          }),
        ]),
      ),
    },
    {
      code: `<Segmented size="sm" :options="[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]" default-value="a" />\n<Segmented disabled :options="[{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }]" default-value="a" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Segmented, { size: 'sm', options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], defaultValue: 'a' }),
          h(Segmented, { disabled: true, options: [{ label: 'A', value: 'a' }, { label: 'B', value: 'b' }], defaultValue: 'a' }),
        ]),
      ),
    },
  ],

  Search: [
    {
      code: `<Search :options="[{ label: '贵州茅台', value: '600519', code: 'SH', tag: { text: '白酒', variant: 'up' } }, { label: '宁德时代', value: '300750', code: 'SZ' }]" placeholder="搜索股票 / 代码" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Search, {
            options: [
              { label: '贵州茅台', value: '600519', code: 'SH', tag: { text: '白酒', variant: 'up' } },
              { label: '宁德时代', value: '300750', code: 'SZ' },
            ],
            placeholder: '搜索股票 / 代码',
          }),
        ]),
      ),
    },
  ],

  Stat: [
    {
      code: `<Stat label="上证指数" :value="3218.45" delta="+1.24%" trend="up" />\n<Stat label="创业板指" :value="2012.8" delta="-0.86%" trend="down" />\n<Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Stat, { label: '上证指数', value: 3218.45, delta: '+1.24%', trend: 'up' }),
          h(Stat, { label: '创业板指', value: 2012.8, delta: '-0.86%', trend: 'down' }),
          h(Stat, { label: '成交额', value: '1.02', suffix: '万亿', trend: 'muted' }),
        ]),
      ),
    },
  ],

  Progress: [
    {
      code: `<Progress :value="68" />\n<Progress :value="32" />\n<Progress indeterminate />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row', style: { width: '260px', flexDirection: 'column', alignItems: 'stretch' } }, [
          h(Progress, { value: 68 }),
          h(Progress, { value: 32 }),
          h(Progress, { indeterminate: true }),
        ]),
      ),
    },
  ],

  Skeleton: [
    {
      code: `<Skeleton shape="circle" />\n<Skeleton />\n<Skeleton shape="rect" :style="{ width: '220px', height: '16px' }" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Skeleton, { shape: 'circle' }),
          h(Skeleton, null),
          h(Skeleton, { shape: 'rect', style: { width: '220px', height: '16px' } }),
        ]),
      ),
    },
  ],

  Empty: [
    {
      code: `<Empty description="暂无自选标的">\n  <Button variant="primary">添加自选</Button>\n</Empty>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Empty, { description: '暂无自选标的' }, { default: () => h(Button, { variant: 'primary' }, '添加自选') }),
        ]),
      ),
    },
  ],

  Tabs: [
    {
      code: `<Tabs :items="[{ key: 'a', label: '概况', content: '公司基本面。' }, { key: 'b', label: '财务', content: '营收 / 利润。' }, { key: 'c', label: '研报', content: '券商观点。' }]" />`,
      Comp: S(() => () =>
        h(Tabs, {
          items: [
            { key: 'a', label: '概况', content: '公司基本面与行业地位。' },
            { key: 'b', label: '财务', content: '营收 / 利润 / 现金流。' },
            { key: 'c', label: '研报', content: '近期券商观点。' },
          ],
        }),
      ),
    },
  ],

  Breadcrumb: [
    {
      code: `<Breadcrumb :items="[{ label: '研究', href: '#' }, { label: '行业', href: '#' }, { label: '白酒' }]" />`,
      Comp: S(() => () =>
        h(Breadcrumb, {
          items: [
            { label: '研究', href: '#' },
            { label: '行业', href: '#' },
            { label: '白酒' },
          ],
        }),
      ),
    },
  ],

  Steps: [
    {
      code: `<Steps :steps="[{ title: '选股', desc: '筛选池' }, { title: '回测', desc: '历史验证' }, { title: '实盘', desc: '跟踪' }]" :default-current="1" />`,
      Comp: S(() => () =>
        h(Steps, {
          steps: [
            { title: '选股', desc: '筛选池' },
            { title: '回测', desc: '历史验证' },
            { title: '实盘', desc: '跟踪' },
          ],
          defaultCurrent: 1,
        }),
      ),
    },
  ],

  Pagination: [
    {
      code: `<Pagination :total="240" :page-size="10" :default-page="3" />`,
      Comp: S(() => () => h(Pagination, { total: 240, pageSize: 10, defaultPage: 3 })),
    },
  ],

  Tooltip: [
    {
      code: `<Tooltip content="这是一条提示"><Button>悬停查看</Button></Tooltip>\n<Tooltip content="跟随主题表面" variant="surface"><Button>surface</Button></Tooltip>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Tooltip, { content: '这是一条提示' }, { default: () => h(Button, null, '悬停查看') }),
          h(Tooltip, { content: '跟随主题表面', variant: 'surface' }, { default: () => h(Button, { variant: 'outline' }, 'surface') }),
        ]),
      ),
    },
  ],

  Popover: [
    {
      code: `<Popover>\n  <Button>触发浮层</Button>\n  <template #content>面板可放<strong>可交互</strong>内容。</template>\n</Popover>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Popover, {}, {
            default: () => h(Button, null, '触发浮层'),
            content: () => h('div', { innerHTML: '面板可放<strong>可交互</strong>内容。' }),
          }),
        ]),
      ),
    },
  ],

  Dialog: [
    {
      code: `<script setup>\nconst open = ref(false);\n</script>\n<Button @click="open = true">打开 Dialog</Button>\n<Dialog :open="open" title="新建策略"\n  :footer="h(Button, { variant: 'primary', onClick: () => open = false }, '确定')"\n  @open-change="open = $event">\n  <p>支持焦点陷阱与 Esc 关闭。</p>\n</Dialog>`,
      Comp: defineComponent({
        setup() {
          const open = ref(false);
          return () =>
            h('div', { class: 'demo-row' }, [
              h(Button, { onClick: () => (open.value = true) }, '打开 Dialog'),
              h(
                Dialog,
                {
                  open: open.value,
                  onOpenChange: (val: boolean) => (open.value = val),
                  title: '新建策略',
                  footer: h(Button, { variant: 'primary', onClick: () => (open.value = false) }, '确定'),
                },
                { default: () => h('p', 'Dialog 支持焦点陷阱、Esc / 点遮罩关闭，纯走 theme.css。') },
              ),
            ]);
        },
      }),
    },
  ],

  Drawer: [
    {
      code: `<script setup>\nconst open = ref(false);\n</script>\n<Drawer :open="open" title="筛选条件" subtitle="右侧滑出"\n  @open-change="open = $event">\n  <p>承载较复杂的筛选 / 表单。</p>\n</Drawer>`,
      Comp: defineComponent({
        setup() {
          const open = ref(false);
          return () =>
            h('div', { class: 'demo-row' }, [
              h(Button, { onClick: () => (open.value = true) }, '打开 Drawer'),
              h(
                Drawer,
                {
                  open: open.value,
                  onOpenChange: (val: boolean) => (open.value = val),
                  title: '筛选条件',
                  subtitle: '右侧滑出',
                },
                { default: () => h('p', 'Drawer 用于承载较复杂的筛选 / 表单。') },
              ),
            ]);
        },
      }),
    },
  ],

  ContextMenu: [
    {
      code: `<script setup>\nconst target = ref(null);\n</script>\n<ContextMenu :target-ref="target" :items="[{ key: 'edit', label: '编辑' }, { key: 'copy', label: '复制' }, { key: 'del', label: '删除', danger: true }]" @select="(k) => toast('执行：' + k)" />\n<div ref="target" class="demo-target">右键此区域</div>`,
      Comp: defineComponent({
        setup() {
          const target = ref<HTMLElement | null>(null);
          const items = [
            { key: 'edit', label: '编辑' },
            { key: 'copy', label: '复制', shortcut: '⌘C' },
            { key: 'del', label: '删除', danger: true },
          ];
          return () =>
            h('div', {}, [
              h('div', { ref: target, class: 'demo-target' }, '右键此区域唤出菜单'),
              h(ContextMenu, { targetRef: target, items, onSelect: (k: string) => toast(`执行：${k}`) }),
            ]);
        },
      }),
    },
  ],

  Tree: [
    {
      code: `<Tree :data="treeData" :default-expanded-keys="['1']" :default-checked-keys="['1-1']" />`,
      Comp: S(() => () => h(Tree, { data: treeData, defaultExpandedKeys: ['1'], defaultCheckedKeys: ['1-1'] })),
    },
  ],

  Slider: [
    {
      code: `<Slider :min="0" :max="100" :default-value="[20, 80]" format="pct" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row', style: { width: '320px' } }, [
          h(Slider, { min: 0, max: 100, defaultValue: [20, 80], format: 'pct' }),
        ]),
      ),
    },
  ],

  DataTable: [
    {
      code: `<DataTable :columns="columns" :data="data" compact selectable row-key="code" />`,
      Comp: S(() => () => h(DataTable, { columns: tableColumns, data: tableData, compact: true, selectable: true, rowKey: 'code' })),
    },
  ],

  Toast: [
    {
      code: `toast('操作成功');\ntoast('正在保存…', { duration: 0 });`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { onClick: () => toast('操作成功') }, '默认 Toast'),
          h(Button, { variant: 'outline', onClick: () => toast('正在保存…', { duration: 0 }) }, '常驻 Toast'),
        ]),
      ),
    },
  ],

  Message: [
    {
      code: `showMessage('数据已更新', 'success');\nshowMessage('请求失败', 'danger');`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { onClick: () => showMessage('数据已更新', 'success') }, 'success'),
          h(Button, { variant: 'outline', onClick: () => showMessage('请求失败', 'danger') }, 'danger'),
        ]),
      ),
    },
  ],

  // ——— 补齐 plain 侧已有、React/Vue 侧原先缺失的用例（Accordion / Form / VirtualTable）———
  Accordion: [
    {
      code: `<Accordion :items="items" :default-active-keys="['1']" />`,
      Comp: S(() => () => h(Accordion, { items: accordionItems, defaultActiveKeys: ['1'] })),
    },
  ],

  Form: [
    {
      code: `<Form :fields="fields" @submit="(v) => showMessage('已提交 ' + v.code)" />`,
      Comp: S(() => () =>
        h(Form, {
          fields: formFields,
          onSubmit: (v: Record<string, string>) => showMessage('已提交 ' + v.code, 'success'),
        }),
      ),
    },
  ],

  VirtualTable: [
    {
      code: `<VirtualTable :rows="rows" :columns="cols" :row-height="33" />`,
      Comp: S(() => () =>
        h(VirtualTable, { rows: vtableRows, columns: vtableColumns, rowHeight: 33 }),
      ),
    },
  ],
};
