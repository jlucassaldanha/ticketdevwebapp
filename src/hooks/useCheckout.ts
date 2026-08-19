import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { Event } from '@/types/event';
import { ReserveTicketResponse } from '@/types/ticket';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX';

export const useCheckout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const eventId = searchParams.get('eventId');
  const seat = searchParams.get('seat');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadEvent() {
      if (!eventId) {
        setLoading(false);
        return;
      }
      try {
        const allEvents = await apiFetch<Event[]>('/api/events');
        const foundEvent = allEvents.find((e) => e.id === eventId);
        if (foundEvent) {
          setEvent(foundEvent);
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do filme para o checkout:', err);
        setError('Não foi possível carregar os detalhes do filme.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const handleProcessPayment = async (simulateStatus: 'APPROVED' | 'REFUSED') => {
    if (!eventId || !seat) return;
    
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        eventId,
        seatNumber: seat,
        paymentMethod,
        paymentSimulateStatus: simulateStatus
      };

      await apiFetch<ReserveTicketResponse>('/api/tickets/reserve', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (simulateStatus === 'APPROVED') {
        setSuccess(true);
        setTimeout(() => {
          router.push('/tickets');
        }, 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao processar a requisição de pagamento.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    event,
    seat,
    loading,
    paymentMethod,
    setPaymentMethod,
    submitting,
    error,
    success,
    router,
    handleProcessPayment
  };
};