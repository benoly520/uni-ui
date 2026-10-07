import React, { useState, useRef } from 'react';
import {
  Button,
  Tag,
  Badge,
  Avatar,
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
  toast,
  showMessage,
} from 'uni-ui/react';

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
  { key: 'price', title: '最新价', numeric: true },
  { key: 'chg', title: '涨跌幅', numeric: true },
];
const tableData = [
  { name: '贵州茅台', code: '600519', price: 1685.2, chg: '+1.24%' },
  { name: '宁德时代', code: '300750', price: 241.8, chg: '-0.86%' },
  { name: '招商银行', code: '600036', price: 38.42, chg: '+0.31%' },
];

export const reactDemos: Record<string, React.FC> = {
  Button: () => (
    <div className="demo-row">
      <Button>默认</Button>
      <Button variant="primary">主要</Button>
      <Button variant="glass">毛玻璃</Button>
      <Button disabled>禁用</Button>
    </div>
  ),

  Tag: () => (
    <div className="demo-row">
      <Tag>常规</Tag>
      <Tag type="brand">品牌</Tag>
      <Tag type="success">成功</Tag>
      <Tag type="warning">警告</Tag>
      <Tag type="danger">危险</Tag>
    </div>
  ),

  Badge: () => (
    <div className="demo-row">
      <Badge tone="brand" count={9}><Avatar name="A" /></Badge>
      <Badge tone="success" dot><Avatar name="B" /></Badge>
      <Badge tone="danger" count={99}><Button>消息</Button></Badge>
    </div>
  ),

  Avatar: () => (
    <div className="demo-row">
      <Avatar name="茅台" tone="brand" />
      <Avatar name="宁" tone="success" />
      <Avatar name="招" tone="danger" />
      <Avatar name="银" />
    </div>
  ),

  Input: () => {
    const [v, setV] = useState('');
    return (
      <div className="demo-row">
        <Input value={v} onChange={(val: string) => setV(val)} placeholder="搜索标的 / 代码" />
        <span className="ui-label">当前值：{v || '（空）'}</span>
      </div>
    );
  },

  Switch: () => {
    const [on, setOn] = useState(true);
    return (
      <div className="demo-row">
        <Switch checked={on} onChange={setOn} label="实时行情" />
        <span className="ui-label">{on ? '开' : '关'}</span>
      </div>
    );
  },

  Select: () => (
    <div className="demo-row">
      <Select
        options={[
          { label: '贵州茅台', value: '600519' },
          { label: '宁德时代', value: '300750' },
          { label: '招商银行', value: '600036' },
        ]}
        placeholder="选择标的"
      />
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

  NumberInput: () => (
    <div className="demo-row">
      <NumberInput prefix="¥" precision={2} defaultValue={1234567.5} />
      <NumberInput suffix="%" precision={1} defaultValue={12.3} min={0} max={100} />
    </div>
  ),

  DatePicker: () => (
    <div className="demo-row">
      <DatePicker defaultValue="2026-01-01" />
      <DatePicker range defaultValue={['2026-01-01', '2026-01-31']} />
    </div>
  ),

  Segmented: () => (
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

  Search: () => (
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

  Stat: () => (
    <div className="demo-row">
      <Stat label="上证指数" value={3218.45} delta="+1.24%" trend="up" />
      <Stat label="创业板指" value={2012.8} delta="-0.86%" trend="down" />
      <Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />
    </div>
  ),

  Progress: () => (
    <div className="demo-row">
      <Progress value={68} />
      <Progress value={32} />
    </div>
  ),

  Skeleton: () => (
    <div className="demo-row">
      <Skeleton shape="circle" />
      <Skeleton />
      <Skeleton style={{ width: 220 }} />
    </div>
  ),

  Empty: () => (
    <div className="demo-row">
      <Empty text="暂无自选标的" />
    </div>
  ),

  Tabs: () => (
    <Tabs
      items={[
        { key: 'a', label: '概况', content: <p>公司基本面与行业地位。</p> },
        { key: 'b', label: '财务', content: <p>营收 / 利润 / 现金流。</p> },
        { key: 'c', label: '研报', content: <p>近期券商观点。</p> },
      ]}
    />
  ),

  Breadcrumb: () => (
    <Breadcrumb
      items={[
        { label: '研究', href: '#' },
        { label: '行业', href: '#' },
        { label: '白酒' },
      ]}
    />
  ),

  Steps: () => (
    <Steps
      steps={[
        { title: '选股', desc: '筛选池' },
        { title: '回测', desc: '历史验证' },
        { title: '实盘', desc: '跟踪' },
      ]}
      defaultCurrent={1}
    />
  ),

  Pagination: () => <Pagination total={240} pageSize={10} defaultPage={3} />,

  Tooltip: () => (
    <div className="demo-row">
      <Tooltip content="这是一条提示"><Button>悬停查看</Button></Tooltip>
      <Tooltip content="跟随主题表面" variant="surface"><Button variant="glass">surface 变体</Button></Tooltip>
    </div>
  ),

  Popover: () => (
    <div className="demo-row">
      <Popover content={<div>面板可放<strong>可交互</strong>内容，如按钮。</div>}>
        <Button>触发浮层</Button>
      </Popover>
    </div>
  ),

  Dialog: () => {
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

  Drawer: () => {
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

  ContextMenu: () => {
    const target = useRef<HTMLDivElement>(null);
    return (
      <>
        <div ref={target} className="demo-target">右键此区域唤出菜单</div>
        <ContextMenu
          targetRef={target}
          items={[
            { key: 'edit', label: '编辑' },
            { key: 'copy', label: '复制' },
            { key: 'del', label: '删除', danger: true },
          ]}
          onSelect={(k) => toast(`执行：${k}`)}
        />
      </>
    );
  },

  Tree: () => (
    <Tree data={treeData} defaultExpandedKeys={['1']} defaultCheckedKeys={['1-1']} />
  ),

  Slider: () => (
    <div className="demo-row" style={{ width: 320 }}>
      <Slider min={0} max={100} defaultValue={[20, 80]} format="pct" />
    </div>
  ),

  DataTable: () => (
    <DataTable columns={tableColumns} data={tableData} compact selectable rowKey="code" />
  ),

  Toast: () => (
    <div className="demo-row">
      <Button onClick={() => toast('操作成功')}>默认 Toast</Button>
      <Button variant="glass" onClick={() => toast('正在保存…', { duration: 0 })}>常驻 Toast</Button>
    </div>
  ),

  Message: () => (
    <div className="demo-row">
      <Button onClick={() => showMessage('数据已更新', 'success')}>success</Button>
      <Button variant="glass" onClick={() => showMessage('请求失败', 'error')}>error</Button>
    </div>
  ),
};
