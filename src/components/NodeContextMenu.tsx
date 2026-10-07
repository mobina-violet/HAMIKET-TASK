'use client';

import type { MouseEvent } from 'react';
import { Divider, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';

interface Props {
  position: { top: number; left: number } | null;
  isRoot: boolean;
  hasChildren: boolean;
  canPaste: boolean;
  onClose: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onAdd: () => void;
}

export default function NodeContextMenu({
  position,
  isRoot,
  hasChildren,
  canPaste,
  onClose,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onAdd,
}: Props) {
  const run = (fn: () => void) => () => {
    fn();
    onClose();
  };
  const blockedHint = !isRoot && hasChildren ? 'فقط نود بدون فرزند' : undefined;

  return (
    <Menu
      open={Boolean(position)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position ?? undefined}
      slotProps={{
        root: {
          // کلیک راست روی پس‌زمینه‌ی منو، منوی مرورگر رو باز نکنه
          onContextMenu: (e: MouseEvent<HTMLElement>) => {
            e.preventDefault();
            onClose();
          },
        },
        paper: { sx: { minWidth: 220 } },
      }}
    >
      <MenuItem disabled={isRoot || hasChildren} onClick={run(onCut)}>
        <ListItemIcon><ContentCutIcon fontSize="small" /></ListItemIcon>
        <ListItemText secondary={blockedHint}>برش دادن</ListItemText>
      </MenuItem>

      <MenuItem disabled={isRoot} onClick={run(onCopy)}>
        <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
        <ListItemText>کپی کردن</ListItemText>
      </MenuItem>

      <MenuItem disabled={!canPaste} onClick={run(onPaste)}>
        <ListItemIcon><ContentPasteIcon fontSize="small" /></ListItemIcon>
        <ListItemText>پیست کردن</ListItemText>
      </MenuItem>

      <MenuItem disabled={isRoot || hasChildren} onClick={run(onDelete)}>
        <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
        <ListItemText secondary={blockedHint}>حذف</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem onClick={run(onAdd)}>
        <ListItemIcon><AddCircleOutlineIcon fontSize="small" /></ListItemIcon>
        <ListItemText>افزودن زیرشاخه</ListItemText>
      </MenuItem>
    </Menu>
  );
}