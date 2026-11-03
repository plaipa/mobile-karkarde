import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface CartCtx {
  codes: string[]
  add: (code: string) => void
  remove: (code: string) => void
  clear: () => void
  has: (code: string) => boolean
}

const Ctx = createContext<CartCtx | null>(null)
const KEY = 'mk_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [codes, setCodes] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  })
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(codes)) } catch { /* storage unavailable */ }
  }, [codes])
  const value = useMemo<CartCtx>(() => ({
    codes,
    add: (c) => setCodes((p) => (p.includes(c) ? p : [...p, c])),
    remove: (c) => setCodes((p) => p.filter((x) => x !== c)),
    clear: () => setCodes([]),
    has: (c) => codes.includes(c),
  }), [codes])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
