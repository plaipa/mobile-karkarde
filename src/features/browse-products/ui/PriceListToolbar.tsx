import type { ReactNode } from 'react'
import type { Category } from '@/entities/category'
import { count, toFa } from '@/shared/lib/format'
import { activeFilterCount, type ProductFilters, type SortKey } from '../model/filters'
import './browse-products.css'

interface Props {
  category: Category
  filters: ProductFilters
  resultCount: number
  total: number
  /** Rendered at the start of the controls row — the page puts its category tabs here. */
  leading?: ReactNode
  onChange: (patch: Partial<ProductFilters>) => void
  onOpenFilters: () => void
}

export function PriceListToolbar({ category, filters, resultCount, total, leading, onChange, onOpenFilters }: Props) {
  const active = activeFilterCount(filters)
  return (
    <header className="toolbar">
      <div className="toolbar__title">
        <h1 className="page__title">لیست قیمت {category.title}</h1>
        <span className="toolbar__count">{count(resultCount)} از {count(total)} دستگاه</span>
      </div>
      <div className="toolbar__row">
        {leading}
        <div className="toolbar__ctl">
          <input className="input" type="search" placeholder="جستجوی مدل یا کد…" aria-label="جستجو" value={filters.query} onChange={(e) => onChange({ query: e.target.value })} />
          <select className="input" value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as SortKey })} aria-label="مرتب‌سازی">
            <option value="desc">قیمت: زیاد به کم</option>
            <option value="asc">قیمت: کم به زیاد</option>
            <option value="new">جدیدترین</option>
            <option value="battery">بیشترین سلامت باتری</option>
          </select>
          <button className="btn btn--dark filters__open" onClick={onOpenFilters}>فیلتر{active > 0 && ` (${toFa(active)})`}</button>
        </div>
      </div>
    </header>
  )
}
