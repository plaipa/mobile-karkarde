import { createContext } from 'react'

export interface Session {
  /** Partner's mobile number, or null when signed out. */
  phone: string | null
  /** City new listings start with; the partner changes it in account settings. */
  city: string
  setCity: (city: string) => void
  signIn: (phone: string) => void
  signOut: () => void
}

export const SessionContext = createContext<Session | null>(null)
