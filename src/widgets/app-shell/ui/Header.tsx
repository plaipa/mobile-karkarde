import { Link, NavLink } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { useCart } from '@/features/cart'
import { SupportButton } from '@/features/contact-support'
import { TextSizeToggle } from '@/features/text-size'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { mainNav } from '../model/navigation'
import { Logo } from './Logo'

export function Header({ dark }: { dark: boolean }) {
  const { phone } = useSession()
  const cart = useCart()
  return (
    <header className={`header${dark ? ' header--dark' : ''}`}>
      <div className="container header__row">
        <Logo dark={dark} />
        <nav className="header__nav" aria-label="منوی اصلی">
          {mainNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="header__actions">
          <SupportButton extras={<TextSizeToggle />} />
          <Link to={paths.cart} className="btn btn--outline header__cart">سبد خرید{cart.codes.length ? ` (${toFa(cart.codes.length)})` : ''}</Link>
          {phone
            ? <Link to={paths.sell} className="btn btn--primary">ثبت دستگاه</Link>
            : <Link to={paths.login} className="btn btn--primary">ورود همکار</Link>}
        </div>
      </div>
    </header>
  )
}
