'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import SeatSelectionCard from '@/components/SeatSelectionCard';
import Header from '@/components/Header';
import SelectedSeatInfoCard from '@/components/SelectedSeatInfoCard';
import useSeatSelection from '@/hooks/useSeatSelection';

export default function SeatSelectionPage() {
  const {
    loading,
    rows, 
    event,
    seatsPerRow,
    occupiedSeats,
    selectedSeat,
    handleSeatClick,
    handleProceedToCheckout
  } = useSeatSelection()

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
        
        <Header />

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
            <SeatSelectionCard 
              rows={rows} 
              seatsPerRow={seatsPerRow} 
              occupiedSeats={occupiedSeats} 
              selectedSeat={selectedSeat} 
              event={event} 
              handleSeatClick={handleSeatClick}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <SelectedSeatInfoCard 
              event={event}
              selectedSeat={selectedSeat}
              handleProceedToCheckout={handleProceedToCheckout}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}