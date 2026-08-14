import { basicGet } from '@/services/basicService';

export async function basicAction(): Promise<{ data?: { message: string }, error?: string}> {
  try {
    const response = await basicGet();

    return { data: response }
  } catch (error) {
    return { error: 'Erro ao processar requisição' }
  }
}