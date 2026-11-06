import type { ReactNode } from 'react'
import type { Category } from '@/entities/category'
import { gradeLabel, grades, regionCode, simLabels } from '@/entities/product'
import { toFa } from '@/shared/lib/format'
import { toggle, type Facets, type ProductFilters } from '../model/filters'
import { ChipGroup } from './ChipGroup'
import { MillionInput } from './MillionInput'
import './browse-products.css'

interface Props {
  category: Category
  filters: ProductFilters
  facets: Facets
  resultCount: number
  open: boolean
  onChange: (patch: Partial<ProductFilters>) => void
  onReset: () => void
  onClose: () => void
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="fgroup">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

/** Sidebar on desktop, bottom sheet on mobile. Groups with no options for this category are hidden. */
export function FilterPanel({ category, filters, facets, resultCount, open, onChange, onReset, onClose }: Props) {
  return (
    <aside className={`filters${open ? ' is-open' : ''}`}>
      <div className="filters__head">
        <strong>فیلترها</strong>
        <button className="btn btn--outline btn--sm filters__close" onClick={onClose}>بستن</button>
      </div>
      {facets.cities.length > 1 && (
        <Group title="شهر">
          <ChipGroup options={facets.cities} selected={filters.cities} onChange={(cities) => onChange({ cities })} />
        </Group>
      )}
      <Group title="برند">
        <div className="opts opts--grid">
          {category.brands.map((brand) => (
            <button
              key={brand}
              type="button"
              aria-pressed={filters.brands.includes(brand)}
              className={`opt${filters.brands.includes(brand) ? ' is-on' : ''}`}
              // A model of a brand that is no longer selected would silently keep filtering, so models reset with brands.
              onClick={() => onChange({ brands: toggle(filters.brands, brand), models: [] })}
            >
              {brand}
            </button>
          ))}
        </div>
      </Group>
      {facets.models.length > 0 && (
        <Group title="مدل">
          <ChipGroup options={facets.models} selected={filters.models} layout="list" limit={6} onChange={(models) => onChange({ models })} />
        </Group>
      )}
      {facets.storages.length > 0 && category.id === 'phone' && (
        <Group title="حافظه">
          <ChipGroup
            options={facets.storages}
            selected={filters.storages}
            label={(gb) => (gb >= 1024 ? `${toFa(gb / 1024)} ترابایت` : `${toFa(gb)} گیگ`)}
            onChange={(storages) => onChange({ storages })}
          />
        </Group>
      )}
      {facets.regions.length > 0 && (
        <Group title="کد کشور">
          <ChipGroup options={facets.regions} selected={filters.regions} label={regionCode} limit={6} onChange={(regions) => onChange({ regions })} />
        </Group>
      )}
      {facets.sims.length > 0 && (
        <Group title="سیم‌کارت">
          <ChipGroup options={facets.sims} selected={filters.sims} label={(s) => simLabels[s]} onChange={(sims) => onChange({ sims })} />
        </Group>
      )}
      <Group title="وضعیت ظاهری">
        <div className="opts opts--grid">
          {grades.map((g) => (
            <button key={g} type="button" aria-pressed={filters.grades.includes(g)} className={`opt${filters.grades.includes(g) ? ' is-on' : ''}`} onClick={() => onChange({ grades: toggle(filters.grades, g) })}>
              {gradeLabel[g]}
            </button>
          ))}
        </div>
      </Group>
      <Group title="قیمت (میلیون تومان)">
        <div className="range-pair">
          <MillionInput value={filters.minPrice} placeholder="از" label="حداقل قیمت" onChange={(minPrice) => onChange({ minPrice })} />
          <span>تا</span>
          <MillionInput value={filters.maxPrice} placeholder="تا" label="حداکثر قیمت" onChange={(maxPrice) => onChange({ maxPrice })} />
        </div>
      </Group>
      <Group title={`سلامت باتری (حداقل): ${toFa(filters.minBattery)}٪`}>
        <input type="range" min={0} max={95} step={5} value={filters.minBattery} onChange={(e) => onChange({ minBattery: +e.target.value })} />
      </Group>
      <div className="fgroup">
        <label className="switch"><input type="checkbox" checked={filters.registered} onChange={(e) => onChange({ registered: e.target.checked })} /><i />رجیستر شده</label>
        <label className="switch"><input type="checkbox" checked={filters.warranty} onChange={(e) => onChange({ warranty: e.target.checked })} /><i />دارای گارانتی</label>
      </div>
      <div className="filters__foot">
        <button className="btn btn--outline" onClick={onReset}>پاک کردن</button>
        <button className="btn btn--primary" onClick={onClose}>نمایش {toFa(resultCount)} مورد</button>
      </div>
    </aside>
  )
}
