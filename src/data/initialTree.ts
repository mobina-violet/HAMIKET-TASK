import { createNode } from '@/lib/treeUtils';
import type { TreeNodeData } from '@/types/tree';

const n = (label: string, children: TreeNodeData[] = []): TreeNodeData => ({
  ...createNode(label),
  children,
});

export const initialTree: TreeNodeData = n('حساب های اصلی', [
  n('دارایی های جاری', [
    n('وجوه نقد', [n('تن خواه'), n('بانک')]),
    n('حساب های دریافتنی', [n('حساب های دریافتنی حامی کت')]),
  ]),
  n('دارایی های غیر جاری'),
  n('بدهی های جاری', [
    n('حساب های پرداختنی تجاری', [
      n('کیف پول پرداختنی خریدار'),
      n('حساب های پرداختنی فروشگاه'),
    ]),
  ]),
  n('بدهی های غیر جاری'),
  n('حقوق صاحبان سهام (سرمایه)'),
  n('درآمد'),
  n('قیمت تمام شده'),
  n('هزینه ها'),
  n('حساب های انتظامی'),
]);

export const initialExpandedIds = new Set<string>([
  initialTree.id,
  initialTree.children[0].id,
  initialTree.children[0].children[0].id,
]);