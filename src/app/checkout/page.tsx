'use client';

import React, { Suspense } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

import { useCheckout } from '@/hooks/useCheckout';
import { CheckoutSuccess } from '@/components/CheckoutSuccess';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { PaymentSimulator } from '@/components/PaymentSimulator';
import { OrderSummary } from '@/components/OrderSummary';

function CheckoutContent() {
  const {
    event,
    seat,
    loading,
    paymentMethod,
    setPaymentMethod,
    submitting,
    error,
    success,
    router,
    handleProcessPayment
  } = useCheckout();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!event || !seat) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, color: 'white' }}>
        <Typography variant="h5">Dados de checkout inválidos ou incompletos.</Typography>
        <Button component={Link} href="/" sx={{ mt: 2 }} variant="contained">Voltar ao catálogo</Button>
      </Box>
    );
  }

  if (success) {
    return <CheckoutSuccess seat={seat} movieTitle={event.title} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button 
        onClick={() => router.back()}
        startIcon={<ArrowBackIcon />} 
        sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
      >
        Voltar para Seleção de Assentos
      </Button>

      <Typography variant="h3" sx={{ fontWeight: 800, mb: 4, letterSpacing: '-1px' }}>
        Finalizar <span style={{ color: '#7c3aed' }}>Compra</span>
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <PaymentMethodSelector 
            value={paymentMethod} 
            onChange={setPaymentMethod} 
          />
          <PaymentSimulator 
            submitting={submitting} 
            error={error} 
            onProcessPayment={handleProcessPayment} 
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummary event={event} seat={seat} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute allowedRoles={["CONSUMER"]}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CircularProgress color="primary" />
          </Box>
        }>
          <CheckoutContent />
        </Suspense>
      </Box>
    </ProtectedRoute>
  );
}