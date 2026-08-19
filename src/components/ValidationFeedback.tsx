'use client';

import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import { ValidationResult } from '@/types/gate';

interface ValidationFeedbackProps {
  result: ValidationResult;
  onDismiss: () => void;
}

export const ValidationFeedback = ({ result, onDismiss }: ValidationFeedbackProps) => {
  if (result.status === 'NONE') return null;

  const getFeedbackStyles = () => {
    switch (result.status) {
      case 'VALID':
        return { bgColor: '#10b981', icon: <CheckCircleIcon sx={{ fontSize: 90, color: 'white' }} />, title: 'VALIDADO' };
      case 'ALREADY_USED':
        return { bgColor: '#f59e0b', icon: <WarningIcon sx={{ fontSize: 90, color: 'white' }} />, title: 'JÁ UTILIZADO' };
      case 'WRONG_EVENT':
        return { bgColor: '#3b82f6', icon: <InfoIcon sx={{ fontSize: 90, color: 'white' }} />, title: 'EVENTO ERRADO' };
      case 'INVALID':
        return { bgColor: '#ef4444', icon: <ErrorIcon sx={{ fontSize: 90, color: 'white' }} />, title: 'INVALIDO' };
      default:
        return { bgColor: 'transparent', icon: null, title: '' };
    }
  };

  const feedback = getFeedbackStyles();

  return (
    <Box 
      sx={{ 
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        bgcolor: feedback.bgColor,
        zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        p: 4, color: 'white', textAlign: 'center',
        animation: 'fadeIn 0.2s ease'
      }}
    >
      {feedback.icon}
      
      <Typography variant="h2" sx={{ fontWeight: 900, mt: 3, letterSpacing: '-2px' }}>
        {feedback.title}
      </Typography>

      <Typography variant="h5" sx={{ fontWeight: 600, mt: 2, mb: 4, maxWidth: '600px' }}>
        {result.message}
      </Typography>

      {result.ticketDetails && (
        <Paper 
          sx={{ 
            p: 3, bgcolor: 'rgba(255, 255, 255, 0.12)', borderRadius: 3, mb: 5, 
            maxWidth: '500px', width: '100%', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
            {result.ticketDetails.movieTitle}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
            Portador: <strong>{result.ticketDetails.clientName}</strong>
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 900, color: '#fcd34d' }}>
            Assento: {result.ticketDetails.seatNumber}
          </Typography>
        </Paper>
      )}

      <Button 
        variant="contained" color="inherit" size="large" onClick={onDismiss}
        sx={{ 
          color: feedback.bgColor, bgcolor: 'white', fontWeight: 800, px: 5, py: 1.5,
          borderRadius: 3, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
        }}
      >
        PRÓXIMO INGRESSO
      </Button>
    </Box>
  );
};