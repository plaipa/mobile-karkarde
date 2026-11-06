import { useState } from 'react'
import { toFa } from '@/shared/lib/format'
import type { Option } from '../model/filters'
import { toggle } from '../model/filters'
import './browse-products.css'

interface Props<T extends string | number> {
  options: readonly Option<T>[]
  selected: readonly T[]
  /** Text on the option; defaults to the value itself. */
  label?: (value: T) => string
  /** `grid`: short values in an even two-column grid. `list`: long names, one per row with the count at the end. */
  layout?: 'grid' | 'list'
  /** Show this many options, then a «نمایش همه» button. Selected options are always shown. */
  limit?: number
  onChange: (next: T[]) => void
}

/** Multi-select options with a per-option device count. */
export function ChipGroup<T extends string | number>({ options, selected, label = String, layout = 'grid', limit, onChange }: Props<T>) {
  const [expanded, setExpanded] = useState(false)
  const collapsed = !expanded && limit !== undefined && options.length > limit
  const visible = collapsed ? options.filter((o, i) => i < limit || selected.includes(o.value)) : options
  return (
    <>
      <div className={`opts opts--${layout}`}>
        {visible.map(({ value, count }) => {
          const on = selected.includes(value)
          return (
            <button key={value} type="button" aria-pressed={on} className={`opt${on ? ' is-on' : ''}`} onClick={() => onChange(toggle(selected, value))}>
              <span className="opt__label" dir="auto">{label(value)}</span>
              <small>{toFa(count)}</small>
            </button>
          )
        })}
      </div>
      {limit !== undefined && options.length > limit && (
        <button type="button" className="opts__more" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'نمایش کمتر' : `نمایش همه (${toFa(options.length)})`}
        </button>
      )}
    </>
  )
}
