import { Link } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { money } from '@/shared/lib/format'
import './price-tag.css'

/** Prices are partner-only: signed-out visitors see a "sign in" link instead. */
export function PriceTag({ price }: { price: number }) {
  const { phone } = useSession()
  if (!phone) return <Link to={paths.login} className="price price--locked">ورود برای دیدن قیمت</Link>
  return <span className="price">{money(price)}</span>
}
