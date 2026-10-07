import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: { main: '#C98B8B', dark: '#B57373', contrastText: '#ffffff' },
    background: { default: '#f3f3f3', paper: '#fefefe' },
    text: { primary: 'rgba(0, 0, 0, 0.87)' },
  },
  typography: {
    fontFamily: 'var(--font-iransans), Tahoma, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 400,
    fontWeightBold: 700,
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        body: {
          lineHeight: 1.56,
          '@media (max-width:1200px)': { fontSize: 16 },
        },
        '::-webkit-scrollbar': { width: 7, height: 7 },
        '::-webkit-scrollbar-thumb': { background: '#ddd', borderRadius: 10 },
        '::-webkit-scrollbar-track': { background: '#fff', borderRadius: 10 },
      },
    },
  },
});