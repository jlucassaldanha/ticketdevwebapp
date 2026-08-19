'use client';

import React from 'react';
import { Paper, Typography, Box, Divider, Stack } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import { Event } from '@/types/event';

interface OrderSummaryProps {
  event: Event;
  seat: string;
}

export const OrderSummary = ({ event, seat }: OrderSummaryProps) => {
  return (
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
  );
};