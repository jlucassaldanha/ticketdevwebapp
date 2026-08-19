'use client';

import React from 'react';
import { Box, Paper, Stack, Typography, Grid, Button, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import CancelIcon from '@mui/icons-material/Cancel';
import ShareIcon from '@mui/icons-material/Share';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { Ticket } from '@/types/ticket';

interface TicketCardProps {
  ticket: Ticket;
  onShare: (secureHash: string) => void;
  onCancel: (ticket: Ticket) => void;
}

export const TicketCard = ({ ticket, onShare, onCancel }: TicketCardProps) => {
  const isCancelled = ticket.status === 'CANCELLED';
  const isUsed = ticket.status === 'USED';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&bgcolor=ffffff&data=${ticket.secureHash}`;

  return (
    <Paper 
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
      }}
    >
      <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
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
            <Grid size={{ xs:12, sm:6 }}>
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

            <Grid size={{ xs:12, sm:6 }}>
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

            <Grid size={{ xs:12, sm:6 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <EventSeatIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Assento</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900}}>
                    {ticket.seatNumber ? `Fileira ${ticket.seatNumber[0]}, Cadeira ${ticket.seatNumber.substring(1)}` : 'Não demarcado'}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {!isCancelled && (
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button 
              variant="outlined" 
              color="primary" 
              size="small"
              startIcon={<ShareIcon />}
              onClick={() => onShare(ticket.secureHash)}
            >
              Compartilhar
            </Button>
            {!isUsed && (
              <Button 
                variant="outlined" 
                color="error" 
                size="small"
                startIcon={<CancelIcon />}
                onClick={() => onCancel(ticket)}
              >
                Cancelar Compra
              </Button>
            )}
          </Stack>
        )}
      </Box>

      <Box 
        sx={{ 
          width: { xs: '100%', md: '1px' }, 
          borderLeft: { md: '2px dashed #3f3f46' }, 
          borderTop: { xs: '2px dashed #3f3f46', md: 'none' },
          position: 'relative',
          my: { xs: 0, md: 2 }
        }} 
      />

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
};