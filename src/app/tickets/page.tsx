'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Paper, 
  Stack,  
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CancelIcon from '@mui/icons-material/Cancel';
import ShareIcon from '@mui/icons-material/Share';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute'; // Ajuste o import conforme seu projeto
import Link from 'next/link';
import { Ticket } from '@/types/ticket';


export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para Modal de Confirmação de Cancelamento
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState<Ticket | null>(null);
  const [cancelling, setCancelling] = useState(false);

  // Carrega os ingressos do cliente
  const loadTickets = async () => {
    try {
      const data = await apiFetch<Ticket[]>('/api/tickets/my-tickets');
      // Filtramos para não poluir a listagem principal com cancelados, 
      // ou podemos exibir com visual "apagado". Vamos exibir todos e ordenar por data.
      setTickets(data);
    } catch (err) {
      console.error('Erro ao carregar ingressos:', err);
      setError('Falha ao carregar seus ingressos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // Abre diálogo de confirmação de cancelamento
  const handleOpenCancelDialog = (ticket: Ticket) => {
    setTicketToCancel(ticket);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setTicketToCancel(null);
    setCancelDialogOpen(false);
  };

  // Dispara o cancelamento no back-end
  const handleConfirmCancel = async () => {
    if (!ticketToCancel) return;
    setCancelling(true);
    try {
      // Endpoint estrito do seu back-end para cancelamento transacional
      await apiFetch(`/api/tickets/${ticketToCancel.id}/cancel`, {
        method: 'POST'
      });
      
      // Recarrega os dados locais atualizados (liberando a poltrona no SQLite)
      await loadTickets();
      handleCloseCancelDialog();
    } catch (err) {
      console.error('Erro ao cancelar ticket:', err);
      alert(err instanceof Error ? err.message : 'Falha ao cancelar o ingresso.');
    } finally {
      setCancelling(false);
    }
  };

  // Abre janela de compartilhamento nativa do celular/navegador ou copia link
  const handleShare = (secureHash: string) => {
    const shareUrl = `${window.location.origin}/tickets/share/${secureHash}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Ingresso - TicketDev 🍿',
        text: 'Dá uma olhada no meu ingresso de cinema!',
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link de compartilhamento copiado para a área de transferência!'))
        .catch(() => alert(`Copie este link para compartilhar: ${shareUrl}`));
    }
  };

  return (
    <ProtectedRoute allowedRoles={['CONSUMER']}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary' }}>
        <Container maxWidth="md">
          
          {/* Header */}
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
            Aqui estão suas reservas de cinema. Apresente o QR Code na portaria ou compartilhe o link do voucher com seus amigos!
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : tickets.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed #3f3f46', bgcolor: 'transparent' }}>
              <MovieIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Você ainda não comprou ingressos</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Navegue pelo nosso catálogo, selecione seu assento e garanta sua sessão favorita.
              </Typography>
              <Button component={Link} href="/" variant="contained" color="primary">
                Ver Filmes em Cartaz
              </Button>
            </Paper>
          ) : (
            <Stack spacing={4}>
              {tickets.map((ticket) => {
                const isCancelled = ticket.status === 'CANCELADO';
                const isUsed = ticket.status === 'UTILIZADO';
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&bgcolor=ffffff&data=${ticket.secureHash}`;

                return (
                  <Paper 
                    key={ticket.id}
                    elevation={0}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: isCancelled ? '#27272a' : '#3f3f46',
                      opacity: isCancelled ? 0.55 : 1,
                      position: 'relative',
                      bgcolor: 'background.paper',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: isCancelled ? 'none' : 'scale(1.01)',
                      }
                    }}
                  >
                    
                    {/* PARTE ESQUERDA: Detalhes do Ingresso (Cria o visual de bilhete de cinema) */}
                    <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Box>
                        {/* Status Chip */}
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                          <Chip 
                            label={ticket.event.category} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontWeight: 700 }}
                          />
                          <Chip 
                            label={ticket.status} 
                            size="small" 
                            color={isCancelled ? 'error' : isUsed ? 'default' : 'success'} 
                            sx={{ fontWeight: 800 }}
                          />
                        </Stack>

                        <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, lineHeight: 1.2 }}>
                          {ticket.event.title}
                        </Typography>

                        <Grid container spacing={2}>
                          {/* Data/Hora */}
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <CalendarMonthIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Sessão</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {new Date(ticket.event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>

                          {/* Localização */}
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <LocationOnIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Local</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {ticket.event.location}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>

                          {/* Poltrona */}
                          <Grid item xs={12} sm={6}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <EventSeatIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Assento</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                                  {ticket.seatNumber ? `Fileira ${ticket.seatNumber[0]}, Cadeira ${ticket.seatNumber.substring(1)}` : 'Não demarcado'}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Botões de Ação do Voucher */}
                      {!isCancelled && (
                        <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                          <Button 
                            variant="outlined" 
                            color="secondary" 
                            size="small"
                            startIcon={<ShareIcon />}
                            onClick={() => handleShare(ticket.secureHash)}
                          >
                            Compartilhar
                          </Button>
                          {!isUsed && (
                            <Button 
                              variant="outlined" 
                              color="error" 
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => handleOpenCancelDialog(ticket)}
                            >
                              Cancelar Compra
                            </Button>
                          )}
                        </Stack>
                      )}
                    </Box>

                    {/* PERFURAÇÃO ESTILO BILHETE (Dotted vertical separator) */}
                    <Box 
                      sx={{ 
                        width: { xs: '100%', md: '1px' }, 
                        borderLeft: { md: '2px dashed #3f3f46' }, 
                        borderTop: { xs: '2px dashed #3f3f46', md: 'none' },
                        position: 'relative',
                        my: { xs: 0, md: 2 }
                      }} 
                    />

                    {/* PARTE DIREITA: QR Code Stub */}
                    <Box 
                      sx={{ 
                        p: 4, 
                        width: { xs: '100%', md: 240 }, 
                        minWidth: 240, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.01)',
                        textAlign: 'center'
                      }}
                    >
                      {isCancelled ? (
                        <Box sx={{ color: 'error.main', py: 4 }}>
                          <CancelIcon sx={{ fontSize: 50, mb: 1 }} />
                          <Typography variant="button" sx={{ fontWeight: 800, display: 'block' }}>INGRESSO CANCELADO</Typography>
                        </Box>
                      ) : (
                        <>
                          {/* QR Code gerado dinamicamente com base no secureHash */}
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              bgcolor: 'white', 
                              borderRadius: 3, 
                              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                              mb: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative'
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={qrUrl} 
                              alt="QR Code de Validação" 
                              style={{ width: '150px', height: '150px', display: 'block' }} 
                            />
                          </Box>
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
                            <QrCode2Icon sx={{ fontSize: 16 }} />
                            <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '1px' }}>
                              PORTARIA OFFLINE
                            </Typography>
                          </Stack>
                        </>
                      )}
                    </Box>

                  </Paper>
                );
              })}
            </Stack>
          )}
        </Container>

        {/* DIÁLOGO CONFIRMAÇÃO DE CANCELAMENTO */}
        <Dialog
          open={cancelDialogOpen}
          onClose={handleCloseCancelDialog}
          aria-labelledby="cancel-dialog-title"
          aria-describedby="cancel-dialog-description"
        >
          <DialogTitle id="cancel-dialog-title">
            {"Deseja realmente cancelar este ingresso?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="cancel-dialog-description">
              Esta ação é **irreversível**. O assento <strong>{ticketToCancel?.seatNumber}</strong> para a sessão de <strong>{ticketToCancel?.event.title}</strong> será devolvido imediatamente para o inventário do cinema e ficará disponível para outros clientes comprarem. O estorno será processado na sua forma de pagamento.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseCancelDialog} color="inherit" disabled={cancelling}>
              Manter Ingresso
            </Button>
            <Button 
              onClick={handleConfirmCancel} 
              color="error" 
              variant="contained"
              autoFocus
              disabled={cancelling}
            >
              {cancelling ? 'Cancelando...' : 'Sim, Cancelar e Estornar'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ProtectedRoute>
  );
}
