const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>;
    
    const errorMessage = typeof errorData.error === 'string'
      ? errorData.error
      : typeof errorData.message === 'string'
        ? errorData.message
        : 'Erro na requisição';

    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}