export type UserRole = 'CONSUMER' | 'ORGANIZER' | 'VALIDATOR'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}