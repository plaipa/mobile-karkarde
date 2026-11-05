import { useState } from 'react'

const OTHER = '__other__'

interface Props {
  label: React.ReactNode
  value: string
  options: readonly string[]
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  /** Hint inside the text input shown for «سایر». */
  otherPlaceholder?: string
  className?: string
}

/** A dropdown of known values with a «سایر» escape hatch that reveals a text input. */
export function ChoiceField({ label, value, options, onChange, disabled, placeholder = 'انتخاب کنید', otherPlaceholder, className }: Props) {
  const [custom, setCustom] = useState(false)
  const isCustom = custom || (value !== '' && !options.includes(value))

  return (
    <label className={className}>{label}
      <select
        className="input"
        disabled={disabled}
        value={isCustom ? OTHER : value}
        onChange={(e) => {
          const next = e.target.value
          setCustom(next === OTHER)
          onChange(next === OTHER ? '' : next)
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
        <option value={OTHER}>سایر…</option>
      </select>
      {isCustom && (
        <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={otherPlaceholder} autoFocus={custom} />
      )}
    </label>
  )
}
