'use client';

import React from 'react';
import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import PersonIcon from '@mui/icons-material/Person';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { SharedTicket } from '@/types/ticket'; // Ajuste o import conforme seu projeto

interface SharedTicketCardProps {
  ticket: SharedTicket;
}

export const SharedTicketCard = ({ ticket }: SharedTicketCardProps) => {
  const isCancelled = ticket.status === 'CANCELED';
  const isUsed = ticket.status === 'USED';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&bgcolor=ffffff&data=${ticket.secureHash}`;

  return (
    <Paper 
      elevation={12}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid #3f3f46',
        bgcolor: 'background.paper',
        position: 'relative'
      }}
    >
      <Box sx={{ p: 4 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
          <Chip 
            label={ticket.status} 
            size="small" 
            color={isCancelled ? 'error' : isUsed ? 'default' : 'success'} 
            sx={{ fontWeight: 800 }}
          />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 3, lineHeight: 1.2 }}>
          {ticket.event.title}
        </Typography>

        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <PersonIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Portador</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {ticket.client?.name || 'Cliente TicketDev'}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <CalendarMonthIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Sessão</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {new Date(ticket.event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <LocationOnIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Local</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>
                {ticket.event.location}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <EventSeatIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Assento Reservado</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {ticket.seatNumber ? `Fileira ${ticket.seatNumber[0]} - Cadeira ${ticket.seatNumber.substring(1)}` : 'Não demarcado'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ borderTop: '2px dashed #3f3f46', position: 'relative', my: 1 }} />

      <Box 
        sx={{ 
          p: 4, 
          bgcolor: 'rgba(255, 255, 255, 0.01)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          textAlign: 'center' 
        }}
      >
        {isCancelled ? (
          <Typography variant="h6" color="error" sx={{ fontWeight: 800 }}>
            ESTE INGRESSO FOI CANCELADO
          </Typography>
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
                justifyContent: 'center'
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={qrUrl} 
                alt="Voucher QR Code" 
                style={{ width: '160px', height: '160px', display: 'block' }} 
              />
            </Box>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <QrCode2Icon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: '1px' }}>
                ASSINATURA CADASTRADA NO BANCO
              </Typography>
            </Stack>
          </>
        )}
      </Box>
    </Paper>
  );
};