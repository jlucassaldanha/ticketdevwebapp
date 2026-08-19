'use client';

import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  Grid,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import Header from '@/components/Header';
import useOrganizer from '@/hooks/useOrganizer';
import EventsTable from '@/components/EventsTable';
import SearchTMDB from '@/components/SearchTMDB';
import TMDBSearchCard from '@/components/TMDBSearchCard';
import TMDBSelectedMovie from '@/components/TMDBSelectedMovie';
import CreateEventCard from '@/components/CreateEventCard';

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

          
          <Paper sx={{ mb: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
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

          {tabValue === 0 && (
            <EventsTable 
              events={events}
              loadingEvents={loadingEvents}
              setTabValue={setTabValue}
              handleStartEdit={handleStartEdit}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
            />
          )}

          {tabValue === 1 && (
            <Grid container spacing={4}>
              
              <Grid size={{ xs: 12, md: 5 }}>
                <SearchTMDB 
                  handleSearchMovie={handleSearchMovie}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchingMovie={searchingMovie}
                />

                {searchResults.length > 0 && (
                  <Stack spacing={2} sx={{ overflowY: 'auto', pr: 1 }}>
                    {searchResults.map((movie) => {
                      const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
                      const posterUrl = movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                        : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200';

                      return (
                        <TMDBSearchCard 
                          key={movie.id} 
                          movie={movie}
                          posterUrl={posterUrl} 
                          selectedMovie={selectedMovie} 
                          releaseYear={releaseYear} 
                          handleSelectMovie={handleSelectMovie}
                        />
                      );
                    })}
                  </Stack>
                )}

                {selectedMovie && (
                  <TMDBSelectedMovie 
                    eventBannerUrl={eventBannerUrl}
                    eventCategory={eventCategory}
                    eventSynopsis={eventSynopsis}
                    eventTitle={eventTitle}
                  />
                )}
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <CreateEventCard 
                  handleCreateEvent={handleCreateEvent}
                  eventTitle={eventTitle}
                  setEventTitle={setEventTitle}
                  eventCategory={eventCategory}
                  setEventCategory={setEventCategory}
                  eventDate={eventDate}
                  setEventDate={setEventDate}
                  eventLocation={eventLocation}
                  setEventLocation={setEventLocation}
                  eventPrice={eventPrice}
                  setEventPrice={setEventPrice}
                  eventCapacity={eventCapacity}
                  setEventCapacity={setEventCapacity}
                  eventBannerUrl={eventBannerUrl}
                  setEventBannerUrl={setEventBannerUrl}
                  eventSynopsis={eventSynopsis}
                  setEventSynopsis={setEventSynopsis}
                  resetForm={resetForm}
                  submittingEvent={submittingEvent}
                  editingEventId={editingEventId}
                />
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
