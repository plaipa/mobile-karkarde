import { createContext } from 'react'

export interface Session {
  /** Partner's mobile number, or null when signed out. */
  phone: string | null
  signIn: (phone: string) => void
  signOut: () => void
}

export const SessionContext = createContext<Session | null>(null)
