import { useCallback, useMemo, useState } from 'react'
import type { CategoryId } from '@/entities/category'
import { productRepository } from '@/entities/product'
import { applyFilters, buildFacets, defaultFilters, type ProductFilters } from './filters'

/** Filter state for one category plus the resulting product list and the options each filter offers. */
export function useProductFilters(category: CategoryId) {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters)
  const all = useMemo(() => productRepository.listByCategory(category), [category])
  const products = useMemo(() => applyFilters(all, filters), [all, filters])
  const facets = useMemo(() => buildFacets(all, filters.brands), [all, filters.brands])
  const update = useCallback((patch: Partial<ProductFilters>) => setFilters((f) => ({ ...f, ...patch })), [])
  /** Clears every filter but keeps the chosen sort order. */
  const reset = useCallback(() => setFilters((f) => ({ ...defaultFilters, sort: f.sort })), [])
  return { filters, products, total: all.length, facets, update, reset }
}
