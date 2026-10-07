'use client';

import type { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { theme } from './theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider
      options={{ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}