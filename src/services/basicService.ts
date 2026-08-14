const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function basicGet() {
  const response = await fetch(`${BASE_URL}/api`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Falaha ao conectar com a API');
  }

  const data: { message: string } = await response.json();

  return data
}