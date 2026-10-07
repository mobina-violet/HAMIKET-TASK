import type { TreeNodeData } from '@/types/tree';

export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const createNode = (label: string): TreeNodeData => ({
  id: createId(),
  label,
  children: [],
});

export function findNode(root: TreeNodeData, id: string): TreeNodeData | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

export function addChild(
  root: TreeNodeData,
  parentId: string,
  node: TreeNodeData,
): TreeNodeData {
  if (root.id === parentId) {
    return { ...root, children: [...root.children, node] };
  }
  return { ...root, children: root.children.map((c) => addChild(c, parentId, node)) };
}

export function removeNode(root: TreeNodeData, id: string): TreeNodeData {
  return {
    ...root,
    children: root.children
      .filter((c) => c.id !== id)
      .map((c) => removeNode(c, id)),
  };
}


export function cloneWithNewIds(node: TreeNodeData): TreeNodeData {
  return {
    id: createId(),
    label: node.label,
    children: node.children.map(cloneWithNewIds),
  };
}


export function makeChildCode(parentCode: string, index: number): string {
  const n = index + 1;
  return parentCode ? parentCode + String(n).padStart(2, '0') : String(n);
}

export const toFaDigits = (s: string) =>
  s.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);