import { Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";

export default function TMDBSelectedMovie({ eventBannerUrl, eventTitle, eventCategory, eventSynopsis }: 
  { eventBannerUrl: string, eventTitle: string, eventCategory: string, eventSynopsis: string }) {
  return (
    <Card sx={{ border: '1px solid #7c3aed', bgcolor: 'rgba(124, 58, 237, 0.02)' }}>
      <CardMedia
        component="img"
        sx={{ height: 260, objectFit: 'cover' }}
        image={eventBannerUrl}
        alt={eventTitle}
      />
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: 'white' }}>{eventTitle}</Typography>
        <Chip label={eventCategory} color="primary" size="small" sx={{ mb: 2, fontWeight: 700 }} />
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {eventSynopsis || 'Este filme não possui sinopse cadastrada.'}
        </Typography>
      </CardContent>
    </Card>
  )
}