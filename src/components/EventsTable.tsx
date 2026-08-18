import {
  Typography,
  Box,
  Paper,
  Stack,
  Button,
  CardMedia,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Event } from '@/types/event';

export default function EventsTable({ events, loadingEvents, setTabValue, handleStartEdit, handleOpenDeleteDialog }: {events: Event[], loadingEvents: boolean, setTabValue: React.Dispatch<React.SetStateAction<number>>, handleStartEdit: (event: Event) => void, handleOpenDeleteDialog: (event: Event) => void}) {
  return (
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
        <TableContainer component={Paper} sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid #27272a' }}>
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
  )
}