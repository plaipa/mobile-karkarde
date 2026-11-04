import { useMemo, type ReactNode } from 'react'
import { nullableStringCodec, usePersistentState } from '@/shared/lib/storage'
import { SessionContext, type Session } from './session-context'

const STORAGE_KEY = 'mk_partner'

/**
 * Prototype only: there is no server yet, so "signing in" just remembers the phone number in this browser.
 * When the backend arrives, keep the `Session` interface and swap the storage for a token + `/me` request.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = usePersistentState<string | null>(STORAGE_KEY, null, nullableStringCodec)
  const value = useMemo<Session>(() => ({ phone, signIn: setPhone, signOut: () => setPhone(null) }), [phone, setPhone])
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
