import { paths } from '@/shared/config/routes'

export interface NavItem {
  to: string
  label: string
  /** Match the exact path only (used for "/"). */
  end?: boolean
  /** Other paths that also highlight this item (the price list lives under «خانه»). */
  alsoActiveOn?: readonly string[]
}

/** Whether a nav item should be highlighted for the current path. */
export function isNavActive(item: NavItem, pathname: string, routerActive: boolean) {
  return routerActive || (item.alsoActiveOn?.some((p) => pathname.startsWith(p)) ?? false)
}

export const mainNav: readonly NavItem[] = [
  { to: paths.home, label: 'خانه', end: true, alsoActiveOn: [paths.catalog] },
  { to: paths.about, label: 'دربارهٔ ما' },
]

export interface TabItem extends NavItem {
  icon: string
  /** Show the cart counter on this tab. */
  showCartBadge?: boolean
}

export const mobileTabs: readonly TabItem[] = [
  { to: paths.home, label: 'خانه', icon: '⌂', end: true, alsoActiveOn: [paths.catalog] },
  { to: paths.sell, label: 'ثبت دستگاه', icon: '＋' },
  { to: paths.about, label: 'دربارهٔ ما', icon: 'ⓘ' },
  { to: paths.cart, label: 'سبد خرید', icon: '🛒', showCartBadge: true },
  { to: paths.login, label: 'پنل', icon: '◉' },
]

/** The About page uses the dark theme. */
export const darkPaths: readonly string[] = [paths.about]
