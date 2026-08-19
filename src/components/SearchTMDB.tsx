import { Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function SearchTMDB({
  handleSearchMovie,
  searchQuery,
  setSearchQuery,
  searchingMovie,
}: {
  handleSearchMovie: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>,
  searchQuery: string,
  setSearchQuery: (value: React.SetStateAction<string>) => void,
  searchingMovie: boolean,

}) {
  return (
    <>
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
    </>
  )
}