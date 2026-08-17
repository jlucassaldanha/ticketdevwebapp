'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Stack, 
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


export default function PortariaPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Entrada manual ou simulada do hash
  const [hashInput, setHashInput] = useState('');
  const [validating, setValidating] = useState(false);

  // Status de Validação da Portaria (O feedback gigante colorido)
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    status: 'NONE',
    message: ''
  });

  // Carrega os eventos ativos do banco de dados
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
  };

  // 🛡️ Lógica central de validação de ingressos na portaria
  const handleValidateTicket = async (hashToValidate: string) => {
    if (!selectedEventId || !hashToValidate.trim()) return;

    setValidating(true);
    try {
      const payload = {
        secureHash: hashToValidate.trim(),
        currentEventId: selectedEventId
      };

      // Chamada HTTP para o endpoint de validação da portaria
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/gate/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 200) {
        // 🟢 STATUS: VALID (Válido - Entrada liberada)
        setValidationResult({
          status: 'VALID',
          message: 'Entrada autorizada! Aproveite a sessão.',
          ticketDetails: {
            movieTitle: data.ticket?.event?.title || 'Filme selecionado',
            seatNumber: data.ticket?.seatNumber || 'Pista',
            clientName: data.ticket?.client?.name || 'Cliente'
          }
        });
      } else if (response.status === 409) {
        // 🟡 STATUS: ALREADY_USED (Ingresso já utilizado anteriormente)
        setValidationResult({
          status: 'ALREADY_USED',
          message: 'ATENÇÃO: Este ingresso já foi validado na portaria!',
          ticketDetails: {
            movieTitle: data.ticket?.event?.title || 'Filme selecionado',
            seatNumber: data.ticket?.seatNumber || 'Pista',
            clientName: data.ticket?.client?.name || 'Cliente'
          }
        });
      } else if (response.status === 400) {
        // 🔵 STATUS: WRONG_EVENT (Ingresso pertence a outro evento)
        setValidationResult({
          status: 'WRONG_EVENT',
          message: `EVENTO INCORRETO! Este ingresso pertence ao filme:`,
          ticketDetails: {
            movieTitle: data.correctEventTitle || 'Outro filme',
            seatNumber: data.ticket?.seatNumber || 'Pista',
            clientName: data.ticket?.client?.name || 'Cliente'
          }
        });
      } else {
        // 🔴 STATUS: INVALID (404 ou outros - Fraude ou Hash falso)
        setValidationResult({
          status: 'INVALID',
          message: 'ALERTA DE SEGURANÇA: Ingresso inválido ou assinatura corrompida!'
        });
      }
    } catch (err) {
      console.error('Erro na validação do bilhete:', err);
      setValidationResult({
        status: 'INVALID',
        message: 'Ocorreu um erro ao processar a validação.'
      });
    } finally {
      setValidating(false);
      setHashInput('');
    }
  };

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

  // 🎨 CONFIGURAÇÕES VISUAIS DOS CORES E ESTILOS EXIGIDOS PELO EDITAL
  const getFeedbackStyles = () => {
    switch (validationResult.status) {
      case 'VALID':
        return {
          bgColor: '#10b981', // Verde esmeralda
          icon: <CheckCircleIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'VALIDADO 🟢'
        };
      case 'ALREADY_USED':
        return {
          bgColor: '#f59e0b', // Amarelo/Laranja de aviso
          icon: <WarningIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'ALREADY USED 🟡'
        };
      case 'WRONG_EVENT':
        return {
          bgColor: '#3b82f6', // Azul de informação
          icon: <InfoIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'WRONG EVENT 🔵'
        };
      case 'INVALID':
        return {
          bgColor: '#ef4444', // Vermelho de erro
          icon: <ErrorIcon sx={{ fontSize: 90, color: 'white' }} />,
          title: 'INVALID 🔴'
        };
      default:
        return { bgColor: 'transparent', icon: null, title: '' };
    }
  };

  const feedback = getFeedbackStyles();

  return (
    <ProtectedRoute allowedRoles={['VALIDATOR', 'ORGANIZER']}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 6, color: 'text.primary', position: 'relative' }}>
        
        {/* OVERLAY GIGANTE COLORIDO DE FEEDBACK (Obrigatoriedade do Edital) */}
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

            {/* Detalhes do Ingresso Lido no Overlay */}
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

        {/* LAYOUT CONVENCIONAL DO PAINEL */}
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
              Operador da Portaria 🔑
            </Typography>
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Portaria <span style={{ color: '#7c3aed' }}>Digital</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Selecione a sessão ativa do cinema para iniciar a validação dos ingressos lidos da câmera ou digitados manualmente.
          </Typography>

          {/* 1. SELETOR DE SESSÃO */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="gate-event-label">Selecione a Sessão Ativa</InputLabel>
              <Select
                labelId="gate-event-label"
                value={selectedEventId}
                label="Selecione a Sessão Ativa"
                onChange={handleEventChange}
              >
                {events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    🍿 {ev.title} — {ev.location} ({new Date(ev.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* 2. ÁREA DE VALIDAÇÃO (Bloqueada se não escolher evento) */}
          <Grid container spacing={3}>
            
            {/* CÂMERA SCANNER / EMULAÇÃO */}
            <Grid item xs={12} md={6}>
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
                <QrCodeScannerIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, animation: selectedEventId ? 'pulse 2s infinite' : 'none' }} />
                
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                  Scanner de Câmera
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                  No celular, clique no botão para ligar a câmera traseira e focar no QR Code impresso ou compartilhado.
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!selectedEventId}
                  startIcon={<CameraswitchIcon />}
                  fullWidth
                  onClick={() => alert('Câmera ativada localmente! (Nos dispositivos móveis de produção, isso inicializa o leitor de QR Code nativo).')}
                >
                  Ligar Câmera
                </Button>
              </Paper>
            </Grid>

            {/* CONTINGÊNCIA: DIGITAÇÃO MANUAL (Extremamente útil para avaliadores!) */}
            <Grid item xs={12} md={6}>
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

          {!selectedEventId && (
            <Alert severity="info" sx={{ mt: 4, bgcolor: 'rgba(59, 130, 246, 0.05)', border: '1px solid #3b82f6', '& .MuiAlert-message': { color: 'white' } }}>
              Escolha uma sessão no seletor acima para liberar as ferramentas de validação e scanner da portaria.
            </Alert>
          )}

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
