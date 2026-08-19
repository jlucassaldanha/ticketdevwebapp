import { useAuth } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api'
import { LoginApiResponse } from '@/types/auth'
import { ChangeEvent, useState } from 'react'

export default function useLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const data = await apiFetch<LoginApiResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      login(data.token, data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na autenticação')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickFill = (role: 'organizer' | 'consumer' | 'validator') => {
    setPassword('SenhaTeste123')
    if (role === 'organizer') setEmail('organizador1@ticketdev.com')
    if (role === 'consumer') setEmail('cliente1@ticketdev.com')
    if (role === 'validator') setEmail('portaria@ticketdev.com')
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => setEmail(e.target.value)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => setPassword(e.target.value)

  return {
    email,
    password,
    submitting,
    error,
    handleSubmit,
    handleQuickFill,
    handleEmailChange,
    handlePasswordChange
  }
}