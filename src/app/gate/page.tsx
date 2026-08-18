'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  SelectChangeEvent,
  Alert
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import { apiFetch } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { Event } from '@/types/event';
import { ValidationResult } from '@/types/gate';
import { ValidateTicketResponse } from '@/types/ticket';

export default function PortariaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [hashInput, setHashInput] = useState('');
  const [validating, setValidating] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);

  const [validationResult, setValidationResult] = useState<ValidationResult>({ status: 'NONE', message: '' });

  const scannerRef = useRef<unknown>(null);
  const validateFnRef = useRef<(hash: string) => Promise<void>>(async () => {});

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiFetch<Event[]>('/api/events');
        setEvents(data);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const handleEventChange = (event: SelectChangeEvent) => {
    setSelectedEventId(event.target.value);
    setValidationResult({ status: 'NONE', message: '' });
    setIsCameraActive(false); 
  };

  const handleValidateTicket = useCallback(async (hashToValidate: string) => {
    if (!selectedEventId || !hashToValidate.trim()) return;

    setValidating(true);
    try {
      const payload = {
        secureHash: hashToValidate.trim(),
        currentEventId: selectedEventId
      };

      const data = await apiFetch<ValidateTicketResponse>('/api/gate/validate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      setValidationResult({
        status: 'VALID',
        message: 'Entrada autorizada! Aproveite a sessão.',
        ticketDetails: {
          movieTitle: data.ticket?.event?.title || 'Filme selecionado',
          seatNumber: data.ticket?.seatNumber || 'Pista',
          clientName: data.ticket?.client?.name || 'Cliente'
        }
      });
    } catch (err: unknown) {
      const apiError = err as { status?: number; data?: ValidateTicketResponse; message?: string };

      if (apiError.status === 409) {
        const errorData = apiError.data;
        setValidationResult({
          status: 'ALREADY_USED',
          message: 'ATENÇÃO: Este ingresso já foi validado na portaria!',
          ticketDetails: {
            movieTitle: errorData?.ticket?.event?.title || 'Filme selecionado',
            seatNumber: errorData?.ticket?.seatNumber || 'Pista',
            clientName: errorData?.ticket?.client?.name || 'Cliente'
          }
        });
      } else if (apiError.status === 400) {
        const errorData = apiError.data;
        setValidationResult({
          status: 'WRONG_EVENT',
          message: 'EVENTO INCORRETO! Este ingresso pertence ao filme:',
          ticketDetails: {
            movieTitle: errorData?.correctEventTitle || 'Outro filme',
            seatNumber: errorData?.ticket?.seatNumber || 'Pista',
            clientName: errorData?.ticket?.client?.name || 'Cliente'
          }
        });
      } else {
        setValidationResult({
          status: 'INVALID',
          message: apiError.message || 'ALERTA DE SEGURANÇA: Ingresso inválido ou assinatura corrompida!'
        });
      }
    } finally {
      setValidating(false);
      setHashInput('');
    }
  }, [selectedEventId]);

  useEffect(() => {
    validateFnRef.current = handleValidateTicket;
  }, [handleValidateTicket]);

  useEffect(() => {
    let isMounted = true;

    async function startScanner() {
      if (!isCameraActive || !selectedEventId) return;

      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        
        const html5Qrcode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: 'environment' }, 
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText: string) => {
            validateFnRef.current(decodedText);
            stopScanner(); 
          },
          () => { }
        );
      } catch (err) {
        console.error('Erro ao iniciar o leitor de QR Code:', err);
        alert('Não foi possível acessar a câmera. Verifique as permissões no navegador.');
        setIsCameraActive(false);
      }
    }

    const stopScanner = async () => {
      const activeScanner = scannerRef.current as { isScanning?: boolean; stop?: () => Promise<void> } | null;
      if (activeScanner) {
        try {
          if (activeScanner.isScanning && activeScanner.stop) {
            await activeScanner.stop();
          }
        } catch (err) {
          console.error('Erro ao parar a câmera:', err);
        } finally {
          scannerRef.current = null;
          if (isMounted) {
            setIsCameraActive(false);
          }
        }
      }
    };

    if (isCameraActive) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      isMounted = false;
      const activeScanner = scannerRef.current as { isScanning?: boolean; stop?: () => Promise<void> } | null;
      if (activeScanner && activeScanner.isScanning && activeScanner.stop) {
        activeScanner.stop().catch(console.error);
      }
    };
  }, [isCameraActive, selectedEventId]);

  const handleDismissResult = () => {
    setValidationResult({ status: 'NONE', message: '' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const getFeedbackStyles = () => {
    switch (validationResult.status) {
      case 'VALID':
        return {
          bgColor: '#10b981',
          icon: <CheckCircleIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'VALIDADO'
        };
      case 'ALREADY_USED':
        return {
          bgColor: '#f59e0b',
          icon: <WarningIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'JÁ UTILIZADO'
        };
      case 'WRONG_EVENT':
        return {
          bgColor: '#3b82f6',
          icon: <InfoIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'EVENTO ERRADO'
        };
      case 'INVALID':
        return {
          bgColor: '#ef4444',
          icon: <ErrorIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'INVALIDO'
        };
      default:
        return { bgColor: 'transparent', icon: null, title: '' };
    }
  };

  const feedback = getFeedbackStyles();

  return (
    <ProtectedRoute allowedRoles={['VALIDATOR', 'ORGANIZER']}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary', position: 'relative' }}>
        
        {validationResult.status !== 'NONE' && (
          <Box 
            sx={{ 
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: feedback.bgColor,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              color: 'white',
              textAlign: 'center',
              animation: 'fadeIn 0.2s ease'
            }}
          >
            {feedback.icon}
            
            <Typography variant="h2" sx={{ fontWeight: 900, mt: 3, letterSpacing: '-2px' }}>
              {feedback.title}
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mt: 2, mb: 4, maxWidth: '600px' }}>
              {validationResult.message}
            </Typography>

            {validationResult.ticketDetails && (
              <Paper 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(255, 255, 255, 0.12)', 
                  borderRadius: 3, 
                  mb: 5, 
                  maxWidth: '500px', 
                  width: '100%',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'white' }}>
                  {validationResult.ticketDetails.movieTitle}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                  Portador: <strong>{validationResult.ticketDetails.clientName}</strong>
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 900, color: '#fcd34d' }}>
                  Assento: {validationResult.ticketDetails.seatNumber}
                </Typography>
              </Paper>
            )}

            <Button 
              variant="contained" 
              color="inherit" 
              size="large"
              onClick={handleDismissResult}
              sx={{ 
                color: feedback.bgColor, 
                bgcolor: 'white', 
                fontWeight: 800,
                px: 5,
                py: 1.5,
                borderRadius: 3,
                fontSize: '1.1rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.9)' }
              }}
            >
              PRÓXIMO INGRESSO
            </Button>
          </Box>
        )}

        <Container maxWidth="md">
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Button 
              component={Link} 
              href="/" 
              startIcon={<ArrowBackIcon />} 
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              Voltar ao Catálogo
            </Button>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800 }}>
              Operador da Portaria
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Portaria <span style={{ color: '#7c3aed' }}>Digital</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Selecione o evento e leia o QRCode.
          </Typography>

          <Paper sx={{ p: 4, mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="gate-event-label">Selecione o Evento</InputLabel>
              <Select
                labelId="gate-event-label"
                value={selectedEventId}
                label="Selecione o Evento"
                onChange={handleEventChange}
              >
                {events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.title} — {ev.location} ({new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {!selectedEventId && (
            <Alert severity="info" sx={{ my: 4, bgcolor: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', '& .MuiAlert-message': { color: 'white' } }}>
              Escolha uma sessão no seletor acima para liberar as ferramentas de validação e scanner da portaria.
            </Alert>
          )}

          <Grid container spacing={3}>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'rgba(255, 255, 255, 0.01)',
                  border: '2px dashed',
                  borderColor: selectedEventId ? 'primary.main' : '#27272a',
                  opacity: selectedEventId ? 1 : 0.4
                }}
              >
                {isCameraActive ? (
                  <Box 
                    id="qr-reader" 
                    sx={{ 
                      width: '100%', 
                      maxWidth: '320px', 
                      borderRadius: 3, 
                      overflow: 'hidden', 
                      mb: 2,
                      border: '1px solid #3f3f46',
                      '& video': { borderRadius: '12px' }
                    }} 
                  />
                ) : (
                  <QrCodeScannerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, animation: selectedEventId ? 'pulse 2s infinite' : 'none' }} />
                )}
                
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Scanner de Câmera
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  {isCameraActive 
                    ? 'Aponte a câmera traseira do seu celular para o QR Code do ingresso.' 
                    : 'No celular, clique no botão para ligar a câmera traseira e focar no QR Code impresso ou compartilhado.'}
                </Typography>
                
                <Button
                  variant={isCameraActive ? "outlined" : "contained"}
                  color={isCameraActive ? "error" : "primary"}
                  disabled={!selectedEventId}
                  startIcon={<CameraswitchIcon />}
                  fullWidth
                  onClick={() => setIsCameraActive(!isCameraActive)}
                >
                  {isCameraActive ? 'Desligar Câmera' : 'Ligar Câmera'}
                </Button>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper 
                sx={{ 
                  p: 4, 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  opacity: selectedEventId ? 1 : 0.4
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Contingência Manual
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Caso a câmera falhe ou o avaliador esteja testando na máquina local, digite ou cole o Hash do Ingresso (`secureHash`) abaixo:
                </Typography>

                <TextField
                  label="Hash do Ingresso"
                  variant="outlined"
                  fullWidth
                  disabled={!selectedEventId || validating}
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="ex: hmac_sha256_..."
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={!selectedEventId || !hashInput.trim() || validating}
                  onClick={() => handleValidateTicket(hashInput)}
                >
                  {validating ? <CircularProgress size={24} /> : 'Validar Entrada'}
                </Button>
              </Paper>
            </Grid>

          </Grid>

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
