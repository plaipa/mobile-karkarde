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
 * One-tap shortcuts above the list for what partners ask for most: the newest models and the common region codes,
 * in two labelled groups. They drive the same filters as the side panel, so the two always agree.
 */
export function QuickFilters({ filters, facets, onChange }: Props) {
  const models = facets.models.slice(0, MODEL_SHORTCUTS)
  const regions = facets.regions.slice(0, REGION_SHORTCUTS)
  if (models.length === 0 && regions.length === 0) return null
  const none = filters.models.length === 0 && filters.regions.length === 0
  return (
    <div className="quick" aria-label="میانبر فیلتر">
      <div className="quick__group" role="group" aria-label="مدل">
        <button type="button" className={`quick__chip${none ? ' is-on' : ''}`} aria-pressed={none} onClick={() => onChange({ models: [], regions: [] })}>
          همه
        </button>
        {models.map(({ value, count }) => {
          const on = filters.models.includes(value)
          return (
            <button key={value} type="button" aria-pressed={on} className={`quick__chip${on ? ' is-on' : ''}`} onClick={() => onChange({ models: toggle(filters.models, value) })}>
              {value.replace(/^آیفون\s*/, '')}
              <small>{toFa(count)}</small>
            </button>
          )
        })}
      </div>
      {regions.length > 0 && (
        <div className="quick__group" role="group" aria-label="کد کشور">
          <span className="quick__label">کد کشور</span>
          {regions.map(({ value }) => {
            const on = filters.regions.includes(value)
            return (
              <button key={value} type="button" aria-pressed={on} className={`quick__chip quick__chip--region${on ? ' is-on' : ''}`} onClick={() => onChange({ regions: toggle(filters.regions, value) })}>
                <span dir="ltr">{regionCode(value)}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
