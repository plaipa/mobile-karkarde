import { Link } from 'react-router-dom'
import { buildSpecRows, gradeInfo, gradeLabel, type Product } from '@/entities/product'
import { AddToCartButton } from '@/features/cart'
import { PriceTag } from '@/features/price-visibility'
import { paths } from '@/shared/config/routes'
import './product-details.css'

export function ProductInfo({ product: p }: { product: Product }) {
  return (
    <div className="pdp__info">
      <div className="chips">
        <span className="chip chip--soft">{p.brand}</span>
        <span className={`chip chip--${p.grade}`}>{gradeLabel[p.grade]}</span>
      </div>
      <h1>{p.name}</h1>
      <p className="muted">{p.color} · {p.notes}</p>
      <dl className="specs">{buildSpecRows(p).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <div className="buybox">
        <small>قیمت همکار</small>
        <PriceTag price={p.price} />
        <div className="btn-row">
          <AddToCartButton code={p.code} className="btn btn--primary btn--lg" />
          <Link to={paths.cart} className="btn btn--outline btn--lg">مشاهدهٔ سبد</Link>
        </div>
      </div>
      <p className="callout">🔒 اطلاعات فروشنده نزد ما محفوظ است. سفارش از طریق موبایل کارکرده هماهنگ می‌شود.</p>
      <p className="muted small">{gradeInfo[p.grade]}</p>
    </div>
  )
}
