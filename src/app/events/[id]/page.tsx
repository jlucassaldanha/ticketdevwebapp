'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  IconButton,
  Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import { Event } from '@/types/event';

export default function SeatSelectionPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getDynamicGrid = (capacity: number) => {
    let cols = 8;
    if (capacity > 100) cols = 12;
    else if (capacity > 40) cols = 10;

    const totalRows = Math.ceil(capacity / cols);
    const rowLetters: string[] = [];

    for (let i = 0; i < totalRows; i++) {
      const letter = String.fromCharCode(65 + i);
      rowLetters.push(letter);
    }

    return { rows: rowLetters, seatsPerRow: cols };
  };

  const { rows, seatsPerRow } = event ? getDynamicGrid(event.capacity) : { rows: ['A', 'B', 'C', 'D', 'E'], seatsPerRow: 8 };

  useEffect(() => {
    async function loadData() {
      try {
        const allEvents = await apiFetch<Event[]>('/api/events');

        const foundEvent = allEvents.find((e) => e.id === id);

        if (foundEvent) {
          setEvent(foundEvent);
          
          const occupied = foundEvent.tickets
            ?.filter((ticket) => ticket.status !== 'CANCELADO' && ticket.seatNumber)
            .map((ticket) => ticket.seatNumber as string) || [];
            
          setOccupiedSeats(occupied);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do evento:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleSeatClick = (seatCode: string) => {
    if (occupiedSeats.includes(seatCode)) return; 
    setSelectedSeat(selectedSeat === seatCode ? null : seatCode);
  };

  const handleProceedToCheckout = () => {
    if (!selectedSeat) return;
    router.push(`/checkout?eventId=${id}&seat=${selectedSeat}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'background.default', minHeight: '100vh', color: 'white' }}>
        <Typography variant="h5">Filme não encontrado.</Typography>
        <Button component={Link} href="/" sx={{ mt: 2 }} variant="contained">Voltar ao catálogo</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary' }}>
      <Container maxWidth="lg">
        
        <Button 
          component={Link} 
          href="/" 
          startIcon={<ArrowBackIcon />} 
          sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
        >
          Voltar ao Catálogo
        </Button>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper' }}>
              
              <Box sx={{ width: '100%', mb: 6, textAlign: 'center', position: 'relative' }}>
                <Box sx={{ height: '6px', width: '80%', bgcolor: 'primary.main', mx: 'auto', borderRadius: '50%', boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, letterSpacing: '2px', fontWeight: 700 }}>
                  TELA DO CINEMA
                </Typography>
              </Box>

              <Stack spacing={2} sx={{ width: '100%', alignItems: 'center', mb: 6 }}>
                {rows.map((row) => (
                  <Stack key={row} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ width: 16, fontWeight: 700, color: 'text.secondary' }}>{row}</Typography>

                    {Array.from({ length: seatsPerRow }).map((_, index) => {
                      const seatNumber = index + 1;
                      const seatCode = `${row}${seatNumber}`;
                      const isOccupied = occupiedSeats.includes(seatCode);
                      const isSelected = selectedSeat === seatCode;

                      const rowIndex = rows.indexOf(row);
                      const absoluteSeatIndex = (rowIndex * seatsPerRow) + index;
                      const isSeatWithinCapacity = absoluteSeatIndex < event.capacity;

                      if (!isSeatWithinCapacity) {
                        return (
                          <Box 
                            key={`empty-${seatCode}`} 
                            sx={{ width: { xs: 32, sm: 38 }, height: { xs: 32, sm: 38 } }} 
                          />
                        );
                      }

                      return (
                        <IconButton
                          key={seatCode}
                          onClick={() => handleSeatClick(seatCode)}
                          disabled={isOccupied} 
                          sx={{
                            p: 0,
                            cursor: isOccupied ? 'not-allowed' : 'pointer',
                            '&.Mui-disabled': {
                              opacity: 1, 
                            }
                          }}
                        >
                          <Avatar
                            sx={{
                              width: { xs: 32, sm: 38 },
                              height: { xs: 32, sm: 38 },
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              
                              bgcolor: isOccupied 
                                ? 'rgba(255, 255, 255, 0.05)' 
                                : isSelected 
                                  ? 'primary.main' 
                                  : 'rgba(255, 255, 255, 0.08)', 
                              
                              color: isOccupied 
                                ? 'text.disabled' 
                                : isSelected 
                                  ? 'primary.contrastText' 
                                  : 'text.secondary',

                              border: isSelected 
                                ? '2px solid #7c3aed' 
                                : isOccupied 
                                  ? '1px solid rgba(255, 255, 255, 0.02)' 
                                  : '1px solid #3f3f46', 

                              '&:hover': {
                                bgcolor: isOccupied 
                                  ? 'rgba(255, 255, 255, 0.05)' 
                                  : isSelected 
                                    ? 'primary.dark'
                                    : 'rgba(124, 58, 237, 0.2)', 
                                borderColor: isOccupied ? 'transparent' : 'primary.main',
                                color: isOccupied ? 'text.disabled' : 'primary.main',
                              }
                            }}
                          >
                            {seatNumber}
                          </Avatar>
                        </IconButton>
                      );
                    })}

                    <Typography variant="body2" sx={{ width: 16, fontWeight: 700, color: 'text.secondary', textAlign: 'right' }}>{row}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Stack direction="row" spacing={3} sx={{ justifyContent: 'center', width: '100%', mt: 2 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      color: 'text.secondary',
                      border: '1px solid #3f3f46'
                    }}
                  >
                    D
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">Disponível</Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      border: '2px solid #7c3aed'
                    }}
                  >
                    S
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">Selecionado</Typography>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 28, 
                      height: 28, 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: 'text.disabled',
                      border: '1px solid rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    O
                  </Avatar>
                  <Typography variant="caption" color="text.secondary">Ocupado</Typography>
                </Stack>

              </Stack>

            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justify_content: 'space-between' }}>
              <Box>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>Você escolheu:</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, mb: 3, lineHeight: 1.2 }}>{event.title}</Typography>

                <Stack spacing={2} sx={{ mb: 4 }} color="text.secondary">
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
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Assento Selecionado:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: selectedSeat ? 'primary.main' : 'text.secondary' }}>
                    {selectedSeat ? `Fileira ${selectedSeat}, Poltrona ${selectedSeat.substring(1)}` : 'Nenhum'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Valor do Ingresso:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>R$ {event.price.toFixed(2)}</Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>Total:</Typography>
                  <Typography variant="h5" color="secondary.main" sx={{ fontWeight: 900 }}>
                    R$ {selectedSeat ? event.price.toFixed(2) : '0,00'}
                  </Typography>
                </Box>

                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  disabled={!selectedSeat}
                  onClick={handleProceedToCheckout}
                >
                  Confirmar e Ir para Pagamento
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}