export interface TreeNodeData {
  id: string;
  label: string;
  children: TreeNodeData[];
}

export type ClipboardState = {
  mode: 'copy' | 'cut';
  node: TreeNodeData;
} | null;