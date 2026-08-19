import { apiFetch } from "@/lib/api";
import { Event } from "@/types/event";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useSeatSelection() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [event, setEvent] = useState<Event | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getDynamicGrid = (capacity: number) => {
    let cols = 8;
    if (capacity > 100) cols = 12;
    else if (capacity > 40) cols = 10;

    const totalRows = Math.ceil(capacity / cols);
    const rowLetters: string[] = [];

    for (let i = 0; i < totalRows; i++) {
      const letter = String.fromCharCode(65 + i);
      rowLetters.push(letter);
    }

    return { rows: rowLetters, seatsPerRow: cols };
  };

  const { rows, seatsPerRow } = event ? getDynamicGrid(event.capacity) : { rows: ['A', 'B', 'C', 'D', 'E'], seatsPerRow: 8 };

  useEffect(() => {
    async function loadData() {
      try {
        const allEvents = await apiFetch<Event[]>('/api/events');

        const foundEvent = allEvents.find((e) => e.id === id);

        if (foundEvent) {
          setEvent(foundEvent);
          
          const occupied = foundEvent.tickets
            ?.filter((ticket) => ticket.status !== 'CANCELED' && ticket.seatNumber)
            .map((ticket) => ticket.seatNumber as string) || [];
            
          setOccupiedSeats(occupied);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do evento:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  const handleSeatClick = (seatCode: string) => {
    if (occupiedSeats.includes(seatCode)) return; 
    setSelectedSeat(selectedSeat === seatCode ? null : seatCode);
  };

  const handleProceedToCheckout = () => {
    if (!selectedSeat) return;
    router.push(`/checkout?eventId=${id}&seat=${selectedSeat}`);
  };

  return {
    loading,
    rows, 
    event,
    seatsPerRow,
    occupiedSeats,
    selectedSeat,
    handleSeatClick,
    handleProceedToCheckout
  }
}