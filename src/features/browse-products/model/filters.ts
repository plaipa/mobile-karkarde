import { regions, simOrder, type Grade, type Product, type Sim } from '@/entities/product'

export type SortKey = 'desc' | 'asc' | 'new' | 'battery'

export interface ProductFilters {
  brands: string[]
  /** Cities (names from `serviceCities`). */
  cities: string[]
  /** Model names exactly as listed (e.g. "آیفون ۱۷ پرو مکس"). */
  models: string[]
  storages: number[]
  /** Region codes without `/A` (e.g. `ZA`, `CH`). */
  regions: string[]
  sims: Sim[]
  grades: Grade[]
  /** Minimum battery health in percent; items without a battery value always pass. */
  minBattery: number
  /** Price bounds in toman; `null` = unbounded. */
  minPrice: number | null
  maxPrice: number | null
  registered: boolean
  warranty: boolean
  /** Free text matched against the model name and the listing code. */
  query: string
  sort: SortKey
}

export const defaultFilters: ProductFilters = {
  brands: [],
  cities: [],
  models: [],
  storages: [],
  regions: [],
  sims: [],
  grades: [],
  minBattery: 0,
  minPrice: null,
  maxPrice: null,
  registered: false,
  warranty: false,
  query: '',
  sort: 'desc',
}

export function toggle<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

const comparators: Record<SortKey, (a: Product, b: Product) => number> = {
  desc: (a, b) => b.price - a.price,
  asc: (a, b) => a.price - b.price,
  new: (a, b) => a.addedDays - b.addedDays,
  battery: (a, b) => (b.battery ?? 0) - (a.battery ?? 0),
}

/** Pure: filters and sorts the given products (already narrowed to one category by the caller). */
export function applyFilters(products: readonly Product[], f: ProductFilters): Product[] {
  const query = f.query.trim().toLowerCase()
  return products
    .filter(
      (p) =>
        (!f.brands.length || f.brands.includes(p.brand)) &&
        (!f.cities.length || f.cities.includes(p.city)) &&
        (!f.models.length || f.models.includes(p.name)) &&
        (!f.storages.length || (p.storageGb !== undefined && f.storages.includes(p.storageGb))) &&
        (!f.regions.length || (p.region !== undefined && f.regions.includes(p.region))) &&
        (!f.sims.length || (p.sim !== undefined && f.sims.includes(p.sim))) &&
        (!f.grades.length || f.grades.includes(p.grade)) &&
        (p.battery ?? 100) >= f.minBattery &&
        (f.minPrice === null || p.price >= f.minPrice) &&
        (f.maxPrice === null || p.price <= f.maxPrice) &&
        (!f.registered || p.registered) &&
        (!f.warranty || p.warranty) &&
        (!query || p.name.toLowerCase().includes(query) || p.code.toLowerCase().includes(query)),
    )
    .sort(comparators[f.sort])
}

export interface Option<T> {
  value: T
  count: number
}

export interface Facets {
  cities: Option<string>[]
  models: Option<string>[]
  storages: Option<number>[]
  regions: Option<string>[]
  sims: Option<Sim>[]
}

function tally<T>(values: readonly (T | undefined)[]): Map<T, number> {
  const counts = new Map<T, number>()
  for (const v of values) if (v !== undefined) counts.set(v, (counts.get(v) ?? 0) + 1)
  return counts
}

/**
 * The options each filter group offers, with how many devices each would match.
 * Models are limited to the selected brands and ordered by their best price (newest flagship first);
 * storages ascending; regions in the order partners usually ask for them.
 */
export function buildFacets(products: readonly Product[], selectedBrands: readonly string[]): Facets {
  const inBrands = selectedBrands.length ? products.filter((p) => selectedBrands.includes(p.brand)) : products
  const bestPrice = new Map<string, number>()
  for (const p of inBrands) bestPrice.set(p.name, Math.max(bestPrice.get(p.name) ?? 0, p.price))
  const modelCounts = tally(inBrands.map((p) => p.name))
  const regionCounts = tally(products.map((p) => p.region))
  const simCounts = tally(products.map((p) => p.sim))

  const cityCounts = tally(products.map((p) => p.city))

  return {
    cities: [...cityCounts].map(([value, count]) => ({ value, count })),
    models: [...modelCounts].sort((a, b) => bestPrice.get(b[0])! - bestPrice.get(a[0])!).map(([value, count]) => ({ value, count })),
    storages: [...tally(products.map((p) => p.storageGb))].sort((a, b) => a[0] - b[0]).map(([value, count]) => ({ value, count })),
    regions: regions.filter((r) => regionCounts.has(r.code)).map((r) => ({ value: r.code, count: regionCounts.get(r.code)! })),
    sims: simOrder.filter((s) => simCounts.has(s)).map((s) => ({ value: s, count: simCounts.get(s)! })),
  }
}

/** How many filter groups are narrowing the list — shown on the mobile "filters" button. */
export function activeFilterCount(f: ProductFilters): number {
  return [
    f.brands.length > 0, f.cities.length > 0, f.models.length > 0, f.storages.length > 0, f.regions.length > 0, f.sims.length > 0, f.grades.length > 0,
    f.minBattery > 0, f.minPrice !== null, f.maxPrice !== null, f.registered, f.warranty,
  ].filter(Boolean).length
}
