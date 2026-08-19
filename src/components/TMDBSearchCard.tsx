import { TMDbMovie } from "@/types/tmdb";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

export default function TMDBSearchCard({ movie, posterUrl, selectedMovie, releaseYear, handleSelectMovie }:
  { movie: TMDbMovie, posterUrl: string, selectedMovie: TMDbMovie | null, releaseYear: string, handleSelectMovie: (movie: TMDbMovie) => void}
) {
  return ( 
    <Card 
      onClick={() => handleSelectMovie(movie)}
      sx={{ 
        display: 'flex', 
        cursor: 'pointer', 
        border: selectedMovie?.id === movie.id ? '2px solid #7c3aed' : '1px solid #27272a',
        bgcolor: selectedMovie?.id === movie.id ? 'rgba(124, 58, 237, 0.05)' : 'background.paper',
        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,255,255,0.01)' }
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, height: 110, objectFit: 'cover' }}
        image={posterUrl}
        alt={movie.title}
      />
      <CardContent sx={{ p: 2, flex: 1 }}>
        <Typography variant="body1" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.2 }}>
          {movie.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
          Ano de Lançamento: {releaseYear}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.75rem', lineHeight: 1.3 }}>
          {movie.overview || 'Sinopse não cadastrada no catálogo da API.'}
        </Typography>
      </CardContent>
    </Card>
  )
}