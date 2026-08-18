import { 
  Typography, 
  Box, 
  Button, 
  Stack, 
} from '@mui/material';
import TicketDevLogo from './TicketDevLogo';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <TicketDevLogo />
      </Stack>
      
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {user ? (
          <>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Olá, {user.name}
            </Typography>
            <Button variant="outlined" color="secondary" size="small" onClick={logout}>
              Sair
            </Button>
          </>
        ) : (
          <Button component={Link} href="/login" variant="outlined" color="primary" size="small">
            Entrar
          </Button>
        )}
      </Stack>
    </Box>
  )
}