import { h, defineComponent, ref, computed, type DefineComponent } from 'vue';
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

/** 演示用「自备图标」：24×24 viewBox + currentColor，形状与 lucide `plus` / `star` / `search` 一致 */
const PlusIcon = () =>
  h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [h('path', { d: 'M12 5v14M5 12h14' })]);

const StarIcon = () =>
  h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [h('path', { d: 'M12 3l2.7 6.3 6.8.6-5.2 4.5 1.6 6.6L12 17.4 6.1 21l1.6-6.6L2.5 9.9l6.8-.6z' })]);

const SearchIcon = () =>
  h('svg', {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    h('circle', { cx: 11, cy: 11, r: 7 }),
    h('path', { d: 'M21 21l-4.3-4.3' }),
  ]);

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
    {
      code: `<Button variant="default">默认：磨砂</Button>\n<Button variant="default" :glass="false">关闭：实心</Button>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { variant: 'default' }, '默认：磨砂'),
          h(Button, { variant: 'default', glass: false }, '关闭：实心'),
        ]),
      ),
    },
    {
      code: `<Button type="submit" variant="primary">type=submit</Button>\n<Button type="button" variant="outline">type=button</Button>\n<Button type="reset" variant="ghost">type=reset</Button>`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Button, { type: 'submit', variant: 'primary' }, 'type=submit'),
            h(Button, { type: 'button', variant: 'outline' }, 'type=button'),
            h(Button, { type: 'reset', variant: 'ghost' }, 'type=reset'),
            h('p', { class: 'demo-hint' }, '表单内 submit 会触发表单提交，button 只响应 onClick。'),
          ]);
        },
      }),
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
    {
      code: `<Tag type="brand" :icon="StarIcon()">重点关注</Tag>\n<Tag type="up" :icon="PlusIcon()">加自选</Tag>\n<Tag closable :icon="StarIcon()">可关闭 + 图标</Tag>`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Tag, { type: 'brand', icon: h(StarIcon) }, '重点关注'),
            h(Tag, { type: 'up', icon: h(PlusIcon) }, '加自选'),
            h(Tag, { closable: true, icon: h(StarIcon) }, '可关闭 + 图标'),
          ]);
        },
      }),
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
    {
      code: `<Badge tone="danger" :count="120" :max="99" />\n<Badge tone="brand" :count="0" show-zero />\n<Badge tone="brand" :count="0" />`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Badge, { tone: 'danger', count: 120, max: 99 }),
            h(Badge, { tone: 'brand', count: 0, showZero: true }),
            h(Badge, { tone: 'brand', count: 0 }),
            h('p', { class: 'demo-hint' }, '第三个 count=0 且未开 showZero，不渲染。'),
          ]);
        },
      }),
    },
  ],

  Avatar: [
    {
      code: `<Avatar text="茅台" tone="brand" />\n<Avatar text="宁" tone="success" />\n<Avatar :icon="StarIcon" tone="warning" />\n<Avatar src="https://i.pravatar.cc/80?img=12" alt="用户头像" :size="48" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Avatar, { text: '茅台', tone: 'brand' }),
          h(Avatar, { text: '宁', tone: 'success' }),
          h(Avatar, { icon: StarIcon, tone: 'warning' }),
          h(Avatar, { src: 'https://i.pravatar.cc/80?img=12', alt: '用户头像', size: 48 }),
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
      code: `<Input :prefix="SearchIcon" placeholder="搜索" />\n<Input :suffix="() => '%'" model-value="12" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Input, { prefix: SearchIcon, placeholder: '搜索' }),
          h(Input, { suffix: h('span', '%'), value: '12' }),
        ]),
      ),
    },
    {
      code: `<Input placeholder="默认：磨砂" />\n<Input placeholder="关闭：实心" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Input, { placeholder: '默认：磨砂' }),
          h(Input, { placeholder: '关闭：实心', glass: false }),
        ]),
      ),
    },
    {
      code: `<Input size="lg" placeholder="size=lg" />\n<Input size="sm" placeholder="size=sm" />\n<Input type="password" default-value="secret" />\n<Input :max-length="6" default-value="600519" placeholder="maxLength=6" />`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Input, { size: 'lg', placeholder: 'size=lg' }),
            h(Input, { size: 'sm', placeholder: 'size=sm' }),
            h(Input, { type: 'password', defaultValue: 'secret' }),
            h(Input, { maxLength: 6, defaultValue: '600519', placeholder: 'maxLength=6' }),
          ]);
        },
      }),
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
    {
      code: `<Select :options="options" placeholder="默认：磨砂" />\n<Select :options="options" placeholder="关闭：实心" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Select, {
            options: [
              { label: '贵州茅台', value: '600519' },
              { label: '宁德时代', value: '300750' },
            ],
            placeholder: '默认：磨砂',
          }),
          h(Select, {
            glass: false,
            options: [
              { label: '贵州茅台', value: '600519' },
              { label: '宁德时代', value: '300750' },
            ],
            placeholder: '关闭：实心',
          }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst v = ref('600519');\n</script>\n<Select :options="options" :value="v" @change="v = $event" />\n<p>当前值：{{ v }}</p>`,
      Comp: defineComponent({
        setup() {
        const v = ref<string>('600519');
        return () =>
          h('div', null, [
            h(Select, {
              options: [
                { label: '贵州茅台', value: '600519' },
                { label: '宁德时代', value: '300750' },
                { label: '招商银行', value: '600036' },
              ],
              value: v.value,
              onChange: (val: string | string[]) => (v.value = val as string),
            }),
            h('p', { class: 'demo-hint' }, '当前值：' + v.value),
          ]);
        },
      }),
    },
    {
      code: `<Select default-value="600519" :options="options" />\n<p>宁德时代为 disabled，展开后不可点选。</p>`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', null, [
            h(Select, {
              defaultValue: '600519',
              options: [
                { label: '贵州茅台', value: '600519' },
                { label: '宁德时代', value: '300750', disabled: true },
                { label: '招商银行', value: '600036' },
              ],
            }),
            h('p', { class: 'demo-hint' }, '宁德时代为 disabled，展开后不可点选。'),
          ]);
        },
      }),
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
    {
      code: `<script setup>\nconst n = ref(1234.5);\n</script>\n<NumberInput :value="n" :precision="2" prefix="¥" @change="n = $event" />\n<p>当前值：{{ n }}</p>`,
      Comp: defineComponent({
        setup() {
        const n = ref(1234.5);
        return () =>
          h('div', null, [
            h(NumberInput, { value: n.value, precision: 2, prefix: '¥', onChange: (v: number) => (n.value = v) }),
            h('p', { class: 'demo-hint' }, '当前值：' + n.value),
          ]);
        },
      }),
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
    {
      code: `<DatePicker default-value="2026-01-01" />\n<DatePicker default-value="2026-01-01" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(DatePicker, { defaultValue: '2026-01-01' }),
          h(DatePicker, { defaultValue: '2026-01-01', glass: false }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst v = ref('2026-01-01');\n</script>\n<DatePicker :value="v" placeholder="选择报告日期" @change="v = $event" />\n<p>当前值：{{ v || '未选择' }}</p>`,
      Comp: defineComponent({
        setup() {
        const v = ref<string | null>('2026-01-01');
        return () =>
          h('div', null, [
            h(DatePicker, { value: v.value, placeholder: '选择报告日期', onChange: (val: string | null) => (v.value = val) }),
            h('p', { class: 'demo-hint' }, '当前值：' + (v.value || '未选择')),
          ]);
        },
      }),
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
    {
      code: `<script setup>\nconst v = ref('d');\n</script>\n<Segmented :options="options" :value="v" @change="v = $event" />\n<p>当前：{{ v }}</p>`,
      Comp: defineComponent({
        setup() {
        const v = ref<string | number>('d');
        return () =>
          h('div', null, [
            h(Segmented, {
              options: [
                { label: '日K', value: 'd' },
                { label: '周K', value: 'w' },
                { label: '月K', value: 'm' },
              ],
              value: v.value,
              onChange: (val: string | number) => (v.value = val),
            }),
            h('p', { class: 'demo-hint' }, '当前：' + String(v.value)),
          ]);
        },
      }),
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
    {
      code: `<Search :options="options" placeholder="默认：磨砂" />\n<Search :options="options" placeholder="关闭：实心" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Search, {
            options: [
              { label: '贵州茅台', value: '600519', code: 'SH' },
              { label: '宁德时代', value: '300750', code: 'SZ' },
            ],
            placeholder: '默认：磨砂',
          }),
          h(Search, {
            glass: false,
            options: [
              { label: '贵州茅台', value: '600519', code: 'SH' },
              { label: '宁德时代', value: '300750', code: 'SZ' },
            ],
            placeholder: '关闭：实心',
          }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst q = ref('茅台');\nconst picked = ref('未选择');\n</script>\n<Search v-model:value=\"q\" :options=\"options\" @select=\"(o) => (picked = o.label)\" />\n<Search default-value=\"茅台\" :options=\"options\" />\n<p>当前输入：{{ q }} · 已选：{{ picked }}</p>`,
      Comp: defineComponent({
        setup() {
        const q = ref('茅台');
        const picked = ref('未选择');
        const options = [
          { label: '贵州茅台', value: '600519', code: 'SH' },
          { label: '宁德时代', value: '300750', code: 'SZ' },
        ];
        return () =>
          h('div', null, [
            h(Search, {
              value: q.value,
              onChange: (v: string) => (q.value = v),
              options,
              onSelect: (o: { label: string; code?: string }) =>
                (picked.value = o.label + ' ' + (o.code ?? '')),
            }),
            h(Search, { defaultValue: '茅台', options }),
            h('p', { class: 'demo-hint' }, '当前输入：' + q.value + ' · 已选：' + picked.value),
          ]);
        },
      }),
    },
  ],

  Stat: [
    {
      code: `<Stat label="上证指数" :value="3218.45" delta="+1.24%" trend="up" />\n<Stat label="创业板指" :value="2012.8" delta="-0.86%" trend="down" />\n<Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />\n<Stat label="持仓市值" value="12.86" prefix="¥" suffix="万" trend="muted" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Stat, { label: '上证指数', value: 3218.45, delta: '+1.24%', trend: 'up' }),
          h(Stat, { label: '创业板指', value: 2012.8, delta: '-0.86%', trend: 'down' }),
          h(Stat, { label: '成交额', value: '1.02', suffix: '万亿', trend: 'muted' }),
          h(Stat, { label: '持仓市值', value: '12.86', prefix: '¥', suffix: '万', trend: 'muted' }),
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
    {
      code: `<Progress :value="3" :max="5" />\n<Progress :value="1" :max="5" />`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', width: '280px' } }, [
            h(Progress, { value: 3, max: 5 }),
            h(Progress, { value: 1, max: 5 }),
            h('p', { class: 'demo-hint' }, 'value=3 / max=5 → 60%；value=1 / max=5 → 20%。'),
          ]);
        },
      }),
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
    {
      code: `<Skeleton active />\n<Skeleton :active="false" />`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Skeleton, { active: true }),
            h(Skeleton, { active: false }),
            h('p', { class: 'demo-hint' }, '左为默认闪光，右为静态占位。'),
          ]);
        },
      }),
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
    {
      code: `<Empty :icon="SearchIcon" description="没有匹配的标的">\n  <Button variant="outline">清空筛选</Button>\n</Empty>\n<Empty :icon="StarIcon" description="尚未添加自选" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(
            Empty,
            { icon: SearchIcon, description: '没有匹配的标的' },
            { default: () => h(Button, { variant: 'outline' }, '清空筛选') },
          ),
          h(Empty, { icon: StarIcon, description: '尚未添加自选' }),
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
    {
      code: `<Tabs :items="items" default-value="on-a" />\n<Tabs :items="items" default-value="on-a" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Tabs, {
            defaultValue: 'on-a',
            items: [
              { key: 'on-a', label: '概况', content: h('p', '默认磨砂。滚动箭头随 glass 变化。') },
              { key: 'on-b', label: '财务', content: h('p', '营收 / 利润。') },
            ],
          }),
          h(Tabs, {
            glass: false,
            defaultValue: 'off-a',
            items: [
              { key: 'off-a', label: '概况', content: h('p', '关闭玻璃：实心。') },
              { key: 'off-b', label: '财务', content: h('p', '营收 / 利润。') },
            ],
          }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst v = ref('a');\n</script>\n<Tabs :items="items" :value="v" @change="v = $event" />\n<p>当前 tab：{{ v }}</p>`,
      Comp: defineComponent({
        setup() {
        const v = ref('a');
        return () =>
          h('div', null, [
            h(Tabs, {
              value: v.value,
              onChange: (k: string) => (v.value = k),
              items: [
                { key: 'a', label: '概况', content: h('p', '公司基本面与行业地位。') },
                { key: 'b', label: '财务', content: h('p', '营收 / 利润 / 现金流。') },
                { key: 'c', label: '研报', content: h('p', '近期券商观点。') },
              ],
            }),
            h('p', { class: 'demo-hint' }, '当前 tab：' + v.value),
          ]);
        },
      }),
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
    {
      code: `<Breadcrumb :items="items" separator="›" />\n<Breadcrumb :items="items" separator="→" />`,
      Comp: defineComponent({
        setup() {
        const items = [
          { label: '研究', href: '#' },
          { label: '行业', href: '#' },
          { label: '白酒' },
        ];
        return () =>
          h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, [
            h(Breadcrumb, { items, separator: '›' }),
            h(Breadcrumb, { items, separator: '→' }),
            h('p', { class: 'demo-hint' }, '默认分隔符为「/」。'),
          ]);
        },
      }),
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
    {
      code: `<script setup>\nconst i = ref(1);\n</script>\n<Steps :steps="steps" :current="i" clickable @change="i = $event" />\n<p>当前第 {{ i + 1 }} 步</p>`,
      Comp: defineComponent({
        setup() {
        const i = ref(1);
        return () =>
          h('div', null, [
            h(Steps, {
              steps: [
                { title: '选股', desc: '筛选池' },
                { title: '回测', desc: '历史验证' },
                { title: '实盘', desc: '跟踪调仓' },
              ],
              current: i.value,
              clickable: true,
              onChange: (idx: number) => (i.value = idx),
            }),
            h('p', { class: 'demo-hint' }, '当前第 ' + (i.value + 1) + ' 步'),
          ]);
        },
      }),
    },
  ],

  Pagination: [
    {
      code: `<Pagination :total="240" :page-size="10" :default-page="3" />`,
      Comp: S(() => () => h(Pagination, { total: 240, pageSize: 10, defaultPage: 3 })),
    },
    {
      code: `<Pagination :total="240" :page-size="10" :default-page="3" />\n<Pagination :total="240" :page-size="10" :default-page="3" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Pagination, { total: 240, pageSize: 10, defaultPage: 3 }),
          h(Pagination, { total: 240, pageSize: 10, defaultPage: 3, glass: false }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst p = ref(1);\n</script>\n<Pagination :total="500" :page-size="10" :page="p" :sibling-count="2" @change="p = $event" />\n<p>当前第 {{ p }} 页</p>`,
      Comp: defineComponent({
        setup() {
        const p = ref(1);
        return () =>
          h('div', null, [
            h(Pagination, { total: 500, pageSize: 10, page: p.value, siblingCount: 2, onChange: (v: number) => (p.value = v) }),
            h('p', { class: 'demo-hint' }, '当前第 ' + p.value + ' 页'),
          ]);
        },
      }),
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
    {
      code: `<Tooltip content="默认：磨砂气泡" variant="surface"><Button>悬停：磨砂</Button></Tooltip>\n<Tooltip content="关闭：实心气泡" variant="surface" :glass="false"><Button variant="outline">悬停：实心</Button></Tooltip>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Tooltip, { content: '默认：磨砂气泡', variant: 'surface' }, {
            default: () => h(Button, null, '悬停：磨砂'),
          }),
          h(Tooltip, { content: '关闭：实心气泡', variant: 'surface', glass: false }, {
            default: () => h(Button, { variant: 'outline' }, '悬停：实心'),
          }),
        ]),
      ),
    },
    {
      code: `<Tooltip content="上方" placement="top"><Button>top</Button></Tooltip>\n<Tooltip content="延迟 600ms" :delay="600"><Button>delay</Button></Tooltip>\n<Tooltip content="不会出现" disabled><Button>disabled</Button></Tooltip>`,
      Comp: defineComponent({
        setup() {
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Tooltip, { content: '上方', placement: 'top' }, { default: () => h(Button, null, 'top') }),
            h(Tooltip, { content: '右侧', placement: 'right' }, { default: () => h(Button, null, 'right') }),
            h(Tooltip, { content: '下方', placement: 'bottom' }, { default: () => h(Button, null, 'bottom') }),
            h(Tooltip, { content: '左侧', placement: 'left' }, { default: () => h(Button, null, 'left') }),
            h(Tooltip, { content: '延迟 600ms 才出现', delay: 600 }, { default: () => h(Button, null, 'delay=600') }),
            h(Tooltip, { content: '不会出现', disabled: true }, { default: () => h(Button, null, 'disabled') }),
          ]);
        },
      }),
    },
    {
      code: `<script setup>\nconst open = ref(false);\n</script>\n<Tooltip content="受控提示" :open="open" @open-change="open = $event">\n  <Button variant="outline">{{ open ? '已展开' : '已收起' }}</Button>\n</Tooltip>\n<p>当前状态：{{ open ? '显示' : '隐藏' }}</p>\n<Tooltip content="非受控：初始即显示" default-open>\n  <Button variant="outline">defaultOpen</Button>\n</Tooltip>`,
      Comp: defineComponent({
        setup() {
        const open = ref(false);
        return () =>
          h('div', null, [
            h(
              Tooltip,
              {
                content: '受控提示',
                open: open.value,
                onOpenChange: (v: boolean) => (open.value = v),
              },
              {
                default: () =>
                  h(Button, { variant: 'outline' }, open.value ? '已展开' : '已收起'),
              },
            ),
            h(
              Tooltip,
              { content: '非受控：初始即显示', defaultOpen: true },
              { default: () => h(Button, { variant: 'outline' }, 'defaultOpen') },
            ),
            h('p', { class: 'demo-hint' }, '当前状态：' + (open.value ? '显示' : '隐藏')),
          ]);
        },
      }),
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
    {
      code: `<script setup>\nconst open = ref(false);\n</script>\n<Popover :open="open" @open-change="open = $event">\n  <Button variant="outline">受控浮层：{{ open ? '已展开' : '已收起' }}</Button>\n  <template #content>受控浮层内容</template>\n</Popover>\n<p>当前状态：{{ open ? '展开' : '收起' }}</p>\n<Popover default-open>\n  <Button variant="outline">defaultOpen</Button>\n  <template #content>非受控：初始即展开</template>\n</Popover>`,
      Comp: defineComponent({
        setup() {
        const open = ref(false);
        return () =>
          h('div', null, [
            h(
              Popover,
              { open: open.value, onOpenChange: (v: boolean) => (open.value = v) },
              {
                default: () =>
                  h(Button, { variant: 'outline' }, '受控浮层：' + (open.value ? '已展开' : '已收起')),
                content: () => h('div', '受控浮层内容，外部点击由业务侧决定是否收起。'),
              },
            ),
            h(
              Popover,
              { defaultOpen: true },
              {
                default: () => h(Button, { variant: 'outline' }, 'defaultOpen'),
                content: () => h('div', '非受控：初始即展开'),
              },
            ),
            h('p', { class: 'demo-hint' }, '当前状态：' + (open.value ? '展开' : '收起')),
          ]);
        },
      }),
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
    {
      code: `<script setup>\nconst a = ref(false);\nconst b = ref(false);\n</script>\n<Button @click="a = true">默认：磨砂</Button>\n<Button variant="outline" @click="b = true">关闭：实心</Button>\n<Dialog :open="a" title="磨砂面板" @open-change="a = $event">面板走 backdrop-filter。</Dialog>\n<Dialog :open="b" title="实心面板" :glass="false" @open-change="b = $event">背景不透明，无模糊。</Dialog>`,
      Comp: defineComponent({
        setup() {
        const a = ref(false);
        const b = ref(false);
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Button, { onClick: () => (a.value = true) }, '默认：磨砂'),
            h(Button, { variant: 'outline', onClick: () => (b.value = true) }, '关闭：实心'),
            h(Dialog, { open: a.value, onOpenChange: (v: boolean) => (a.value = v), title: '磨砂面板' }, {
              default: () => h('p', '面板背景走 backdrop-filter 毛玻璃。'),
            }),
            h(Dialog, { open: b.value, onOpenChange: (v: boolean) => (b.value = v), title: '实心面板', glass: false }, {
              default: () => h('p', '背景为不透明实心面，无 backdrop-filter。'),
            }),
          ]);
        },
      }),
    },
    {
      code: `<script setup>\nconst open = ref(false);\n</script>\n<Button @click="open = true">打开（点遮罩不关闭）</Button>\n<Dialog :open="open" title="填写中" :close-on-overlay="false" @open-change="open = $event">\n  点击背景不会关闭，需点按钮或按 Esc。\n</Dialog>`,
      Comp: defineComponent({
        setup() {
        const open = ref(false);
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Button, { onClick: () => (open.value = true) }, '打开（点遮罩不关闭）'),
            h(
              Dialog,
              {
                open: open.value,
                onOpenChange: (v: boolean) => (open.value = v),
                title: '填写中',
                closeOnOverlay: false,
              },
              { default: () => h('p', '点击背景不会关闭，需点按钮或按 Esc。') },
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
    {
      code: `<script setup>\nconst a = ref(false);\nconst b = ref(false);\n</script>\n<Button @click="a = true">默认：磨砂</Button>\n<Button variant="outline" @click="b = true">关闭：实心</Button>\n<Drawer :open="a" title="磨砂抽屉" @open-change="a = $event">面板走 backdrop-filter。</Drawer>\n<Drawer :open="b" title="实心抽屉" :glass="false" @open-change="b = $event">背景不透明。</Drawer>`,
      Comp: defineComponent({
        setup() {
        const a = ref(false);
        const b = ref(false);
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Button, { onClick: () => (a.value = true) }, '默认：磨砂'),
            h(Button, { variant: 'outline', onClick: () => (b.value = true) }, '关闭：实心'),
            h(Drawer, { open: a.value, onOpenChange: (v: boolean) => (a.value = v), title: '磨砂抽屉' }, {
              default: () => h('p', '抽屉面板背景走 backdrop-filter 毛玻璃。'),
            }),
            h(Drawer, { open: b.value, onOpenChange: (v: boolean) => (b.value = v), title: '实心抽屉', glass: false }, {
              default: () => h('p', '背景为不透明实心面，无 backdrop-filter。'),
            }),
          ]);
        },
      }),
    },
    {
      code: `<script setup>\nconst a = ref(false);\nconst b = ref(false);\n</script>\n<Button @click="a = true">底部 + 无关闭按钮</Button>\n<Button variant="outline" @click="b = true">左侧 + 点遮罩不关闭</Button>\n<Drawer :open="a" title="底部抽屉" side="bottom" :show-close="false" @open-change="a = $event">\n  bottom 方向 + 隐藏关闭按钮。\n</Drawer>\n<Drawer :open="b" title="左侧抽屉" side="left" :close-on-overlay="false" @open-change="b = $event">\n  左侧滑出，点遮罩不关闭。\n</Drawer>`,
      Comp: defineComponent({
        setup() {
        const a = ref(false);
        const b = ref(false);
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Button, { onClick: () => (a.value = true) }, '底部 + 无关闭按钮'),
            h(Button, { variant: 'outline', onClick: () => (b.value = true) }, '左侧 + 点遮罩不关闭'),
            h(
              Drawer,
              {
                open: a.value,
                onOpenChange: (v: boolean) => (a.value = v),
                title: '底部抽屉',
                side: 'bottom',
                showClose: false,
              },
              { default: () => h('p', 'side=bottom 从底部滑出，showClose=false 隐藏关闭按钮。') },
            ),
            h(
              Drawer,
              {
                open: b.value,
                onOpenChange: (v: boolean) => (b.value = v),
                title: '左侧抽屉',
                side: 'left',
                closeOnOverlay: false,
              },
              { default: () => h('p', 'side=left 从左侧滑出，closeOnOverlay=false 点遮罩不关闭。') },
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
    {
      code: `<script setup>\nconst target = ref(null);\nconst open = ref(false);\nconst last = ref('—');\n</script>\n<ContextMenu :target-ref="target" :items="items" :open="open"\n  @open-change="open = $event" @select="last = $event" />\n<div ref="target" class="demo-target">右键此区域</div>\n<p>菜单：{{ open ? '展开' : '收起' }} · 最近命令：{{ last }}</p>`,
      Comp: defineComponent({
        setup() {
        const target = ref<HTMLDivElement | null>(null);
        const open = ref(false);
        const last = ref('—');
        return () =>
          h('div', null, [
            h('div', { ref: target, class: 'demo-target' }, '右键此区域唤出受控菜单'),
            h(ContextMenu, {
              targetRef: target,
              open: open.value,
              onOpenChange: (v: boolean) => (open.value = v),
              onSelect: (k: string) => (last.value = k),
              items: [
                { key: 'edit', label: '编辑' },
                { key: 'copy', label: '复制', shortcut: '⌘C' },
                { key: 'sep', label: '', separator: true },
                { key: 'del', label: '删除', danger: true },
              ],
            }),
            h('p', { class: 'demo-hint' }, '菜单：' + (open.value ? '展开' : '收起') + ' · 最近命令：' + last.value),
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
    {
      code: `<script setup>\nconst expanded = ref(['1']);\nconst checked = ref(['1-1']);\n</script>\n<Tree :data="treeData" checkable :expanded-keys="expanded" :checked-keys="checked"\n  @expand="expanded = $event" @check="checked = $event" />\n<p>展开 {{ expanded.length }} 组 / 勾选 {{ checked.length }} 项</p>`,
      Comp: defineComponent({
        setup() {
        const expanded = ref<string[]>(['1']);
        const checked = ref<string[]>(['1-1']);
        return () =>
          h('div', null, [
            h(Tree, {
              data: treeData,
              checkable: true,
              expandedKeys: expanded.value,
              checkedKeys: checked.value,
              onExpand: (keys: string[]) => (expanded.value = keys),
              onCheck: (keys: string[]) => (checked.value = keys),
            }),
            h(
              'p',
              { class: 'demo-hint' },
              '展开 ' + expanded.value.length + ' 组 / 勾选 ' + checked.value.length + ' 项',
            ),
          ]);
        },
      }),
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
    {
      code: `<script setup>\nconst v = ref([20, 60]);\n</script>\n<Slider :min="0" :max="100" :step="5" :value="v" min-label="保守" max-label="激进"\n  @change="v = $event" />\n<p>当前区间：{{ v[0] }} – {{ v[1] }}</p>`,
      Comp: defineComponent({
        setup() {
        const v = ref<[number, number]>([20, 60]);
        return () =>
          h('div', { style: { width: '360px' } }, [
            h(Slider, {
              min: 0,
              max: 100,
              step: 5,
              value: v.value,
              onChange: (val: [number, number]) => (v.value = val),
              minLabel: '保守',
              maxLabel: '激进',
            }),
            h('p', { class: 'demo-hint' }, '当前区间：' + v.value[0] + ' – ' + v.value[1]),
          ]);
        },
      }),
    },
  ],

  DataTable: [
    {
      code: `<DataTable :columns="columns" :data="data" compact selectable row-key="code" />`,
      Comp: S(() => () => h(DataTable, { columns: tableColumns, data: tableData, compact: true, selectable: true, rowKey: 'code' })),
    },
    {
      code: `<DataTable :columns="columns" :data="data" compact />\n<DataTable :columns="columns" :data="data" compact :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(DataTable, { columns: tableColumns, data: tableData, compact: true }),
          h(DataTable, { columns: tableColumns, data: tableData, compact: true, glass: false }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst sort = ref({ key: 'price', dir: 'desc' });\nconst sel = ref([]);\n</script>\n<DataTable :columns="columns" :data="sorted" compact selectable row-key="code"\n  :sort-key="sort.key" :sort-dir="sort.dir"\n  @sort="(key, dir) => (sort = { key, dir })"\n  :selected-keys="sel" @select="sel = $event" />\n<p>排序：{{ sort.key }} {{ sort.dir }} · 已选 {{ sel.length }} 行</p>`,
      Comp: defineComponent({
        setup() {
        const sort = ref<{ key: string; dir: 'asc' | 'desc' }>({ key: 'price', dir: 'desc' });
        const sel = ref<string[]>([]);
        const sorted = computed(() =>
          [...tableData].sort((a, b) =>
            sort.value.dir === 'asc' ? a.price - b.price : b.price - a.price,
          ),
        );
        return () =>
          h('div', null, [
            h(DataTable, {
              columns: tableColumns,
              data: sorted.value,
              compact: true,
              selectable: true,
              rowKey: 'code',
              sortKey: sort.value.key,
              sortDir: sort.value.dir,
              onSort: (key: string, dir: 'asc' | 'desc') => (sort.value = { key, dir }),
              selectedKeys: sel.value,
              onSelect: (keys: string[]) => (sel.value = keys),
            }),
            h(
              'p',
              { class: 'demo-hint' },
              '排序：' +
                sort.value.key +
                ' ' +
                (sort.value.dir === 'asc' ? '升序' : '降序') +
                ' · 已选 ' +
                sel.value.length +
                ' 行',
            ),
          ]);
        },
      }),
    },
    {
      code: `const columns = [\n  { key: 'name', title: '名称', sticky: true },\n  { key: 'price', title: '最新价', numeric: true, sortable: true },\n  { key: 'chg', title: '涨跌幅', numeric: true, render: (row) => h(Tag, ..., row.chg) },\n];\n<DataTable :columns="columns" :data="data" compact default-sort-key="price"\n  default-sort-dir="asc" />`,
      Comp: defineComponent({
        setup() {
        const columns = [
          { key: 'name', title: '名称', sticky: true },
          { key: 'price', title: '最新价', numeric: true, sortable: true },
          {
            key: 'chg',
            title: '涨跌幅',
            numeric: true,
            render: (row: Record<string, any>) =>
              h(Tag, { type: String(row.chg).startsWith('+') ? 'up' : 'down' }, row.chg),
          },
        ];
        return () =>
          h(DataTable, {
            columns,
            data: tableData,
            compact: true,
            defaultSortKey: 'price',
            defaultSortDir: 'asc',
          });
        },
      }),
    },
  ],

  Toast: [
    {
      code: `toast('操作成功');\ntoast('正在保存…', { duration: 0 });\ntoast('已加入自选', { icon: StarIcon });`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { onClick: () => toast('操作成功') }, '默认 Toast'),
          h(Button, { variant: 'outline', onClick: () => toast('正在保存…', { duration: 0 }) }, '常驻 Toast'),
          h(
            Button,
            { variant: 'ghost', onClick: () => toast('已加入自选', { icon: h(StarIcon) }) },
            '带图标 Toast',
          ),
        ]),
      ),
    },
    {
      code: `toast('默认：磨砂');\ntoast('关闭：实心', { glass: false });`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { onClick: () => toast('默认：磨砂') }, '默认 Toast'),
          h(Button, { variant: 'outline', onClick: () => toast('关闭：实心', { glass: false }) }, '关闭玻璃 Toast'),
        ]),
      ),
    },
  ],

  Message: [
    {
      code: `showMessage('数据已更新', 'success');\nshowMessage('请求失败', 'danger');\nshowMessage('部分字段已忽略', 'warning');\nshowMessage('已切换到研究视图', 'info');`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { onClick: () => showMessage('数据已更新', 'success') }, 'success'),
          h(Button, { variant: 'outline', onClick: () => showMessage('请求失败', 'danger') }, 'danger'),
          h(Button, { variant: 'outline', onClick: () => showMessage('部分字段已忽略', 'warning') }, 'warning'),
          h(Button, { variant: 'ghost', onClick: () => showMessage('已切换到研究视图', 'info') }, 'info'),
        ]),
      ),
    },
    {
      code: `showMessage('默认：磨砂', 'success');\nshowMessage('关闭：实心', 'success', 2600, false);`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { onClick: () => showMessage('默认：磨砂', 'success') }, '默认 Message'),
          h(Button, { variant: 'outline', onClick: () => showMessage('关闭：实心', 'success', 2600, false) }, '关闭玻璃 Message'),
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
    {
      code: `<script setup>\nconst keys = ref(['1']);\n</script>\n<Accordion :items="items" :active-keys="keys" @change="keys = $event" />\n<p>当前展开：{{ keys.join('、') || '无' }}</p>`,
      Comp: defineComponent({
        setup() {
        const keys = ref<string[]>(['1']);
        return () =>
          h('div', null, [
            h(Accordion, { items: accordionItems, activeKeys: keys.value, onChange: (k: string[]) => (keys.value = k) }),
            h('p', { class: 'demo-hint' }, '当前展开：' + (keys.value.join('、') || '无')),
          ]);
        },
      }),
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
    {
      code: `<Form :fields="fields" id-prefix="glass-on" />\n<Form :fields="fields" id-prefix="glass-off" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Form, { fields: formFields, idPrefix: 'glass-on' }),
          h(Form, { fields: formFields, idPrefix: 'glass-off', glass: false }),
        ]),
      ),
    },
    {
      code: `<script setup>\nconst fields = [\n  { name: 'name', label: '名称', defaultValue: '贵州茅台' },\n  { name: 'date', label: '调仓日', type: 'date' },\n];\n</script>\n<Form :fields="fields" submit-text="保存筛选条件" />\n<Form :fields="fields" :grid="false" submit-text="保存（纵向）" />`,
      Comp: defineComponent({
        setup() {
        const fields = [
          { name: 'name', label: '名称', defaultValue: '贵州茅台' },
          { name: 'date', label: '调仓日', type: 'date' as const },
        ];
        return () =>
          h('div', { class: 'demo-row' }, [
            h(Form, { fields, submitText: '保存筛选条件' }),
            h(Form, { fields, grid: false, submitText: '保存（纵向）' }),
          ]);
        },
      }),
    },
    {
      code: `<script setup>\nconst fields = [\n  { name: 'weight', label: '单票权重(%)', type: 'number', placeholder: '如 12.5', rules: [{ min: 0, message: '需大于 0' }] },\n  { name: 'price', label: '委托价', type: 'number', placeholder: '如 1685.2', rules: [{ min: 0, message: '不能为负' }] },\n];\n</script>\n<Form :fields="fields" submit-text="校验并提交" @submit="onSubmit" />`,
      Comp: S(() => {
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
        return () =>
          h(Form, {
            fields,
            submitText: '校验并提交',
            onSubmit: (v: Record<string, string>) =>
              showMessage('通过：' + JSON.stringify(v), 'success'),
          });
      }),
    },
  ],

  VirtualTable: [
    {
      code: `<VirtualTable :rows="rows" :columns="cols" :row-height="33" />`,
      Comp: S(() => () =>
        h(VirtualTable, { rows: vtableRows, columns: vtableColumns, rowHeight: 33 }),
      ),
    },
    {
      code: `<VirtualTable :rows="rows" :columns="columns" />\n<VirtualTable :rows="rows" :columns="columns" :glass="false" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(VirtualTable, { rows: vtableRows, columns: vtableColumns }),
          h(VirtualTable, { rows: vtableRows, columns: vtableColumns, glass: false }),
        ]),
      ),
    },
    {
      code: `<VirtualTable :rows="rows" :columns="cols" :row-height="28" :buffer="20"\n  aria-label="标的行情虚拟表" />`,
      Comp: defineComponent({
        setup() {
        const cols = [
          { key: 'code', title: '代码', sticky: true, width: '96px' },
          { key: 'name', title: '名称', width: '1fr' },
        ];
        const rows = Array.from({ length: 2000 }, (_, i) => ({
          code: 'GN' + (1000 + i),
          name: '标的 ' + i,
        }));
        return () =>
          h('div', { style: { height: '200px' } }, [
            h(VirtualTable, {
              rows,
              columns: cols,
              rowHeight: 28,
              buffer: 20,
              ariaLabel: '标的行情虚拟表',
            }),
          ]);
        },
      }),
    },
  ],

  // ——— Icon 契约页（Vue 侧 icon 插槽走 <component :is="icon" />，因此传组件）———
  Icon: [
    {
      code: `const PlusIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none',\n  stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round',\n  'stroke-linejoin': 'round' }, [h('path', { d: 'M12 5v14M5 12h14' })]);\n\nh(Button, { icon: PlusIcon, variant: 'primary' }, () => '新建')\nh(Tag, { icon: StarIcon, type: 'brand' }, () => '重点')`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { icon: PlusIcon, variant: 'primary' }, () => '新建'),
          h(Tag, { icon: StarIcon, type: 'brand' }, () => '重点'),
        ]),
      ),
    },
    {
      code: `<Button size="lg" variant="primary" :icon="PlusIcon">大</Button>\n<Button variant="primary" :icon="PlusIcon">中</Button>\n<Button size="sm" variant="primary" :icon="PlusIcon">小</Button>`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Button, { size: 'lg', variant: 'primary', icon: PlusIcon }, '大'),
          h(Button, { variant: 'primary', icon: PlusIcon }, '中'),
          h(Button, { size: 'sm', variant: 'primary', icon: PlusIcon }, '小'),
        ]),
      ),
    },
    {
      code: `<Empty description="可覆盖：传入自备图标" :icon="StarIcon" />\n<Steps :steps="[{ title: '选股' }, { title: '回测' }, { title: '实盘' }]" :default-current="2" />`,
      Comp: S(() => () =>
        h('div', { class: 'demo-row' }, [
          h(Empty, { description: '可覆盖：传入自备图标', icon: StarIcon }),
          h(Steps, {
            steps: [{ title: '选股' }, { title: '回测' }, { title: '实盘' }],
            defaultCurrent: 2,
          }),
        ]),
      ),
    },
  ],
};
