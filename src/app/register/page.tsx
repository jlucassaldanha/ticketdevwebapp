'use client'

import React, { useState } from 'react';
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
  SelectChangeEvent,
  Link
} from '@mui/material';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterApiResponse } from '@/types/auth';
import TicketDevLogo from '@/components/TicketDevLogo';

export default function RegisterPage() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'CLIENTE' | 'ORGANIZADOR' | 'PORTARIA'>('CLIENTE')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as 'CLIENTE' | 'ORGANIZADOR' | 'PORTARIA')
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const data = await apiFetch<RegisterApiResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      })

      login(data.token, data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta')
    } finally {
      setSubmitting(false)
    }
  }

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
              onChange={(e) => setName(e.target.value)}
            />
            
            <TextField
              label="E-mail"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Senha"
              type="password"
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Tipo de Conta (Para testes)</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Tipo de Conta (Para testes)"
                onChange={handleRoleChange}
              >
                <MenuItem value="CLIENTE">Cliente (Compra ingressos e assentos)</MenuItem>
                <MenuItem value="ORGANIZADOR">Organizador (Cria e edita eventos)</MenuItem>
                <MenuItem value="PORTARIA">Portaria (Valida ingressos na entrada)</MenuItem>
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