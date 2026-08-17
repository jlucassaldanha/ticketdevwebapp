import { Event } from "./event";

export interface Ticket {
  id: string
  seatNumber: string | null
  status: string
  secureHash: string;
  event: Event;
}

export interface ReserveTicketResponse {
  id: string;
  secureHash: string;
  seatNumber: string;
  status: string;
  event: Event;
}

export interface SharedTicket {
  id: string;
  seatNumber: string | null;
  status: string;
  secureHash: string;
  client: {
    name: string;
  };
  event: Event;
}