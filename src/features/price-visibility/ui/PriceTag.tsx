import { Link } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { money } from '@/shared/lib/format'
import './price-tag.css'

/** Prices are for approved partners: signed-out visitors see a "sign in" link, unapproved ones a link to the application. */
export function PriceTag({ price }: { price: number }) {
  const { phone, verified } = useSession()
  if (!phone) return <Link to={paths.login} className="price price--locked">ورود برای دیدن قیمت</Link>
  if (!verified) return <Link to={paths.apply} className="price price--locked">ثبت‌نام برای دیدن قیمت</Link>
  return <span className="price">{money(price)}</span>
}
