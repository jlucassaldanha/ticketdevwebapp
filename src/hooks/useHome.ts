import { apiFetch } from '@/lib/api';
import { Event } from '@/types/event';
import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

export default function useHome() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODAS');

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiFetch<Event[]>('/api/events');
        setEvents(data);
      } catch (err) {
        console.error('Falha ao carregar eventos da API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || 
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'TODAS' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['TODAS', ...Array.from(new Set(events.map((e) => e.category)))];

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => setSearch(e.target.value)

  return {
    search,
    categories,
    selectedCategory,
    loading,
    filteredEvents,
    handleCategoryChange,
    handleSearchChange
  }
}