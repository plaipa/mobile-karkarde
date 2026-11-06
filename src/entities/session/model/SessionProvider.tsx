import { useMemo, type ReactNode } from 'react'
import { activeCities, defaultCity } from '@/shared/config/cities'
import { nullableStringCodec, usePersistentState } from '@/shared/lib/storage'
import { SessionContext, type Session } from './session-context'

const STORAGE_KEY = 'mk_partner'
const CITY_KEY = 'mk_city'

/**
 * Prototype only: there is no server yet, so "signing in" just remembers the phone number in this browser.
 * When the backend arrives, keep the `Session` interface and swap the storage for a token + `/me` request.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = usePersistentState<string | null>(STORAGE_KEY, null, nullableStringCodec)
  const [savedCity, setCity] = usePersistentState<string | null>(CITY_KEY, null, nullableStringCodec)
  // A saved city that the service no longer covers falls back to the default.
  const city = savedCity && activeCities.includes(savedCity) ? savedCity : defaultCity
  const value = useMemo<Session>(
    () => ({ phone, city, setCity, signIn: setPhone, signOut: () => setPhone(null) }),
    [phone, city, setCity, setPhone],
  )
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
