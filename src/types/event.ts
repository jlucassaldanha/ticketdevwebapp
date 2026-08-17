import { Ticket } from './ticket';

export interface Event {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  date: string
  location: string
  capacity: number
  price: number
  tickets?: Ticket[]
}