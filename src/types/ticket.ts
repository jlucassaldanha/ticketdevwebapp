export interface Ticket {
  id: string
  seatNumber: string | null
  status: string
}

export interface ReserveTicketResponse {
  id: string;
  secureHash: string;
  seatNumber: string;
  status: string;
  event: Event;
}