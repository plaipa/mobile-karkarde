import type { CategoryId } from '@/entities/category'
import type { Product } from '../model/types'
import { mockProducts } from './mock-products'

/**
 * The ONE place that knows where products come from.
 *
 * Today it reads an in-memory demo list. When the backend exists, replace the bodies below with
 * `fetch` calls (and make the methods async + add loading states in the callers). Nothing else
 * in the app imports mock data.
 */
export const productRepository = {
  list(): readonly Product[] {
    return mockProducts
  },
  findByCode(code: string | undefined): Product | undefined {
    return mockProducts.find((p) => p.code === code)
  },
  listByCategory(category: CategoryId): readonly Product[] {
    return mockProducts.filter((p) => p.category === category)
  },
  /** Same category, excluding the product itself. */
  listSimilar(product: Product, limit = 4): readonly Product[] {
    return mockProducts.filter((p) => p.category === product.category && p.code !== product.code).slice(0, limit)
  },
  /** Newest first. */
  listLatest(categoriesToInclude: readonly CategoryId[], limit: number): readonly Product[] {
    return mockProducts
      .filter((p) => categoriesToInclude.includes(p.category))
      .toSorted((a, b) => a.addedDays - b.addedDays)
      .slice(0, limit)
  },
}
