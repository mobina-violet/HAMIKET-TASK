import type { TreeNodeData } from '@/types/tree';

const KEY = 'hamiket-tree-v1';

interface Persisted {
  tree: TreeNodeData;
  expanded: string[];
}

//اگه داده‌ی ذخیره‌شده خراب یا دستکاری شده باشه، نادیده‌اش بگیر
function isTreeNode(v: unknown): v is TreeNodeData {
  if (typeof v !== 'object' || v === null) return false;
  const n = v as Record<string, unknown>;
  return (
    typeof n.id === 'string' &&
    typeof n.label === 'string' &&
    Array.isArray(n.children) &&
    n.children.every(isTreeNode)
  );
}

export function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<Persisted>;
    if (!isTreeNode(data.tree) || !Array.isArray(data.expanded)) return null;
    return {
      tree: data.tree,
      expanded: data.expanded.filter((x): x is string => typeof x === 'string'),
    };
  } catch {
    return null;
  }
}

export function savePersisted(tree: TreeNodeData, expanded: Set<string>) {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ tree, expanded: Array.from(expanded) }),
    );
  } catch {
  }
}