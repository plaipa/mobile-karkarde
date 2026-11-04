import { productRepository, type Product } from '@/entities/product'
import { useCart } from './useCart'

/** Cart contents resolved to products (codes that no longer exist are dropped) plus the total price. */
export function useCartItems(): { items: Product[]; total: number } {
  const { codes } = useCart()
  const items = codes.map((code) => productRepository.findByCode(code)).filter((p): p is Product => p !== undefined)
  return { items, total: items.reduce((sum, p) => sum + p.price, 0) }
}
