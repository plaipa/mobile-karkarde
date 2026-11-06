import { NavLink, useLocation } from 'react-router-dom'
import { useCart } from '@/features/cart'
import { toFa } from '@/shared/lib/format'
import { isNavActive, mobileTabs } from '../model/navigation'
import { TabIcon } from './TabIcon'

/** Bottom navigation, visible on phones only (see app-shell.css). */
export function TabBar() {
  const cart = useCart()
  const { pathname } = useLocation()
  return (
    <nav className="tabbar" aria-label="ناوبری موبایل">
      {mobileTabs.map((tab) => {
        const badge = tab.showCartBadge ? cart.codes.length : 0
        return (
          <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ isActive }) => `tabbar__item${isNavActive(tab, pathname, isActive) ? ' is-active' : ''}`}>
            <span className="tabbar__icon"><TabIcon name={tab.icon} />{badge ? <b>{toFa(badge)}</b> : null}</span>
            <span>{tab.label}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
