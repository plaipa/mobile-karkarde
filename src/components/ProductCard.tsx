import { Link } from 'react-router-dom'
import type { Product } from '../data'
import { useAuth } from '../lib/auth'
import { useCart } from '../lib/cart'
import { money, toFa } from '../lib/format'
import { PhoneArt } from './PhoneArt'
import { categories } from '../data'

export function PriceTag({ price }: { price: number }) {
  const { phone } = useAuth()
  if (!phone) return <Link to="/login" className="price price--locked">ورود برای دیدن قیمت</Link>
  return <span className="price">{money(price)}</span>
}

export function ProductCard({ p }: { p: Product }) {
  const cart = useCart()
  const cat = categories.find((c) => c.id === p.category)!
  const dims = p.category === 'phone' ? { w: 62, h: 122 } : { w: 70, h: 112 }
  const specs = [p.storage, p.battery ? `باتری ${toFa(p.battery)}٪` : null, p.registered ? 'رجیستر شده' : p.warranty ? 'گارانتی دارد' : null]
  return (
    <article className="card">
      <Link to={`/product/${p.code}`} className="card__img" aria-label={p.name}>
        <span className="chip chip--code">{`MK-${toFa(p.code.slice(3))}`}</span>
        <span className={`chip chip--grade chip--${p.grade}`}>گرید {p.grade}</span>
        <PhoneArt kind={p.category} tone={cat.tone} {...dims} />
      </Link>
      <div className="card__body">
        <Link to={`/product/${p.code}`} className="card__name">{p.name}</Link>
        <p className="card__specs">{specs.filter(Boolean).join(' · ')}</p>
        <div className="card__price">
          <small>قیمت همکار</small>
          <PriceTag price={p.price} />
        </div>
        <button className="btn btn--dark btn--block" onClick={() => cart.add(p.code)} disabled={cart.has(p.code)}>
          {cart.has(p.code) ? 'در سبد شما' : 'افزودن به سبد'}
        </button>
      </div>
    </article>
  )
}
