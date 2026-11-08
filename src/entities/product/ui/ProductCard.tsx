import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { findCategory, DeviceArt } from '@/entities/category'
import { paths } from '@/shared/config/routes'
import { summarizeSpecs } from '../lib/describe'
import { gradeLabel } from '../model/grades'
import type { Product } from '../model/types'
import './product-card.css'

interface Props {
  product: Product
  /** Rendered under "partner price" — injected so this entity does not depend on auth. */
  price: ReactNode
  /** Rendered at the bottom of the card (e.g. add-to-cart button). */
  action?: ReactNode
}

export function ProductCard({ product: p, price, action }: Props) {
  const category = findCategory(p.category)
  const size = p.category === 'phone' ? { w: 62, h: 122 } : { w: 70, h: 112 }
  const href = paths.product(p.code)
  return (
    <article className="card">
      <Link to={href} className="card__img" aria-label={p.name}>
        <span className={`chip chip--grade chip--${p.grade}`}>{gradeLabel[p.grade]}</span>
        <DeviceArt kind={p.category} tone={category.tone} {...size} />
      </Link>
      <div className="card__body">
        <Link to={href} className="card__name">{p.name}</Link>
        <p className="card__specs">{summarizeSpecs(p)}</p>
        <div className="card__price">
          <small>قیمت همکار</small>
          {price}
        </div>
        {action}
      </div>
    </article>
  )
}
