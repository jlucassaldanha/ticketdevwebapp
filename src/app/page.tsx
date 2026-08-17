'use client';

import { useState, useEffect } from 'react';
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
  InputLabel,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { apiFetch } from '@/lib/api';
import { Event } from '@/types/event';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MovieCard from '@/components/MovieCard';

export default function CatalogPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiFetch<Event[]>('/api/events');
        setEvents(data);
      } catch (err) {
        console.error('Falha ao carregar eventos da API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'TODAS' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['TODAS', ...Array.from(new Set(events.map((e) => e.category)))];

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        
        <Header />

        <Hero />

        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 3, mb: 6, border: '1px solid #1f2937' }}>
          <Grid container spacing={2} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                placeholder="Buscar por filme ou descrição..."
                variant="outlined"
                fullWidth
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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