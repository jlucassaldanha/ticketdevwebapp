import { useAuth } from '@/contexts/AuthContext'
import { apiFetch } from '@/lib/api'
import { RegisterApiResponse } from '@/types/auth'
import { UserRole } from '@/types/user'
import { SelectChangeEvent } from '@mui/material'
import { ChangeEvent, useState } from 'react'

export default function useRegister() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('CONSUMER')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as UserRole)
  }

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const data = await apiFetch<RegisterApiResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      })

      login(data.token, data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta')
    } finally {
      setSubmitting(false)
    }
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => setName(e.target.value)

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => setEmail(e.target.value)
  
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => setPassword(e.target.value)

  return {
    error,
    role,
    password,
    email,
    name,
    submitting,
    handleRoleChange,
    handleEmailChange,
    handleNameChange,
    handlePasswordChange,
    handleSubmit
  }
}