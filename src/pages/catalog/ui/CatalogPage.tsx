import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, findCategory } from '@/entities/category'
import { useSession } from '@/entities/session'
import { DeviceList, FilterPanel, PriceListToolbar, useProductFilters } from '@/features/browse-products'
import { AddToCartButton } from '@/features/cart'
import { PriceCell } from '@/features/price-visibility'
import { paths } from '@/shared/config/routes'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import './catalog.css'

const tabs = categories.map((c) => ({ id: c.id, label: c.title }))

/**
 * The partner price list: every device of one category in a dense list, most expensive first, with filters.
 * The category is part of the URL (`?cat=watch`) so links and the back button work.
 */
export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const { phone } = useSession()
  const category = findCategory(params.get('cat'))
  const { filters, products, total, facets, update, reset } = useProductFilters(category.id)
  const [filtersOpen, setFiltersOpen] = useState(false)

  return (
    <div className="container page">
      <Tabs items={tabs} value={category.id} onChange={(id) => { setParams({ cat: id }); reset() }} />
      <PriceListToolbar category={category} filters={filters} resultCount={products.length} total={total} onChange={update} onOpenFilters={() => setFiltersOpen(true)} />
      {!phone && <p className="notice">قیمت عمده فقط برای همکاران تأییدشده نمایش داده می‌شود. <Link to={paths.login}>ورود یا ثبت‌نام</Link></p>}
      <div className="layout">
        <div className="layout__main">
          {products.length === 0 ? (
            <p className="empty">دستگاهی با این فیلترها پیدا نشد. <button className="link" onClick={reset}>پاک کردن فیلترها</button></p>
          ) : (
            <DeviceList
              category={category}
              products={products}
              renderPrice={(p) => <PriceCell price={p.price} />}
              renderAction={(p) => <AddToCartButton code={p.code} className="btn btn--outline btn--sm" />}
            />
          )}
        </div>
        <FilterPanel
          category={category}
          filters={filters}
          facets={facets}
          resultCount={products.length}
          open={filtersOpen}
          onChange={update}
          onReset={reset}
          onClose={() => setFiltersOpen(false)}
        />
      </div>
    </div>
  )
}
