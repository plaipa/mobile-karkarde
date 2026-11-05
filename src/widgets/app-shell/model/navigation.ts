import { paths } from '@/shared/config/routes'

export interface NavItem {
  to: string
  label: string
  /** Match the exact path only (used for "/"). */
  end?: boolean
}

export const mainNav: readonly NavItem[] = [
  { to: paths.home, label: 'خانه', end: true },
  { to: paths.catalog, label: 'لیست قیمت' },
  { to: paths.about, label: 'دربارهٔ ما' },
]

export interface TabItem extends NavItem {
  icon: string
  /** Show the cart counter on this tab. */
  showCartBadge?: boolean
}

export const mobileTabs: readonly TabItem[] = [
  { to: paths.home, label: 'خانه', icon: '⌂', end: true },
  { to: paths.catalog, label: 'لیست قیمت', icon: '▦' },
  { to: paths.sell, label: 'ثبت دستگاه', icon: '＋' },
  { to: paths.cart, label: 'سبد خرید', icon: '🛒', showCartBadge: true },
  { to: paths.login, label: 'پنل', icon: '◉' },
]

/** The About page uses the dark theme. */
export const darkPaths: readonly string[] = [paths.about]
