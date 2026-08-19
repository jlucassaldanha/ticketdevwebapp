'use client'

import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Alert, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Link
} from '@mui/material';
import TicketDevLogo from '@/components/TicketDevLogo';
import useRegister from '@/hooks/useRegister';

export default function RegisterPage() {
  const {
    error,
    role,
    password,
    email,
    name,
    submitting,
    handleRoleChange,
    handleEmailChange,
    handleNameChange,
    handlePasswordChange,
    handleSubmit
  } = useRegister()

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', alignItems: 'center', py: 6 }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          <TicketDevLogo />

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Nome Completo"
              type="text"
              variant="outlined"
              fullWidth
              required
              value={name}
              onChange={handleNameChange}
            />
            
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

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Tipo de Conta (Para testes)</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Tipo de Conta (Para testes)"
                onChange={handleRoleChange}
              >
                <MenuItem value="CONSUMER">Cliente (Compra ingressos e assentos)</MenuItem>
                <MenuItem value="ORGANIZER">Organizador (Cria e edita eventos)</MenuItem>
                <MenuItem value="VALIDATOR">Portaria (Valida ingressos na entrada)</MenuItem>
              </Select>
            </FormControl>

            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              disabled={submitting}
            >
              {submitting ? 'Criando conta...' : 'Registrar e Entrar'}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Já tem uma conta?{' '}
              <Link href="/login" sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Faça login
              </Link>
            </Typography>
          </Box>

        </Paper>
      </Container>
    </Box>
  )
}