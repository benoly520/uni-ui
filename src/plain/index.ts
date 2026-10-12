// uni-ui · Plain 入口（自动聚合所有组件 + 类型 + 命令式辅助）
// 组件零样式：应用侧需 `import 'uni-ui/theme.css'` 一次。
// 视图用 plain 的 TSX + 编译器（direct DOM）编写，无虚拟 DOM。

export { Accordion, type AccordionProps, type AccordionItemData } from './Accordion';
export { Avatar, type AvatarProps, type AvatarTone, type AvatarSize } from './Avatar';
export { Badge, type BadgeProps, type BadgeTone } from './Badge';
export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem } from './Breadcrumb';
export { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from './Button';
export { ContextMenu, type ContextMenuProps, type ContextMenuItem } from './ContextMenu';
export { DataTable, type DataTableProps, type DataTableColumn } from './DataTable';
export { DatePicker, type DatePickerProps, type DatePickerValue } from './DatePicker';
export { Dialog, type DialogProps } from './Dialog';
export { Drawer, type DrawerProps, type DrawerSide } from './Drawer';
export { Empty, type EmptyProps } from './Empty';
export { Form, type FormProps, type FormRule, type FormField } from './Form';
export { Input, type InputProps, type InputSize } from './Input';
export { Message, type MessageProps, type MessageType } from './Message';
export { NumberInput, type NumberInputProps } from './NumberInput';
export { Pagination, type PaginationProps } from './Pagination';
export { Popover, type PopoverProps } from './Popover';
export { Progress, type ProgressProps } from './Progress';
export { Search, type SearchProps, type SearchOption, type SearchTag } from './Search';
export { Segmented, type SegmentedProps, type SegmentedOption } from './Segmented';
export { Select, type SelectProps, type SelectOption } from './Select';
export { Skeleton, type SkeletonProps, type SkeletonShape } from './Skeleton';
export { Slider, type SliderProps, type SliderFormat } from './Slider';
export { Stat, type StatProps, type StatTrend } from './Stat';
export { Steps, type StepsProps, type StepItem } from './Steps';
export { Switch, type SwitchProps, type SwitchSize } from './Switch';
export { Tabs, type TabsProps, type TabItem } from './Tabs';
export { Tag, type TagProps, type TagType } from './Tag';
export { Toast, type ToastProps } from './Toast';
export { Tooltip, type TooltipProps, type TooltipVariant, type TooltipPlacement } from './Tooltip';
export { Tree, type TreeProps, type TreeData } from './Tree';
export { VirtualTable, type VirtualTableProps, type VTableColumn } from './VirtualTable';

// 命令式辅助
export { toast, type ToastOptions } from './toast';
export { showMessage } from './message';
