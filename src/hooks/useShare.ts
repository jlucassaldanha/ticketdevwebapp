import { apiFetch } from "@/lib/api";
import { SharedTicket } from "@/types/ticket";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function useShare() {
  const { hash } = useParams() as { hash: string };
  const [ticket, setTicket] = useState<SharedTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTicket() {
      if (!hash) return;
      try {
        const data = await apiFetch<{ticket: SharedTicket}>(`/api/tickets/share/${hash}`);
        setTicket(data.ticket);
        console.log('data: ', data)
      } catch (err) {
        console.error('Erro ao carregar voucher compartilhado:', err);
        setError('Este ingresso não existe, foi cancelado ou o link é inválido.');
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [hash]);

  return {
    loading,
    error,
    ticket
  }
}