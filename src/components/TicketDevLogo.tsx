import { Box, Typography } from '@mui/material';

export default function TicketDevLogo() {
  return (
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1 }}>
        Ticket<span style={{ color: '#7c3aed' }}>Dev</span>
      </Typography>
    </Box>
  )
}