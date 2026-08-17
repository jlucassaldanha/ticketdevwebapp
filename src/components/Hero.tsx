import { 
  Typography, 
  Box, 
} from '@mui/material';

export default function Hero() {
  return (
    <Box sx={{ mb: 6, textAlign: 'center' }}>
      <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-1.5px' }}>
        Garanta seus ingressos <br />
        <span style={{ background: 'linear-gradient(45deg, #7c3aed, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          com segurança.
        </span>
      </Typography>
    </Box>
  )
}