import { useMemo, type ReactNode } from 'react'
import { jsonCodec, usePersistentState } from '@/shared/lib/storage'
import { CartContext, type Cart } from './cart-context'

const STORAGE_KEY = 'mk_cart'
const codec = jsonCodec<string[]>()

export function CartProvider({ children }: { children: ReactNode }) {
  const [codes, setCodes] = usePersistentState<string[]>(STORAGE_KEY, [], codec)
  const value = useMemo<Cart>(() => ({
    codes,
    add: (code) => setCodes((prev) => (prev.includes(code) ? prev : [...prev, code])),
    remove: (code) => setCodes((prev) => prev.filter((c) => c !== code)),
    clear: () => setCodes([]),
    has: (code) => codes.includes(code),
  }), [codes, setCodes])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
