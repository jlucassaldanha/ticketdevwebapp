'use client';

import React from 'react';
import { Container, Paper, Typography, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CheckoutSuccessProps {
  seat: string;
  movieTitle: string;
}

export const CheckoutSuccess = ({ seat, movieTitle }: CheckoutSuccessProps) => {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Paper sx={{ p: 5, textAlign: 'center', border: '1px solid #10b981', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
        <CheckCircleIcon sx={{ fontSize: 70, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'success.main' }}>
          Pagamento Aprovado!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Seu assento <strong>{seat}</strong> para o filme <strong>{movieTitle}</strong> foi reservado com sucesso.
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
          Gerando seu ingresso criptografado com QR Code...
        </Typography>
        <CircularProgress size={24} sx={{ mt: 2 }} color="primary" />
      </Paper>
    </Container>
  );
};