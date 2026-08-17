'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import { UserRole } from '@/types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<UserRole>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'VALIDATOR') router.push('/gate');
        else if (user.role === 'ORGANIZER') router.push('/organizador');
        else router.push('/');
      }
    }
  }, [user, loading, router, allowedRoles]);

  if (loading || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
}