'use client'

import { Container, Box, TextField, Button, Paper, Stack, Divider, Alert } from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import TicketDevLogo from '@/components/TicketDevLogo';
import LoginRegisterQuestion from '@/components/LoginRegisterQuestion';
import useLogin from '@/hooks/useLogin';

export default function LoginPage() {
  const {
    email,
    password,
    submitting,
    error,
    handleSubmit,
    handleQuickFill,
    handleEmailChange,
    handlePasswordChange
  } = useLogin()

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <TicketDevLogo />

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="E-mail"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>

          <LoginRegisterQuestion 
            question='Ainda não tem uma conta' 
            response='Registre-se' 
            href='/register'
          />

          <Divider sx={{ my: 1 }}>Acesso rápido de teste</Divider>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<KeyIcon />}
              onClick={() => handleQuickFill('organizer')}
              sx={{ borderColor: '#7c3aed33' }}
            >
              Organizador
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<KeyIcon />}
              onClick={() => handleQuickFill('consumer')}
              sx={{ borderColor: '#7c3aed33' }}
            >
              Cliente
            </Button>
            <Button 
              variant="outlined" 
              size="small" 
              startIcon={<KeyIcon />}
              onClick={() => handleQuickFill('validator')}
              sx={{ borderColor: '#7c3aed33' }}
            >
              Portaria
            </Button>
          </Stack>

        </Paper>
      </Container>
    </Box>
  )
}