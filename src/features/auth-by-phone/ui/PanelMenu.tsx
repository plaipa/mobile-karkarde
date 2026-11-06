import { Link } from 'react-router-dom'
import { toFa } from '@/shared/lib/format'
import './panel-menu.css'

export interface PanelMenuItem {
  to: string
  label: string
  hint?: string
  badge?: number
}

/** A vertical list of big tap targets — the panel's table of contents. */
export function PanelMenu({ items }: { items: readonly PanelMenuItem[] }) {
  return (
    <nav className="pmenu" aria-label="بخش‌های پنل">
      {items.map((item) => (
        <Link key={item.to} to={item.to} className="pmenu__item">
          <span className="pmenu__text">
            <b>{item.label}</b>
            {item.hint && <small>{item.hint}</small>}
          </span>
          {item.badge !== undefined && <span className="pmenu__badge">{toFa(item.badge)}</span>}
          <span className="pmenu__chev" aria-hidden="true">‹</span>
        </Link>
      ))}
    </nav>
  )
}
