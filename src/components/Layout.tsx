import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../lib/auth'
import { useCart } from '../lib/cart'
import { toFa } from '../lib/format'

const nav = [
  { to: '/', label: 'خانه', end: true },
  { to: '/products', label: 'محصولات' },
  { to: '/products?cat=phone', label: 'موبایل' },
  { to: '/products?cat=watch', label: 'ساعت هوشمند' },
  { to: '/products?cat=speaker', label: 'اسپیکر' },
  { to: '/about', label: 'دربارهٔ ما' },
]

function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link to="/" className={`logo${dark ? ' logo--dark' : ''}`} aria-label="موبایل کارکرده">
      <span className="logo__mark"><i /></span>
      <span className="logo__text">موبایل کارکرده</span>
    </Link>
  )
}

function Header({ dark }: { dark: boolean }) {
  const { phone } = useAuth()
  const cart = useCart()
  return (
    <header className={`header${dark ? ' header--dark' : ''}`}>
      <div className="container header__row">
        <Logo dark={dark} />
        <nav className="header__nav" aria-label="منوی اصلی">
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive && !n.to.includes('?') ? 'is-active' : '')}>{n.label}</NavLink>
          ))}
        </nav>
        <div className="header__actions">
          <Link to="/cart" className="btn btn--outline">سبد خرید{cart.codes.length ? ` (${toFa(cart.codes.length)})` : ''}</Link>
          {phone ? <Link to="/upload" className="btn btn--primary">ثبت دستگاه</Link> : <Link to="/login" className="btn btn--primary">ورود همکار</Link>}
        </div>
      </div>
    </header>
  )
}

function TabBar() {
  const cart = useCart()
  const tabs = [
    { to: '/', label: 'خانه', icon: '⌂', end: true },
    { to: '/products', label: 'محصولات', icon: '▦' },
    { to: '/upload', label: 'ثبت دستگاه', icon: '＋' },
    { to: '/cart', label: 'سبد', icon: '🛒', badge: cart.codes.length },
    { to: '/login', label: 'پنل', icon: '◉' },
  ]
  return (
    <nav className="tabbar" aria-label="ناوبری موبایل">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.end} className={({ isActive }) => `tabbar__item${isActive ? ' is-active' : ''}`}>
          <span className="tabbar__icon">{t.icon}{t.badge ? <b>{toFa(t.badge)}</b> : null}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <span>© ۱۴۰۵ موبایل کارکرده — همهٔ حقوق محفوظ است</span>
        <span><Link to="/about">دربارهٔ ما</Link> · شرایط استفاده · حریم خصوصی</span>
      </div>
    </footer>
  )
}

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  const dark = pathname === '/about'
  return (
    <div className={`app${dark ? ' app--dark' : ''}`}>
      <Header dark={dark} />
      <main><Outlet /></main>
      <Footer />
      <TabBar />
    </div>
  )
}
