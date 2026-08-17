import { apiFetch } from '@/lib/api';

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  location: string;
  price: number;
}

type EventsApiResponse = Event[]

export default async function Page() {
  const events = await apiFetch<EventsApiResponse>('/api/events');

  return (
    <div>
      <main>
        {events.map((e) => e.title)}
      </main>
    </div>
  );
}
