'use client';

import React from 'react';
import { 
  Container, Typography, Box, Paper, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, Grid, Alert
} from '@mui/material';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

import { useGateValidator } from '@/hooks/useGateValidator';
import { ValidationFeedback } from '@/components/ValidationFeedback';
import { CameraScanner } from '@/components/CameraScanner';
import { ManualValidator } from '@/components/ManualValidator';
import Header from '@/components/Header';

export default function PortariaPage() {
  const {
    events,
    selectedEventId,
    loading,
    validating,
    validationResult,
    isCameraActive,
    setIsCameraActive,
    handleEventChange,
    handleValidateTicket,
    handleDismissResult
  } = useGateValidator();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['VALIDATOR', 'ORGANIZER']}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary', position: 'relative' }}>
        
        <ValidationFeedback result={validationResult} onDismiss={handleDismissResult} />

        <Container maxWidth="md">

          <Header />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Button 
              component={Link} href="/" startIcon={<ArrowBackIcon />} 
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Voltar ao Catálogo
            </Button>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800 }}>
              Operador da Portaria
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Portaria <span style={{ color: '#7c3aed' }}>Digital</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Selecione o evento e leia o QRCode.
          </Typography>

          <Paper sx={{ p: 4, mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="gate-event-label">Selecione o Evento</InputLabel>
              <Select
                labelId="gate-event-label"
                value={selectedEventId}
                label="Selecione o Evento"
                onChange={(e) => handleEventChange(e.target.value)}
              >
                {events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.title} — {ev.location} ({new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {!selectedEventId && (
            <Alert severity="info" sx={{ my: 4, bgcolor: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', '& .MuiAlert-message': { color: 'white' } }}>
              Escolha uma sessão no seletor acima para liberar as ferramentas de validação e scanner da portaria.
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <CameraScanner 
                isCameraActive={isCameraActive}
                selectedEventId={selectedEventId}
                onToggleCamera={() => setIsCameraActive(!isCameraActive)}
                onScan={handleValidateTicket}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ManualValidator 
                selectedEventId={selectedEventId}
                validating={validating}
                onValidate={handleValidateTicket}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}