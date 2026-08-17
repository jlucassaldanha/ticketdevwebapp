'use client'

import React, { useState } from 'react';
import { Container, Box, TextField, Button, Paper, Stack, Divider, Alert } from '@mui/material';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import KeyIcon from '@mui/icons-material/Key';
import { LoginApiResponse } from '@/types/auth';
import TicketDevLogo from '@/components/TicketDevLogo';
import LoginRegisterQuestion from '@/components/LoginRegisterQuestion';

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const data = await apiFetch<LoginApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      login(data.token, data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na autenticação')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickFill = (role: 'organizer' | 'consumer' | 'validator') => {
    setPassword('SenhaTeste123')
    if (role === 'organizer') setEmail('organizador1@ticketdev.com')
    if (role === 'consumer') setEmail('cliente1@ticketdev.com')
    if (role === 'validator') setEmail('portaria@ticketdev.com')
  }

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