'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Paper, 
  Stack, 
  Divider, 
  CircularProgress,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PixIcon from '@mui/icons-material/Pix';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { Event } from '@/types/event';
import { ReserveTicketResponse } from '@/types/ticket';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventSeatIcon from '@mui/icons-material/EventSeat';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = searchParams.get('eventId');
  const seat = searchParams.get('seat');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX'>('CREDIT_CARD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) {
        setLoading(false);
        return;
      }
      try {
        const allEvents = await apiFetch<Event[]>('/api/events');
        const foundEvent = allEvents.find((e) => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme para o checkout:', err);
        setError('Não foi possível carregar os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const handleProcessPayment = async (simulateStatus: 'APPROVED' | 'REFUSED') => {
    if (!eventId || !seat) return;
    
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        eventId,
        seatNumber: seat,
        paymentMethod,
        paymentSimulateStatus: simulateStatus
      };

      await apiFetch<ReserveTicketResponse>('/api/tickets/reserve', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (simulateStatus === 'APPROVED') {
        setSuccess(true);
        setTimeout(() => {
          router.push('/ingressos');
        }, 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao processar a requisição de pagamento.');
    } finally {
      setSubmitting(false);
    }
  };

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
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper sx={{ p: 5, textAlign: 'center', border: '1px solid #10b981', bgcolor: 'rgba(16, 185, 129, 0.05)' }}>
          <CheckCircleIcon sx={{ fontSize: 70, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: 'success.main' }}>
            Pagamento Aprovado!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Seu assento <strong>{seat}</strong> para o filme <strong>{event.title}</strong> foi reservado com sucesso.
          </Typography>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
            Gerando seu ingresso criptografado com QR Code...
          </Typography>
          <CircularProgress size={24} sx={{ mt: 2 }} color="primary" />
        </Paper>
      </Container>
    );
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
          <Paper sx={{ p: 4, mb: 4 }}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary', mb: 3 }}>
                Escolha a forma de pagamento:
              </FormLabel>
              
              <RadioGroup 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value as 'CREDIT_CARD' | 'PIX')}
              >
                <Grid container spacing={2}>
                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card 
                      variant="outlined" 
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      sx={{ 
                        cursor: 'pointer',
                        borderColor: paymentMethod === 'CREDIT_CARD' ? 'primary.main' : '#3f3f46',
                        bgcolor: paymentMethod === 'CREDIT_CARD' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                        transition: '0.2s',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                        <FormControlLabel 
                          value="CREDIT_CARD" 
                          control={<Radio color="primary" />} 
                          label="" 
                          sx={{ m: 0 }}
                        />
                        <CreditCardIcon sx={{ color: paymentMethod === 'CREDIT_CARD' ? 'primary.main' : 'text.secondary' }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>Cartão de Crédito</Typography>
                          <Typography variant="caption" color="text.secondary">Aprovação instantânea</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card 
                      variant="outlined" 
                      onClick={() => setPaymentMethod('DEBIT_CARD')}
                      sx={{ 
                        cursor: 'pointer',
                        borderColor: paymentMethod === 'DEBIT_CARD' ? 'primary.main' : '#3f3f46',
                        bgcolor: paymentMethod === 'DEBIT_CARD' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                        transition: '0.2s',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                        <FormControlLabel 
                          value="DEBIT_CARD" 
                          control={<Radio color="primary" />} 
                          label="" 
                          sx={{ m: 0 }}
                        />
                        <CreditCardIcon sx={{ color: paymentMethod === 'DEBIT_CARD' ? 'primary.main' : 'text.secondary' }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>Cartão de Débito</Typography>
                          <Typography variant="caption" color="text.secondary">Aprovação instantânea</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Card 
                      variant="outlined" 
                      onClick={() => setPaymentMethod('PIX')}
                      sx={{ 
                        cursor: 'pointer',
                        borderColor: paymentMethod === 'PIX' ? 'primary.main' : '#3f3f46',
                        bgcolor: paymentMethod === 'PIX' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                        transition: '0.2s',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                        <FormControlLabel 
                          value="PIX" 
                          control={<Radio color="primary" />} 
                          label="" 
                          sx={{ m: 0 }}
                        />
                        <PixIcon sx={{ color: paymentMethod === 'PIX' ? 'primary.main' : 'text.secondary' }} />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>Pix</Typography>
                          <Typography variant="caption" color="text.secondary">Código copia e cola gerado</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                </Grid>
              </RadioGroup>
            </FormControl>
          </Paper>

          {error && (
            <Alert 
              severity="error" 
              icon={<ErrorIcon sx={{ color: '#ef4444' }} />}
              sx={{ 
                p: 2, 
                mb: 4, 
                border: '1px solid #ef4444', 
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
                onClick={() => handleProcessPayment('APPROVED')}
              >
                Simular Aprovação
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                size="large"
                disabled={submitting}
                onClick={() => handleProcessPayment('REFUSED')}
                sx={{ border: '1.5px solid' }}
              >
                Simular Recusa
              </Button>
            </Stack>
          </Paper>
        </Grid>

        

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Resumo do Pedido</Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5, mb: 1, lineHeight: 1.2 }}>{event.title}</Typography>
              <Typography variant="body2" color="text.secondary">{event.category}</Typography>
            </Box>

            <Divider sx={{ my: 2.5 }} />

            <Stack spacing={2} sx={{ mb: 3 }} color="text.secondary">
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <CalendarMonthIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <LocationOnIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">{event.location}</Typography>
              </Stack>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <EventSeatIcon />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  Fileira {seat}, Poltrona {seat.substring(1)}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mt: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>Total a Pagar:</Typography>
              <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 900 }}>
                R$ {event.price.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Container>
  );
}

// 💡 Sênior: useSearchParams exige Suspense boundary no Next.js App Router para funcionar corretamente em compilações estáticas/SSR!
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