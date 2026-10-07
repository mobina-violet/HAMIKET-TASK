'use client';

import { useCallback, useEffect, useState, type MouseEvent } from 'react';
import { Alert, Box, Button, Snackbar, type AlertColor } from '@mui/material';
import TreeNode from './TreeNode';
import NodeContextMenu from './NodeContextMenu';
import AddNodeDialog from './AddNodeDialog';
import { initialExpandedIds, initialTree } from '@/data/initialTree';
import {
  addChild,
  cloneWithNewIds,
  createNode,
  findNode,
  removeNode,
} from '@/lib/treeUtils';
import { loadPersisted, savePersisted } from '@/lib/storage';
import type { ClipboardState, TreeNodeData } from '@/types/tree';

interface MenuState {
  top: number;
  left: number;
  nodeId: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export default function AccountTree() {
  const [tree, setTree] = useState<TreeNodeData>(initialTree);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(initialExpandedIds));
  const [clipboard, setClipboard] = useState<ClipboardState>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [addTargetId, setAddTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'success' });
  const [hydrated, setHydrated] = useState(false);

  // ۱) بعد از mount: درخت ذخیره‌شده رو بخون
  useEffect(() => {
    const saved = loadPersisted();
    if (saved) {
      setTree(saved.tree);
      setExpanded(new Set(saved.expanded));
    }
    setHydrated(true);
  }, []);

  // ۲) با هر تغییر: ذخیره کن (بعد از لود اولیه، که داده‌ی قبلی پاک نشه)
  useEffect(() => {
    if (hydrated) savePersisted(tree, expanded);
  }, [hydrated, tree, expanded]);

  const menuNode = menu ? findNode(tree, menu.nodeId) : null;
  const addTarget = addTargetId ? findNode(tree, addTargetId) : null;

  const notify = (message: string, severity: AlertColor = 'success') =>
    setToast({ open: true, message, severity });

  const expand = (id: string) => setExpanded((prev) => new Set(prev).add(id));

  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const openMenu = useCallback((e: MouseEvent, node: TreeNodeData) => {
    e.preventDefault();
    setMenu({ top: e.clientY, left: e.clientX, nodeId: node.id });
  }, []);

  // ───────── عملیات ─────────

  const handleCut = (node: TreeNodeData) => {
    if (node.children.length > 0) return;
    setClipboard({ mode: 'cut', node });
    notify('نود برش داده شد؛ روی نود مقصد کلیک راست و پیست کنید');
  };

  const handleCopy = (node: TreeNodeData) => {
    setClipboard({ mode: 'copy', node });
    notify('نود به همراه زیرشاخه‌هایش کپی شد');
  };

  const handlePaste = (target: TreeNodeData) => {
    if (!clipboard) return;

    if (clipboard.mode === 'copy') {
      setTree((t) => addChild(t, target.id, cloneWithNewIds(clipboard.node)));
      notify('پیست شد');
    } else {
      const current = findNode(tree, clipboard.node.id);
      if (!current) {
        setClipboard(null);
        notify('نود برش‌داده‌شده دیگر وجود ندارد', 'error');
        return;
      }
      if (findNode(current, target.id)) {
        notify('نمی‌توان یک نود را داخل خودش پیست کرد', 'warning');
        return;
      }
      setTree((t) => addChild(removeNode(t, current.id), target.id, current));
      setClipboard(null);
      notify('نود جابه‌جا شد');
    }
    expand(target.id);
  };

  const handleDelete = (node: TreeNodeData) => {
    if (node.children.length > 0 || node.id === tree.id) return;
    setTree((t) => removeNode(t, node.id));
    setExpanded((prev) => {
      const next = new Set(prev);
      next.delete(node.id);
      return next;
    });
    setClipboard((c) => (c?.mode === 'cut' && c.node.id === node.id ? null : c));
    notify('نود حذف شد');
  };

  const handleAddSubmit = (label: string) => {
    if (!addTargetId) return;
    setTree((t) => addChild(t, addTargetId, createNode(label)));
    expand(addTargetId);
    setAddTargetId(null);
    notify('زیرشاخه اضافه شد');
  };

  const handleReset = () => {
    setTree(initialTree);
    setExpanded(new Set(initialExpandedIds));
    setClipboard(null);
    notify('درخت به حالت اولیه برگشت');
  };

  // تا لود ذخیره‌شده تموم نشده چیزی نشون نده (که پرش اولیه نباشه)
  if (!hydrated) return null;

  const cutId = clipboard?.mode === 'cut' ? clipboard.node.id : null;
  const canPaste =
    Boolean(clipboard) && !(clipboard?.mode === 'cut' && clipboard.node.id === menuNode?.id);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pt: 2 }}>
        <Button size="small" color="inherit" onClick={handleReset}>
          بازنشانی درخت
        </Button>
      </Box>

      <Box sx={{ overflowX: 'auto', py: 2, px: 2 }}>
        <Box sx={{ width: 'max-content', minWidth: '100%' }}>
          <TreeNode
            node={tree}
            code=""
            expandedIds={expanded}
            cutId={cutId}
            onToggle={toggle}
            onContextMenu={openMenu}
            onAdd={setAddTargetId}
          />
        </Box>
      </Box>

      <NodeContextMenu
        position={menu ? { top: menu.top, left: menu.left } : null}
        isRoot={menuNode?.id === tree.id}
        hasChildren={(menuNode?.children.length ?? 0) > 0}
        canPaste={canPaste}
        onClose={() => setMenu(null)}
        onCut={() => menuNode && handleCut(menuNode)}
        onCopy={() => menuNode && handleCopy(menuNode)}
        onPaste={() => menuNode && handlePaste(menuNode)}
        onDelete={() => menuNode && handleDelete(menuNode)}
        onAdd={() => menuNode && setAddTargetId(menuNode.id)}
      />

      <AddNodeDialog
        open={Boolean(addTarget)}
        parentLabel={addTarget?.label}
        onClose={() => setAddTargetId(null)}
        onSubmit={handleAddSubmit}
      />

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}