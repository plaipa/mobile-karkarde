import './tabs.css'

interface Props<T extends string> {
  items: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}

/** Pill tabs (ARIA tablist). The panel below is rendered by the caller. */
export function Tabs<T extends string>({ items, value, onChange }: Props<T>) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          role="tab"
          aria-selected={item.id === value}
          className={`tab${item.id === value ? ' is-on' : ''}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
