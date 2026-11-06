export type TabIconName = 'home' | 'add' | 'cart' | 'user'

/** One drawn icon set for the bottom bar: 24px grid, 1.8 stroke, round caps (Lucide-style paths). */
const paths: Record<TabIconName, React.ReactNode> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1V9.5" />
    </>
  ),
  add: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.3" />
      <circle cx="18" cy="20" r="1.3" />
      <path d="M2.5 3.5h2.7l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L20.5 7H6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
}

export function TabIcon({ name }: { name: TabIconName }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
