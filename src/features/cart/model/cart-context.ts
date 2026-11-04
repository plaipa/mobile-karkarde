import { createContext } from 'react'

export interface Cart {
  /** Product codes in the cart, in the order they were added. */
  codes: readonly string[]
  add: (code: string) => void
  remove: (code: string) => void
  clear: () => void
  has: (code: string) => boolean
}

export const CartContext = createContext<Cart | null>(null)
