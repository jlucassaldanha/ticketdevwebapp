'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';

export const ShareLoading = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
      <CircularProgress color="primary" />
    </Box>
  );
};