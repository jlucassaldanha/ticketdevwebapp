import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { Event } from '@/types/event';
import { ValidationResult } from '@/types/gate';
import { ValidateTicketResponse } from '@/types/ticket';

export const useGateValidator = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult>({ status: 'NONE', message: '' });
  const [isCameraActive, setIsCameraActive] = useState(false);

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

  const handleEventChange = (eventId: string) => {
    setSelectedEventId(eventId);
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
    }
  }, [selectedEventId]);

  const handleDismissResult = () => {
    setValidationResult({ status: 'NONE', message: '' });
  };

  return {
    events,
    selectedEventId,
    loading,
    validating,
    validationResult,
    isCameraActive,
    setIsCameraActive,
    handleEventChange,
    handleValidateTicket,
    handleDismissResult
  };
};