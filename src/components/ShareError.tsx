'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';

interface ShareErrorProps {
  error?: string | null;
}

export const ShareError = ({ error }: ShareErrorProps) => {
  return (
    <Box sx={{ textAlign: 'center', py: 10, px: 3, bgcolor: 'background.default', minHeight: '100vh', color: 'white' }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: 'error.main' }}>
        Voucher não encontrado
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: '500px', mx: 'auto' }}>
        {error || 'Não conseguimos ler os dados deste ingresso. Confirme com a pessoa que o compartilhou.'}
      </Typography>
      <Button component={Link} href="/" variant="contained" startIcon={<HomeIcon />}>
        Ir para a Página Inicial
      </Button>
    </Box>
  );
};