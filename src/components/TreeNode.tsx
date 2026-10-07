'use client';

import type { MouseEvent, ReactNode } from 'react';
import { Box, ButtonBase, Fade, Tooltip, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import type { TreeNodeData } from '@/types/tree';
import { makeChildCode, toFaDigits } from '@/lib/treeUtils';

const LINE = '#C9C9C9';
const STEM = 24; // ساقه‌ی بین والد و ستون فرزندان
const STUB = 40; // خط افقی هر فرزند (شامل فلش)
const NODE_W = 210;
const NODE_H = 44;

export interface TreeNodeProps {
  node: TreeNodeData;
  code: string;
  expandedIds: Set<string>;
  cutId: string | null;
  onToggle: (id: string) => void;
  onContextMenu: (e: MouseEvent, node: TreeNodeData) => void;
  onAdd: (parentId: string) => void;
}

function ChildRow({
  isFirst,
  isLast,
  children,
}: {
  isFirst: boolean;
  isLast: boolean;
  children: ReactNode;
}) {
  const alone = isFirst && isLast;
  return (
    <Box
      sx={{
        position: 'relative',
        paddingInlineStart: `${STUB}px`,
        py: 0.75,
        // خط عمودی: از وسطِ اولین فرزند تا وسطِ آخرین فرزند
        ...(alone
          ? {}
          : {
              '&::before': {
                content: '""',
                position: 'absolute',
                insetInlineStart: 0,
                width: '2px',
                top: isFirst ? '50%' : 0,
                bottom: isLast ? '50%' : 0,
                backgroundColor: LINE,
              },
            }),
      }}
    >
      {/* خط افقی + فلش */}
      <Box
        sx={{
          position: 'absolute',
          insetInlineStart: 0,
          top: '50%',
          width: STUB,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box sx={{ flex: 1, height: '2px', backgroundColor: LINE }} />
        <ChevronLeftIcon
          sx={{
            color: LINE,
            fontSize: 24,
            marginInlineStart: '-10px',
            marginInlineEnd: '-6px',
          }}
        />
      </Box>
      {children}
    </Box>
  );
}

export default function TreeNode({
  node,
  code,
  expandedIds,
  cutId,
  onToggle,
  onContextMenu,
  onAdd,
}: TreeNodeProps) {
  const expanded = expandedIds.has(node.id);
  const isCut = cutId === node.id;
  const fullText = code ? `${toFaDigits(code)} ${node.label}` : node.label;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title={fullText} placement="top" enterDelay={700}>
        <ButtonBase
          aria-expanded={expanded}
          onClick={() => onToggle(node.id)}
          onContextMenu={(e) => onContextMenu(e, node)}
          sx={{
            width: NODE_W,
            height: NODE_H,
            px: 1.5,
            flexShrink: 0,
            border: '1px solid',
            borderStyle: isCut ? 'dashed' : 'solid',
            borderColor: 'primary.main',
            borderRadius: 1.5,
            opacity: isCut ? 0.45 : 1,
            bgcolor: expanded ? 'primary.main' : 'background.paper',
            color: expanded ? 'primary.contrastText' : 'text.primary',
            transition: 'background-color .2s',
            '&:hover': {
              bgcolor: expanded ? 'primary.dark' : 'rgba(201,139,139,0.1)',
            },
            '&.Mui-focusVisible': {
              outline: '2px solid',
              outlineColor: 'primary.dark',
              outlineOffset: 2,
            },
          }}
        >
          <Typography
            variant="body2"
            noWrap
            sx={{ width: '100%', textAlign: 'start', fontWeight: expanded ? 700 : 400 }}
          >
            {code && (
              <Box component="span" sx={{ marginInlineEnd: 1, opacity: 0.75 }}>
                {toFaDigits(code)}
              </Box>
            )}
            {node.label}
          </Typography>
        </ButtonBase>
      </Tooltip>

      {expanded && (
        <Fade in timeout={250}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: STEM, height: '2px', backgroundColor: LINE }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {node.children.map((child, i) => (
                <ChildRow key={child.id} isFirst={i === 0} isLast={false}>
                  <TreeNode
                    node={child}
                    code={makeChildCode(code, i)}
                    expandedIds={expandedIds}
                    cutId={cutId}
                    onToggle={onToggle}
                    onContextMenu={onContextMenu}
                    onAdd={onAdd}
                  />
                </ChildRow>
              ))}

              {/* تایل «افزودن» آخر هر نودِ باز */}
              <ChildRow isFirst={node.children.length === 0} isLast>
                <ButtonBase
                  onClick={() => onAdd(node.id)}
                  sx={{
                    width: NODE_W,
                    height: NODE_H,
                    gap: 1,
                    border: '1px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 1.5,
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(201,139,139,0.1)' },
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                  <Typography variant="body2">افزودن</Typography>
                </ButtonBase>
              </ChildRow>
            </Box>
          </Box>
        </Fade>
      )}
    </Box>
  );
}