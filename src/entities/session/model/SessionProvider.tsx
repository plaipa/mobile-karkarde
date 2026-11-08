import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session as AuthSession } from '@supabase/supabase-js'
import { acceptSession, callAuth, supabase } from '@/shared/api/supabase'
import { activeCities, defaultCity } from '@/shared/config/cities'
import { nullableStringCodec, usePersistentState } from '@/shared/lib/storage'
import { SessionContext, type Role, type Session, type SignInOutcome } from './session-context'

const CITY_KEY = 'mk_city'

/**
 * Signed-in state comes from Supabase Auth. The login function (server) decides who may sign in and
 * writes the phone number into the account; the role (admin / کارشناس / partner) is read from the database.
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(null)
  const [role, setRole] = useState<Role | null>(null)
  const [ready, setReady] = useState(false)
  const [savedCity, setCity] = usePersistentState<string | null>(CITY_KEY, null, nullableStringCodec)
  // A saved city that the service no longer covers falls back to the default.
  const city = savedCity && activeCities.includes(savedCity) ? savedCity : defaultCity

  const apply = useCallback(async (s: AuthSession | null) => {
    const p = (s?.user.app_metadata?.phone as string | undefined) ?? null
    if (!p) {
      setPhone(null)
      setRole(null)
      return
    }
    const { data } = await supabase.rpc('my_role')
    setRole((data as Role | null) ?? 'partner')
    setPhone(p)
  }, [])

  useEffect(() => {
    let alive = true
    void supabase.auth.getSession().then(({ data }) => apply(data.session)).finally(() => { if (alive) setReady(true) })
    // Other supabase calls must not run inside this callback itself, hence the timeout.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => { window.setTimeout(() => void apply(s), 0) })
    return () => { alive = false; sub.subscription.unsubscribe() }
  }, [apply])

  const finish = useCallback(async (data: Record<string, unknown>): Promise<SignInOutcome> => {
    if (!(await acceptSession(data))) return { status: 'error', error: 'server' }
    await apply((await supabase.auth.getSession()).data.session)
    return { status: 'done' }
  }, [apply])

  const value = useMemo<Session>(() => ({
    phone, role, city, setCity,
    signInWithPhone: async (p, code) => {
      const r = await callAuth('phone-login', { phone: p, code })
      return r.ok ? finish(r.data) : { status: 'error', error: r.error ?? 'server' }
    },
    signInWithEmail: async (email, password) => {
      const r = await callAuth('email-login', { email, password })
      if (!r.ok) return { status: 'error', error: r.error ?? 'server' }
      if (r.data.step === 'code') return { status: 'code', challenge: String(r.data.challenge), phoneHint: String(r.data.phone_hint ?? '') }
      return finish(r.data)
    },
    signInWithEmailCode: async (challenge, code) => {
      const r = await callAuth('email-login-code', { challenge, code })
      return r.ok ? finish(r.data) : { status: 'error', error: r.error ?? 'server' }
    },
    signOut: async () => { await supabase.auth.signOut(); await apply(null) },
  }), [phone, role, city, setCity, finish, apply])

  if (!ready) return null
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
