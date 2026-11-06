import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Category } from '@/entities/category'
import { gradeLabel, regionCode, regionLabel, simLabels, type Product } from '@/entities/product'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './browse-products.css'

interface Props {
  category: Category
  products: readonly Product[]
  /** Price content — injected by the page so this feature stays independent of auth. */
  renderPrice: (product: Product) => ReactNode
  /** Row action (e.g. "request") — injected for the same reason. */
  renderAction: (product: Product) => ReactNode
}

/** The one-line facts under the model name. */
function tags(p: Product): string {
  return [p.sim && simLabels[p.sim], p.color, p.registered && 'رجیستر', p.warranty && 'گارانتی'].filter(Boolean).join(' · ')
}

/** A dense price list: one row per device (a stacked two-line row on phones). Order is the caller's. */
export function DeviceList({ category, products, renderPrice, renderAction }: Props) {
  return (
    <div className="plist" role="table">
      <div className="plist__head" role="row">
        <span role="columnheader">مدل</span>
        <span role="columnheader">{category.id === 'phone' ? 'حافظه' : 'اندازه'}</span>
        <span role="columnheader">کد کشور</span>
        <span role="columnheader">باتری</span>
        <span role="columnheader">گرید</span>
        <span role="columnheader">قیمت همکار</span>
        <span role="columnheader" />
      </div>
      {products.map((p) => (
        <div className="plist__row" role="row" key={p.code}>
          <div className="plist__name" role="cell">
            <Link to={paths.product(p.code)}>{p.name}</Link>
            <small>{tags(p)}</small>
          </div>
          <div className="plist__specs">
            <span role="cell">{p.storage ?? '—'}</span>
            <span role="cell" className="plist__region" title={p.region ? regionLabel(p.region) : undefined}>
              {p.region ? <b dir="ltr">{regionCode(p.region)}</b> : '—'}
            </span>
            <span role="cell">{p.battery ? `${toFa(p.battery)}٪` : '—'}</span>
            <span role="cell"><span className={`chip chip--${p.grade}`}>{gradeLabel[p.grade]}</span></span>
          </div>
          <div className="plist__price" role="cell">{renderPrice(p)}</div>
          <div className="plist__action" role="cell">{renderAction(p)}</div>
        </div>
      ))}
    </div>
  )
}
