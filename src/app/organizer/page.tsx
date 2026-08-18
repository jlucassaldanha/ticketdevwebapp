'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Grid,
  TextField,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MovieIcon from '@mui/icons-material/Movie';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import Header from '@/components/Header';
import useOrganizer from '@/hooks/useOrganizer';

export default function OrganizerPanelPage() {
  const {
      tabValue,
      handleTabChange,
      setTabValue,
      errorMsg,
      events,
      loadingEvents,
      handleStartEdit,
      handleOpenDeleteDialog,
      handleSearchMovie,
      searchQuery,
      setSearchQuery,
      searchingMovie,
      searchResults,
      handleSelectMovie,
      selectedMovie,
      eventBannerUrl,
      eventTitle,
      eventCategory,
      eventSynopsis,
      handleCreateEvent,
      setEventTitle,
      setEventCategory,
      eventDate,
      setEventDate,
      eventLocation,
      setEventLocation,
      eventPrice,
      setEventPrice,
      eventCapacity,
      setEventCapacity,
      setEventBannerUrl,
      setEventSynopsis,
      resetForm,
      submittingEvent,
      editingEventId,
      deleteDialogOpen,
      handleCloseDeleteDialog,
      eventToDelete,
      deletingEvent,
      handleConfirmDelete
    } = useOrganizer()

  return (
    <ProtectedRoute allowedRoles={['ORGANIZER']}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary' }}>
        <Container maxWidth="lg">
          
          <Header />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Button 
              component={Link} 
              href="/" 
              startIcon={<ArrowBackIcon />} 
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Voltar ao Catálogo
            </Button>
            <Typography variant="subtitle1" color="secondary" sx={{ fontWeight: 800 }}>
              Painel do Organizador
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Gerenciar <span style={{ background: 'linear-gradient(45deg, #7c3aed, #f43f5e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sessões</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Crie novos eventos integrando pôsteres oficiais do TMDb ou acompanhe o status de vendas e lotação dos seus filmes em cartaz.
          </Typography>

          
          <Paper sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              textColor="primary"
              indicatorColor="primary"
              variant="fullWidth"
            >
              <Tab label="Minhas Sessões Ativas" sx={{ fontWeight: 700, py: 2 }} />
              <Tab label="Criar Novo Evento de Cinema" sx={{ fontWeight: 700, py: 2 }} />
            </Tabs>
          </Paper>

          {errorMsg && <Alert severity="error" sx={{ mb: 4 }}>{errorMsg}</Alert>}

          {/* ----------------- ABA 0: LISTAGEM E STATUS DE VENDAS ----------------- */}
          {tabValue === 0 && (
            <>
              {loadingEvents ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress color="primary" />
                </Box>
              ) : events.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', border: '1px dashed #3f3f46', bgcolor: 'transparent' }}>
                  <MovieIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Nenhum evento registrado</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Você ainda não cadastrou nenhum filme para exibição. Comece agora na aba de criação!
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => setTabValue(1)}>
                    Criar Primeira Sessão
                  </Button>
                </Paper>
              ) : (
                <TableContainer component={Paper} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid #27272a' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Filme</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Data / Horário</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Local</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Preço</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: 'text.secondary' }}>Lotação / Vendas</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 800, color: 'text.secondary' }}>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {events.map((event) => {
                        const ticketsSold = event.ticketsSold || 0;
                        const pctFull = Math.min(100, Math.round((ticketsSold / event.capacity) * 100));
                        const isSoldOut = pctFull >= 100;

                        return (
                          <TableRow key={event.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                                <CardMedia
                                  component="img"
                                  image={event.imageUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200'}
                                  alt={event.title}
                                  sx={{ width: 45, height: 60, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #3f3f46' }}
                                />
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 800, color: 'white' }}>
                                    {event.title}
                                  </Typography>
                                  <Chip label={event.category} size="small" variant="outlined" sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }} />
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>{event.location}</TableCell>
                            <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>
                              {event.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ width: '100%', minWidth: 120 }}>
                                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                  {ticketsSold} / {event.capacity} ingressos
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ width: '100%', mr: 1, height: 6, bgcolor: '#27272a', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                                    <Box sx={{ width: `${pctFull}%`, height: '100%', bgcolor: isSoldOut ? 'error.main' : 'primary.main', borderRadius: 3 }} />
                                  </Box>
                                  <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                    {pctFull}%
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                                 <IconButton 
                                  color="primary" 
                                  size="small" 
                                  onClick={() => handleStartEdit(event)}
                                  disabled={ticketsSold > 0} // Veda edição se houver ingressos já emitidos
                                  title={ticketsSold > 0 ? "Impossível editar sessões com vendas ativas" : "Editar Sessão"}
                                >
                                  <EditIcon fontSize='small' />
                                </IconButton>
                                <IconButton 
                                  color="error" 
                                  size="small" 
                                  onClick={() => handleOpenDeleteDialog(event)}
                                  disabled={ticketsSold > 0} // Edital veda exclusão de eventos com vendas ativas
                                  title={ticketsSold > 0 ? "Impossível excluir sessões com ingressos ativos" : "Excluir Sessão"}
                                >
                                  <DeleteIcon fontSize='small' />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}

          {tabValue === 1 && (
            <Grid container spacing={4}>
              
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                  1. Buscar no Catálogo TMDb
                </Typography>
                <Paper component="form" onSubmit={handleSearchMovie} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', border: '1px solid #3f3f46', bgcolor: 'background.paper' }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="ex: Batman, Matrix, Avengers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    variant="outlined"
                    sx={{ mr: 1 }}
                    slotProps={{ 
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MovieIcon sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    disabled={searchingMovie || !searchQuery.trim()}
                    sx={{ px: 3 }}
                  >
                    {searchingMovie ? <CircularProgress size={20} /> : <SearchIcon />}
                  </Button>
                </Paper>

                {searchResults.length > 0 && (
                  <Stack spacing={2} sx={{ overflowY: 'auto', pr: 1 }}>
                    {searchResults.map((movie) => {
                      const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
                      const posterUrl = movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                        : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200';

                      return (
                        <Card 
                          key={movie.id} 
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
                      );
                    })}
                  </Stack>
                )}

                {selectedMovie && (
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
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Paper component="form" onSubmit={handleCreateEvent} sx={{ p: 4, borderRadius: 4, border: '1px solid #27272a' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                    2. Dados da Sessão no Cinema
                  </Typography>

                  <Stack spacing={3}>
                    <TextField
                      label="Título da Sessão (Filme)"
                      variant="outlined"
                      fullWidth
                      required
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      placeholder="Escolha no catálogo TMDb ou digite o nome"
                    />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Categoria / Gênero"
                          variant="outlined"
                          fullWidth
                          required
                          value={eventCategory}
                          onChange={(e) => setEventCategory(e.target.value)}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Data e Hora da Exibição"
                          type="datetime-local"
                          variant="outlined"
                          fullWidth
                          required
                          slotProps={{inputLabel: { shrink: true }}}
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label="Localização / Sala do Cinema"
                      variant="outlined"
                      fullWidth
                      required
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="Ex: Sala IMAX 3D - Shopping Principal"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Preço do Ingresso"
                          type="number"
                          variant="outlined"
                          fullWidth
                          required
                          placeholder="0.00"
                          value={eventPrice}
                          onChange={(e) => setEventPrice(e.target.value)}
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoneyIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          label="Capacidade Total"
                          type="number"
                          variant="outlined"
                          fullWidth
                          required
                          disabled 
                          value={eventCapacity}
                          onChange={(e) => setEventCapacity(e.target.value)}
                          helperText="A capacidade padrão para assentos dinâmicos é 100."
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PeopleIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                              ),
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <TextField
                      label="URL da Imagem de Banner"
                      variant="outlined"
                      fullWidth
                      value={eventBannerUrl}
                      onChange={(e) => setEventBannerUrl(e.target.value)}
                      placeholder="https://exemplo.com/poster.jpg"
                    />

                    <TextField
                      label="Sinopse do Filme"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      value={eventSynopsis}
                      onChange={(e) => setEventSynopsis(e.target.value)}
                      placeholder="Descrição detalhada sobre a exibição ou enredo..."
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                      <Button variant="outlined" color="inherit" onClick={resetForm} disabled={submittingEvent}>
                        Limpar Campos
                      </Button>
                      <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        disabled={submittingEvent}
                        startIcon={submittingEvent ? <CircularProgress size={20} /> : (editingEventId ? <EditIcon /> : <AddIcon />)}
                      >
                        {submittingEvent ? 'Registrando...' : (editingEventId ? 'Salvar Alterações' : 'Publicar Evento')}
                      </Button>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

            </Grid>
          )}

        </Container>

        <Dialog
          open={deleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            {"Cancelar e Excluir esta Sessão?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Deseja realmente remover o evento <strong>{eventToDelete?.title}</strong>? Esta ação é irreversível e o filme deixará de aparecer no catálogo do cinema. (Somente eventos sem nenhum ingresso vendido podem ser excluídos).
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseDeleteDialog} color="inherit" disabled={deletingEvent}>
              Voltar
            </Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error" 
              variant="contained"
              autoFocus
              disabled={deletingEvent}
            >
              {deletingEvent ? 'Excluindo...' : 'Sim, Excluir do Banco'}
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </ProtectedRoute>
  );
}
