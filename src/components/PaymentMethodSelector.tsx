'use client';

import React from 'react';
import { 
  Paper, FormControl, FormLabel, RadioGroup, Grid, Card, CardContent, 
  FormControlLabel, Radio, Box, Typography 
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PixIcon from '@mui/icons-material/Pix';
import { PaymentMethod } from '../hooks/useCheckout';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ value, onChange }: PaymentMethodSelectorProps) => {
  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <FormLabel component="legend" sx={{ fontSize: '1.1rem', fontWeight: 700, color: 'text.primary', mb: 3 }}>
          Escolha a forma de pagamento:
        </FormLabel>
        
        <RadioGroup value={value} onChange={(e) => onChange(e.target.value as PaymentMethod)}>
          <Grid container spacing={2}>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card 
                variant="outlined" 
                onClick={() => onChange('CREDIT_CARD')}
                sx={{ 
                  cursor: 'pointer',
                  borderColor: value === 'CREDIT_CARD' ? 'primary.main' : '#3f3f46',
                  bgcolor: value === 'CREDIT_CARD' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                  <FormControlLabel 
                    value="CREDIT_CARD" 
                    control={<Radio color="primary" />} 
                    label="" 
                    sx={{ m: 0 }}
                  />
                  <CreditCardIcon sx={{ color: value === 'CREDIT_CARD' ? 'primary.main' : 'text.secondary' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Cartão de Crédito</Typography>
                    <Typography variant="caption" color="text.secondary">Aprovação instantânea</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card 
                variant="outlined" 
                onClick={() => onChange('DEBIT_CARD')}
                sx={{ 
                  cursor: 'pointer',
                  borderColor: value === 'DEBIT_CARD' ? 'primary.main' : '#3f3f46',
                  bgcolor: value === 'DEBIT_CARD' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                  <FormControlLabel 
                    value="DEBIT_CARD" 
                    control={<Radio color="primary" />} 
                    label="" 
                    sx={{ m: 0 }}
                  />
                  <CreditCardIcon sx={{ color: value === 'DEBIT_CARD' ? 'primary.main' : 'text.secondary' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Cartão de Débito</Typography>
                    <Typography variant="caption" color="text.secondary">Aprovação instantânea</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card 
                variant="outlined" 
                onClick={() => onChange('PIX')}
                sx={{ 
                  cursor: 'pointer',
                  borderColor: value === 'PIX' ? 'primary.main' : '#3f3f46',
                  bgcolor: value === 'PIX' ? 'rgba(124, 58, 237, 0.05)' : 'transparent',
                  transition: '0.2s',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '16px !important' }}>
                  <FormControlLabel 
                    value="PIX" 
                    control={<Radio color="primary" />} 
                    label="" 
                    sx={{ m: 0 }}
                  />
                  <PixIcon sx={{ color: value === 'PIX' ? 'primary.main' : 'text.secondary' }} />
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 700 }}>Pix</Typography>
                    <Typography variant="caption" color="text.secondary">Código copia e cola gerado</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </RadioGroup>
      </FormControl>
    </Paper>
  );
};