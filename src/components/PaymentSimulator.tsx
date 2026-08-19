'use client';

import React from 'react';
import { Paper, Typography, Stack, Button, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

interface PaymentSimulatorProps {
  submitting: boolean;
  error: string | null;
  onProcessPayment: (status: 'APPROVED' | 'REFUSED') => void;
}

export const PaymentSimulator = ({ submitting, error, onProcessPayment }: PaymentSimulatorProps) => {
  return (
    <>
      {error && (
        <Alert 
          severity="error" 
          icon={<ErrorIcon sx={{ color: '#ef4444' }} />}
          sx={{ 
            p: 2, mb: 4, border: '1px solid #ef4444', 
            bgcolor: 'rgba(239, 68, 68, 0.05)',
            '& .MuiAlert-message': { color: 'white', fontWeight: 600 }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5, color: '#ef4444' }}>
            Transação Recusada:
          </Typography>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4, border: '1px dashed #7c3aed', bgcolor: 'rgba(124, 58, 237, 0.02)' }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main', mb: 1 }}>
          Simulador Financeiro (Ambiente de Testes)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Utilize os botões abaixo para forçar os dois caminhos de resposta obrigatórios previstos no edital e validar o comportamento do sistema.
        </Typography>
        
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            size="large"
            disabled={submitting}
            onClick={() => onProcessPayment('APPROVED')}
          >
            Simular Aprovação
          </Button>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            size="large"
            disabled={submitting}
            onClick={() => onProcessPayment('REFUSED')}
            sx={{ border: '1.5px solid' }}
          >
            Simular Recusa
          </Button>
        </Stack>
      </Paper>
    </>
  );
};