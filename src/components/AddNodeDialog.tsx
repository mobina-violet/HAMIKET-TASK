'use client';

import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

interface Props {
  open: boolean;
  parentLabel?: string;
  onClose: () => void;
  onSubmit: (label: string) => void;
}

export default function AddNodeDialog({ open, parentLabel, onClose, onSubmit }: Props) {
  const [value, setValue] = useState('');
  const trimmed = value.trim();

  const handleClose = () => {
    setValue('');
    onClose();
  };

  const handleSubmit = () => {
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>افزودن زیرشاخه</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          زیرشاخه‌ی جدید برای «{parentLabel}»
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          label="عنوان نود"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          انصراف
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!trimmed} disableElevation>
          افزودن
        </Button>
      </DialogActions>
    </Dialog>
  );
}