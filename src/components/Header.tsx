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

  const accountLink = user?.role === "CONSUMER" ? '/tickets' : user?.role === "ORGANIZER" ? '/organizer' : '/gate'

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Link href={'/'}>
          <TicketDevLogo />
        </Link>
      </Stack>
      
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {user ? (
          <>
            <Link href={accountLink}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Olá, {user.name}
              </Typography>
            </Link>
            {user.role === "ORGANIZER" && 
              <Button variant="outlined" color="primary" size="small" href='/gate'>
                Portaria
              </Button>
            }
            {user.role === "CONSUMER" && 
              <Button variant="outlined" color="primary" size="small" href='/tickets'>
                Tickets
              </Button>
            }
            
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