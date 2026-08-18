'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Skeleton, 
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MovieCard from '@/components/MovieCard';
import useHome from '@/hooks/useHome';

export default function CatalogPage() {
  const {
    search,
    categories,
    selectedCategory,
    loading,
    filteredEvents,
    handleCategoryChange,
    handleSearchChange
  } = useHome();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        
        <Header />

        <Hero />

        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 1, mb: 6, border: '1px solid #1f2937' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                placeholder="Buscar por filme ou descrição..."
                variant="outlined"
                fullWidth
                size="small"
                value={search}
                onChange={handleSearchChange}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="category-label">Filtrar por Categoria</InputLabel>
                <Select
                  labelId="category-label"
                  value={selectedCategory}
                  label="Filtrar por Categoria"
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Filmes em Cartaz
        </Typography>
        
        <Grid container spacing={3}>
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
                    <Skeleton width="80%" height={32} sx={{ mb: 2 }} />
                    <Skeleton width="60%" height={20} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
                <MovieCard event={event} />
              </Grid>
            ))
          ) : (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Nenhum filme encontrado para a busca ou filtro selecionado.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
}