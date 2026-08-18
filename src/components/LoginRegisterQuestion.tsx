import { Box, Typography, Link } from '@mui/material';

export default function LoginRegisterQuestion({ question, response, href }: { question: string, response: string, href: string }) {
  return (
    <Box sx={{ textAlign: 'center', mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {question}?{' '}
        <Link href={href}sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          {response}
        </Link>
      </Typography>
    </Box>
  )
}