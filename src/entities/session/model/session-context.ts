import { createContext } from 'react'
import type { AuthError } from '@/shared/api/supabase'

export type Role = 'admin' | 'inspector' | 'partner'

/** `verified`: may see prices and list devices. Otherwise where the partner's application stands. */
export type Verification = 'verified' | 'pending' | 'rejected' | 'none'

/** What a sign-in attempt led to: signed in, a code is still needed (two-step), or a failure. */
export type SignInOutcome =
  | { status: 'done'; verification: Verification }
  | { status: 'code'; challenge: string; phoneHint: string }
  | { status: 'error'; error: AuthError }

export interface Session {
  /** Partner's mobile number, or null when signed out. */
  phone: string | null
  /** From the server: «کارشناس», admin or plain partner; null when signed out. */
  role: Role | null
  /** Signed-out: null. A کارشناس/admin is always verified. */
  verification: Verification | null
  /** Shortcut: `verification === 'verified'`. */
  verified: boolean
  /** Re-reads role and verification (after an application is sent or reviewed). */
  refresh: () => Promise<void>
  /** City new listings start with; the partner changes it in account settings. */
  city: string
  setCity: (city: string) => void
  signInWithPhone: (phone: string, code: string) => Promise<SignInOutcome>
  signInWithEmail: (email: string, password: string) => Promise<SignInOutcome>
  /** Second step of an email sign-in when two-step verification is on. */
  signInWithEmailCode: (challenge: string, code: string) => Promise<SignInOutcome>
  signOut: () => Promise<void>
}

export const SessionContext = createContext<Session | null>(null)
