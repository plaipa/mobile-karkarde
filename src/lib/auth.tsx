import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface AuthCtx {
  phone: string | null
  login: (phone: string) => void
  logout: () => void
}

const Ctx = createContext<AuthCtx | null>(null)
const KEY = 'mk_partner'

// Prototype only: there is no server yet, so "login" just remembers the phone number in this browser.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState<string | null>(() => {
    try { return localStorage.getItem(KEY) } catch { return null }
  })
  useEffect(() => {
    try { phone ? localStorage.setItem(KEY, phone) : localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
  }, [phone])
  const value = useMemo(() => ({ phone, login: setPhone, logout: () => setPhone(null) }), [phone])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}
