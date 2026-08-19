'use client';

import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, CircularProgress } from '@mui/material';

interface ManualValidatorProps {
  selectedEventId: string;
  validating: boolean;
  onValidate: (hash: string) => void;
}

export const ManualValidator = ({ selectedEventId, validating, onValidate }: ManualValidatorProps) => {
  const [hashInput, setHashInput] = useState('');

  const handleValidateClick = () => {
    onValidate(hashInput); 
    setHashInput('');      
  };

  return (
    <Paper 
      sx={{ 
        p: 4, height: '100%', display: 'flex', flexDirection: 'column', 
        justifyContent: 'center', opacity: selectedEventId ? 1 : 0.4
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
        Contingência Manual
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Caso a câmera falhe ou o avaliador esteja testando na máquina local, digite ou cole o Hash do Ingresso (`secureHash`) abaixo:
      </Typography>

      <TextField
        label="Hash do Ingresso"
        variant="outlined"
        fullWidth
        disabled={!selectedEventId || validating}
        value={hashInput}
        onChange={(e) => setHashInput(e.target.value)}
        placeholder="ex: hmac_sha256_..."
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        disabled={!selectedEventId || !hashInput.trim() || validating}
        onClick={handleValidateClick}
      >
        {validating ? <CircularProgress size={24} /> : 'Validar Entrada'}
      </Button>
    </Paper>
  );
};