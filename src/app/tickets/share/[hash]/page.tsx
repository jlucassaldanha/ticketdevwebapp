'use client';

import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import useShare from '@/hooks/useShare';
import { ShareLoading } from '@/components/ShareLoading';
import { ShareError } from '@/components/ShareError';
import { SharedTicketCard } from '@/components/SharedTicketCard';

export default function ShareTicketPage() {
  const { loading, error, ticket } = useShare();

  if (loading) {
    return <ShareLoading />;
  }

  if (error || !ticket) {
    return <ShareError error={error} />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 8, color: 'text.primary', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="sm">
        
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
            Ticket<span style={{ color: '#7c3aed' }}>Dev</span>
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '2px', fontWeight: 700 }}>
            INGRESSO COMPARTILHADO VIA LINK
          </Typography>
        </Box>

        <SharedTicketCard ticket={ticket} />

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button component={Link} href="/" variant="outlined" startIcon={<HomeIcon />} size="small">
            Ir para o Catálogo Geral
          </Button>
        </Box>

      </Container>
    </Box>
  );
}