import { toFa } from '@/shared/lib/format'
import type { Option } from '../model/filters'
import { toggle } from '../model/filters'
import './browse-products.css'

interface Props<T extends string | number> {
  options: readonly Option<T>[]
  selected: readonly T[]
  /** Text on the chip; defaults to the value itself. */
  label?: (value: T) => string
  onChange: (next: T[]) => void
}

/** Multi-select chips with a per-option device count. */
export function ChipGroup<T extends string | number>({ options, selected, label = String, onChange }: Props<T>) {
  return (
    <div className="chips chips--scroll">
      {options.map(({ value, count }) => (
        <button
          key={value}
          type="button"
          aria-pressed={selected.includes(value)}
          className={`pick${selected.includes(value) ? ' is-on' : ''}`}
          onClick={() => onChange(toggle(selected, value))}
        >
          {label(value)} <small>{toFa(count)}</small>
        </button>
      ))}
    </div>
  )
}
