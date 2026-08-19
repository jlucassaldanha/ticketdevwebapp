import { apiFetch } from '@/lib/api';
import { Event } from '@/types/event';
import { TMDbMovie } from '@/types/tmdb';
import { useCallback, useEffect, useState } from 'react';

export default function useOrganizer() {
  const [tabValue, setTabValue] = useState(0);
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TMDbMovie[]>([]);
    const [searchingMovie, setSearchingMovie] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<TMDbMovie | null>(null);
  
    const [eventTitle, setEventTitle] = useState('');
    const [eventCategory, setEventCategory] = useState('Cinema');
    const [eventDate, setEventDate] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventPrice, setEventPrice] = useState('');
    const [eventCapacity, setEventCapacity] = useState('100'); 
    const [eventBannerUrl, setEventBannerUrl] = useState('');
    const [eventSynopsis, setEventSynopsis] = useState('');
    const [submittingEvent, setSubmittingEvent] = useState(false);
  
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
    const [deletingEvent, setDeletingEvent] = useState(false);
  
    const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
     const loadOrganizerEvents = useCallback(async () => {
      setLoadingEvents(true);
      setErrorMsg(null);
      try {
        const data = await apiFetch<Event[]>('/api/events/my-events');
        setEvents(data);
      } catch (err: unknown) {
        console.error('Erro ao carregar eventos do organizador:', err);
        setErrorMsg('Não foi possível carregar os eventos. Verifique se o seu back-end está ativo.');
      } finally {
        setLoadingEvents(false);
      }
    }, []);
  
    useEffect(() => {
      let isMounted = true;
      Promise.resolve().then(() => {
        if (isMounted) {
          loadOrganizerEvents();
        }
      });
      return () => { isMounted = false; };
    }, [loadOrganizerEvents]);
  
    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
      setTabValue(newValue);
      setErrorMsg(null);
    };
  
    const handleSearchMovie = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
  
      setSearchingMovie(true);
      setSelectedMovie(null);
      try {
        const response = await apiFetch<TMDbMovie[]>(`/api/catalog/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response || []);
        if ((response || []).length === 0) {
          alert('Nenhum filme encontrado com esse nome.');
        }
      } catch (err) {
        console.error('Erro na integração TMDb:', err);
        alert('Falha ao buscar filmes no catálogo TMDb.');
      } finally {
        setSearchingMovie(false);
      }
    };
  
    const handleSelectMovie = (movie: TMDbMovie) => {
      setSelectedMovie(movie);
      setEventTitle(movie.title);
      setEventSynopsis(movie.overview);
      setEventCategory('Cinema');
  
      const bannerPath = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=500';
      setEventBannerUrl(bannerPath);
      
      setSearchResults([]);
      setSearchQuery('');
    };
  
    const handleCreateEvent = async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      if (!selectedMovie) {
        alert('Por favor, busque e selecione um filme do catálogo TMDb à esquerda antes de publicar!');
        return;
      }
  
      if (!eventDate || !eventLocation.trim() || !eventPrice || !eventCapacity) {
        alert('Por favor, preencha todos os campos obrigatórios da sessão (data, local e preço).');
        return;
      }
  
      setSubmittingEvent(true);
      try {
        const payload = {
          externalId: String(selectedMovie.id),
          date: new Date(eventDate).toISOString(),
          location: eventLocation.trim(),
          capacity: parseInt(eventCapacity, 10),
          price: parseFloat(eventPrice)
        };
  
        const isEditMode = !!editingEventId;
        const endpointUrl = isEditMode ? `/api/events/${editingEventId}` : '/api/events';
        const requestMethod = isEditMode ? 'PUT' : 'POST';
  
        await apiFetch(endpointUrl, {
          method: requestMethod,
          body: JSON.stringify(payload)
        });
  
        alert(isEditMode ? 'Sessão atualizada com sucesso!' : 'Evento de cinema criado com sucesso!');
        
        resetForm();
        setTabValue(0);
        await loadOrganizerEvents();
      } catch (err: unknown) {
        console.error('Erro ao criar evento:', err);
        const apiError = err as { message?: string };
        alert(apiError.message || 'Falha ao salvar evento no banco SQLite. Verifique os campos e o status do servidor.');
      } finally {
        setSubmittingEvent(false);
      }
    };
  
    const resetForm = () => {
      setEventTitle('');
      setEventCategory('Cinema');
      setEventDate('');
      setEventLocation('');
      setEventPrice('');
      setEventCapacity('100');
      setEventBannerUrl('');
      setEventSynopsis('');
      setSelectedMovie(null);
      setEditingEventId(null);
    };
  
    const handleStartEdit = (event: Event) => {
      setEditingEventId(event.id);
  
      setEventTitle(event.title);
      setEventCategory(event.category);
      setEventLocation(event.location);
      setEventPrice(String(event.price));
      setEventCapacity(String(event.capacity));
      setEventBannerUrl(event.imageUrl || '');
      setEventSynopsis(event.description || '');
  
      if (event.date) {
        try {
          const d = new Date(event.date);
          const tzOffset = d.getTimezoneOffset() * 60000;
          const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
          setEventDate(localISOTime);
        } catch (err) {
          setEventDate('');
        }
      }
  
      setSelectedMovie({
        id: Number(event.id) || 999999,
        title: event.title,
        overview: event.description || '',
        poster_path: event.imageUrl ? event.imageUrl.replace('https://image.tmdb.org/t/p/w500', '') : null
      });
  
      setTabValue(1);
    };
  
    const handleOpenDeleteDialog = (event: Event) => {
      setEventToDelete(event);
      setDeleteDialogOpen(true);
    };
  
    const handleCloseDeleteDialog = () => {
      setEventToDelete(null);
      setDeleteDialogOpen(false);
    };
  
    const handleConfirmDelete = async () => {
      if (!eventToDelete) return;
      setDeletingEvent(true);
      try {
        await apiFetch(`/api/events/${eventToDelete.id}`, {
          method: 'DELETE'
        });
        alert('Evento cancelado e excluído com sucesso do banco de dados!');
        await loadOrganizerEvents();
        handleCloseDeleteDialog();
      } catch (err: unknown) {
        console.error('Erro ao excluir evento:', err);
        const apiError = err as { message?: string };
        alert(apiError.message || 'Não é possível excluir eventos que já possuem ingressos vendidos.');
      } finally {
        setDeletingEvent(false);
      }
    };

    return {
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
    }
}