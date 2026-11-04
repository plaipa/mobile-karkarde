import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { SessionProvider } from '@/entities/session'
import { CartProvider } from '@/features/cart'

/** Every global provider in one place. Order: session first, since later providers may depend on it. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </CartProvider>
    </SessionProvider>
  )
}
