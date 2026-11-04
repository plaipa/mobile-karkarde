import { NavLink } from 'react-router-dom'
import { useCart } from '@/features/cart'
import { toFa } from '@/shared/lib/format'
import { mobileTabs } from '../model/navigation'

/** Bottom navigation, visible on phones only (see app-shell.css). */
export function TabBar() {
  const cart = useCart()
  return (
    <nav className="tabbar" aria-label="ناوبری موبایل">
      {mobileTabs.map((tab) => {
        const badge = tab.showCartBadge ? cart.codes.length : 0
        return (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `tabbar__item${isActive ? ' is-active' : ''}`}>
            <span className="tabbar__icon">{tab.icon}{badge ? <b>{toFa(badge)}</b> : null}</span>
            <span>{tab.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
