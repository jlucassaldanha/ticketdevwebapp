import { Event } from '@/types/event';
import {  
  Typography, 
  Box,  
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Stack, 
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Link from 'next/link';

export default function MovieCard({ event }: { event: Event }) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="220"
        image={event.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba'}
        alt={event.title}
        
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Chip 
            label={event.category} 
            size="small" 
            color="primary" 
            variant="outlined" 
            sx={{ mb: 2, fontWeight: 600, fontSize: '0.7rem' }} 
          />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, lineHeight: 1.3 }}>
            {event.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {event.description}
          </Typography>
        </Box>
        
        <Box>
          <Stack spacing={1} sx={{ mb: 3 }} color="text.secondary">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <CalendarMonthIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">{event.location}</Typography>
            </Stack>
          </Stack>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" color="secondary.main" sx={{ fontWeight: 800 }}>
              R$ {event.price.toFixed(2)}
            </Typography>
            <Button 
              component={Link} 
              href={`/eventos/${event.id}`} 
              variant="contained" 
              color="primary" 
              size="small"
            >
              Ingressos
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}