import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import AccountTree from '@/components/AccountTree';

export default function Home() {
  return (
    <Container maxWidth={false} sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
        درخت حساب‌ها
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        روی هر نود کلیک کنید تا باز/بسته شود. برای برش، کپی، پیست، حذف و افزودن زیرشاخه روی آن کلیک راست کنید.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          bgcolor: '#fefefe',
          border: '2px solid #f3f3f3',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <Box>
          <AccountTree />
        </Box>
      </Paper>
    </Container>
  );
}