import { Event } from "@/types/event";
import { Avatar, Box, IconButton, Paper, Stack, Typography } from "@mui/material";

export default function SeatSelectionCard({ 
  rows, 
  seatsPerRow, 
  occupiedSeats, 
  selectedSeat, 
  event, 
  handleSeatClick
}: {
  rows: string[], 
  seatsPerRow: number, 
  occupiedSeats: string[], 
  selectedSeat: string | null, 
  event: Event, 
  handleSeatClick: (seatCode: string) => void
}) {
  return (
    <Paper sx={{ p: { xs: 2, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: 'background.paper', width: '100%' }}>
              
      <Box sx={{ width: '100%', mb: { xs: 4, md: 6 }, textAlign: 'center', position: 'relative' }}>
        <Box sx={{ height: '6px', width: '80%', bgcolor: 'primary.main', mx: 'auto', borderRadius: '50%'
          
         }} />
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1, letterSpacing: '2px', fontWeight: 700 }}>
          TELA DO CINEMA
        </Typography>
      </Box>

      
      <Box sx={{ width: '100%', overflowX: 'auto', pb: 2, mb: { xs: 3, md: 6 } }}>
        <Stack spacing={{ xs: 1, md: 2 }} sx={{ alignItems: 'center', minWidth: 'max-content', mx: 'auto', px: 1 }}>
          {rows.map((row) => (
            <Stack key={row} direction="row" spacing={{ xs: 0.5, sm: 1, md: 1.5 }} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" sx={{ width: 16, fontWeight: 700, color: 'text.secondary' }}>{row}</Typography>

              {Array.from({ length: seatsPerRow }).map((_, index) => {
                const seatNumber = index + 1;
                const seatCode = `${row}${seatNumber}`;
                const isOccupied = occupiedSeats.includes(seatCode);
                const isSelected = selectedSeat === seatCode;

                const rowIndex = rows.indexOf(row);
                const absoluteSeatIndex = (rowIndex * seatsPerRow) + index;
                const isSeatWithinCapacity = absoluteSeatIndex < event.capacity;

                const seatSize = { xs: 28, sm: 34, md: 38 };

                if (!isSeatWithinCapacity) {
                  return (
                    <Box 
                      key={`empty-${seatCode}`} 
                      sx={{ width: seatSize, height: seatSize, flexShrink: 0 }} 
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
                      flexShrink: 0, 
                      '&.Mui-disabled': { opacity: 1 }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: seatSize,
                        height: seatSize,
                        fontSize: { xs: '0.65rem', md: '0.8rem' },
                        fontWeight: 700,
                        
                        bgcolor: isOccupied 
                          ? 'rgba(255, 255, 255, 0)' 
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
      </Box>

      <Stack 
        direction="row" 
        sx={{ 
          justifyContent: 'center', 
          width: '100%', 
          mt: 2, 
          flexWrap: 'wrap',
          gap: { xs: 2, md: 3 }
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar 
            sx={{ width: 24, height: 24, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'rgba(255, 255, 255, 0.08)', color: 'text.secondary', border: '1px solid #3f3f46' }}
          >
            D
          </Avatar>
          <Typography variant="caption" color="text.secondary">Disponível</Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar 
            sx={{ width: 24, height: 24, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'primary.main', color: 'primary.contrastText', border: '2px solid #7c3aed' }}
          >
            S
          </Avatar>
          <Typography variant="caption" color="text.secondary">Selecionado</Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar 
            sx={{ width: 24, height: 24, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'rgba(255, 255, 255, 0.05)', color: 'text.disabled', border: '1px solid rgba(255, 255, 255, 0.02)' }}
          >
            O
          </Avatar>
          <Typography variant="caption" color="text.secondary">Ocupado</Typography>
        </Stack>

      </Stack>

    </Paper>
  )
}