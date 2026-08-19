import { Event } from "@/types/event";
import { Box, Button, Divider, Paper, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function SelectedSeatInfoCard({ event, selectedSeat, handleProceedToCheckout }: { event: Event, selectedSeat: string | null, handleProceedToCheckout: () => void }) {
  return (
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
  )
}