import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, findCategory } from '@/entities/category'
import { useSession } from '@/entities/session'
import { DeviceList, FilterPanel, PriceListToolbar, QuickFilters, useProductFilters } from '@/features/browse-products'
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
    <div className="container page catalog">
      <PriceListToolbar
        category={category}
        filters={filters}
        resultCount={products.length}
        total={total}
        leading={<Tabs items={tabs} value={category.id} onChange={(id) => { setParams({ cat: id }); reset() }} />}
        onChange={update}
        onOpenFilters={() => setFiltersOpen(true)}
      />
      {!phone && (
        <p className="notice catalog__notice">
          <span>قیمت عمده فقط برای همکاران تأییدشده نمایش داده می‌شود.</span>
          <Link to={paths.login} className="btn btn--primary btn--sm">ورود یا ثبت‌نام همکار</Link>
        </p>
      )}
      <QuickFilters filters={filters} facets={facets} onChange={update} />
      <div className="layout">
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
        <div className="layout__main">
          {products.length === 0 ? (
            <p className="empty">دستگاهی با این فیلترها پیدا نشد. <button className="link" onClick={reset}>پاک کردن فیلترها</button></p>
          ) : (
            <DeviceList
              category={category}
              products={products}
              renderPrice={(p) => <PriceCell price={p.price} />}
              // Buying needs a partner account, so signed-out visitors get no buy button on every row.
              renderAction={phone ? (p) => <AddToCartButton code={p.code} className="btn btn--outline btn--sm" /> : undefined}
            />
          )}
        </div>
      </div>
    </div>
  )
}
