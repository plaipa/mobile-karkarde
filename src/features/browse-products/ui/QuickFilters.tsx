import { regionCode } from '@/entities/product'
import { toFa } from '@/shared/lib/format'
import { toggle, type Facets, type ProductFilters } from '../model/filters'
import './browse-products.css'

interface Props {
  filters: ProductFilters
  facets: Facets
  onChange: (patch: Partial<ProductFilters>) => void
}

const MODEL_SHORTCUTS = 5
const REGION_SHORTCUTS = 4

/**
 * One-tap shortcuts above the list for what partners ask for most: the newest models and the common region codes.
 * They drive the same filters as the side panel, so the two always agree.
 */
export function QuickFilters({ filters, facets, onChange }: Props) {
  const models = facets.models.slice(0, MODEL_SHORTCUTS)
  const regions = facets.regions.slice(0, REGION_SHORTCUTS)
  if (models.length === 0 && regions.length === 0) return null
  const none = filters.models.length === 0 && filters.regions.length === 0
  return (
    <div className="quick" aria-label="میانبر فیلتر">
      <button type="button" className={`quick__chip quick__chip--all${none ? ' is-on' : ''}`} aria-pressed={none} onClick={() => onChange({ models: [], regions: [] })}>
        همه
      </button>
      {models.map(({ value, count }) => (
        <button key={value} type="button" aria-pressed={filters.models.includes(value)} className={`quick__chip${filters.models.includes(value) ? ' is-on' : ''}`} onClick={() => onChange({ models: toggle(filters.models, value) })}>
          {value.replace(/^آیفون\s*/, '')} <small>{toFa(count)}</small>
        </button>
      ))}
      {regions.length > 0 && <span className="quick__sep" aria-hidden="true" />}
      {regions.map(({ value }) => (
        <button key={value} type="button" aria-pressed={filters.regions.includes(value)} className={`quick__chip quick__chip--region${filters.regions.includes(value) ? ' is-on' : ''}`} onClick={() => onChange({ regions: toggle(filters.regions, value) })}>
          <span dir="ltr">{regionCode(value)}</span>
        </button>
      ))}
    </div>
  )
}
