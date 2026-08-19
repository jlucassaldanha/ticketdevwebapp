import { Box, Button, CircularProgress, Grid, InputAdornment, Paper, Stack, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';

export default function CreateEventCard({
  handleCreateEvent,
  eventTitle,
  setEventTitle,
  eventCategory,
  setEventCategory,
  eventDate,
  setEventDate,
  eventLocation,
  setEventLocation,
  eventPrice,
  setEventPrice,
  eventCapacity,
  setEventCapacity,
  eventBannerUrl,
  setEventBannerUrl,
  eventSynopsis,
  setEventSynopsis,
  resetForm,
  submittingEvent,
  editingEventId
}: {
  handleCreateEvent: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>,
  eventTitle: string,
  setEventTitle: (value: React.SetStateAction<string>) => void,
  eventCategory: string,
  setEventCategory: (value: React.SetStateAction<string>) => void,
  eventDate: string,
  setEventDate: (value: React.SetStateAction<string>) => void,
  eventLocation: string,
  setEventLocation: (value: React.SetStateAction<string>) => void,
  eventPrice: string,
  setEventPrice: (value: React.SetStateAction<string>) => void,
  eventCapacity: string,
  setEventCapacity: (value: React.SetStateAction<string>) => void,
  eventBannerUrl: string,
  setEventBannerUrl: (value: React.SetStateAction<string>) => void,
  eventSynopsis: string,
  setEventSynopsis: (value: React.SetStateAction<string>) => void,
  resetForm: () => void,
  submittingEvent: boolean,
  editingEventId: string | null
}) {
  return (
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
              value={eventCapacity}
              onChange={(e) => setEventCapacity(e.target.value)}
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
  )
}