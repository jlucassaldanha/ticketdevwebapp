'use client';

import React from 'react';
import { Container, Typography, Box, Button, Stack, CircularProgress, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useTickets } from '@/hooks/useTickets';
import { EmptyTickets } from '@/components/EmptyTickets';
import { TicketCard } from '@/components/TicketCard';
import { CancelDialog } from '@/components/CancelDialog';

export default function MyTicketsPage() {
  const {
    tickets,
    loading,
    error,
    cancelDialogOpen,
    ticketToCancel,
    cancelling,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
    handleShare
  } = useTickets();

  return (
    <ProtectedRoute allowedRoles={['CONSUMER']}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary' }}>
        <Container maxWidth="md">
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Button 
              component={Link} 
              href="/" 
              startIcon={<ArrowBackIcon />} 
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Voltar ao Catálogo
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Ticket<span style={{ color: '#7c3aed' }}>Dev</span>
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Meus <span style={{ background: 'linear-gradient(45deg, #7c3aed, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Ingressos</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Aqui estão suas reservas de cinema. Apresente o QR Code na portaria!
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : tickets.length === 0 ? (
            <EmptyTickets />
          ) : (
            <Stack spacing={4}>
              {tickets.map((ticket) => (
                <TicketCard 
                  key={ticket.id}
                  ticket={ticket}
                  onShare={handleShare}
                  onCancel={handleOpenCancelDialog}
                />
              ))}
            </Stack>
          )}
        </Container>

        <CancelDialog 
          open={cancelDialogOpen}
          ticket={ticketToCancel}
          cancelling={cancelling}
          onClose={handleCloseCancelDialog}
          onConfirm={handleConfirmCancel}
        />
      </Box>
    </ProtectedRoute>
  );
}