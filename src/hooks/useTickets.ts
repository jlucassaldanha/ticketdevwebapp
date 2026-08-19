import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { Ticket } from '@/types/ticket';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState<Ticket | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<Ticket[]>('/api/tickets/my-tickets');
      setTickets(data);
    } catch (err) {
      console.error('Erro ao carregar ingressos:', err);
      setError('Falha ao carregar seus ingressos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) {
        loadTickets();
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loadTickets]);

  const handleOpenCancelDialog = (ticket: Ticket) => {
    setTicketToCancel(ticket);
    setCancelDialogOpen(true);
  };

  const handleCloseCancelDialog = () => {
    setTicketToCancel(null);
    setCancelDialogOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!ticketToCancel) return;
    setCancelling(true);
    try {
      await apiFetch(`/api/tickets/${ticketToCancel.id}/cancel`, {
        method: 'POST'
      });
      
      await loadTickets();
      handleCloseCancelDialog();
    } catch (err) {
      console.error('Erro ao cancelar ticket:', err);
      alert(err instanceof Error ? err.message : 'Falha ao cancelar o ingresso.');
    } finally {
      setCancelling(false);
    }
  };

  const handleShare = (secureHash: string) => {
    const shareUrl = `${window.location.origin}/tickets/share/${secureHash}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Meu Ingresso - TicketDev',
        text: 'Dá uma olhada no meu ingresso de cinema!',
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link de compartilhamento copiado para a área de transferência!'))
        .catch(() => alert(`Copie este link para compartilhar: ${shareUrl}`));
    }
  };

  return {
    tickets,
    loading,
    error,
    cancelDialogOpen,
    ticketToCancel,
    cancelling,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
    handleShare
  };
};