'use client';

import React from 'react';
import { Paper, Typography, Button } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import Link from 'next/link';

export const EmptyTickets = () => {
  return (
    <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed #3f3f46', bgcolor: 'transparent' }}>
      <MovieIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Você ainda não comprou ingressos
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Navegue pelo nosso catálogo, selecione seu assento e garanta sua sessão favorita.
      </Typography>
      <Button component={Link} href="/" variant="contained" color="primary">
        Ver Filmes em Cartaz
      </Button>
    </Paper>
  );
};