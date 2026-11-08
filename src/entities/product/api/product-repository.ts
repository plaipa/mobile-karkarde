import type { CategoryId } from '@/entities/category'
import type { Product } from '../model/types'
import { mockProducts } from './mock-products'
import { getPublished } from './published-store'

/**
 * The ONE place that knows where products come from.
 *
 * Devices approved by a کارشناس (loaded from the server, see `published-store.ts`) come first, then the demo rows.
 * Delete the demo rows (`mock-products.ts`) when real inventory is enough. Nothing else in the app imports mock data.
 */
const all = (): readonly Product[] => [...getPublished(), ...mockProducts]

export const productRepository = {
  list(): readonly Product[] {
    return all()
  },
  findByCode(code: string | undefined): Product | undefined {
    return all().find((p) => p.code === code)
  },
  listByCategory(category: CategoryId): readonly Product[] {
    return all().filter((p) => p.category === category)
  },
  /** Same category, excluding the product itself. */
  listSimilar(product: Product, limit = 4): readonly Product[] {
    return all().filter((p) => p.category === product.category && p.code !== product.code).slice(0, limit)
  },
  /** Newest first. */
  listLatest(categoriesToInclude: readonly CategoryId[], limit: number): readonly Product[] {
    return all()
      .filter((p) => categoriesToInclude.includes(p.category))
      .toSorted((a, b) => a.addedDays - b.addedDays)
      .slice(0, limit)
  },
}
