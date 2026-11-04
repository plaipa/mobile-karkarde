import { useState } from 'react'
import { parseMillions, showMillions } from '../model/million'
import './browse-products.css'

interface Props {
  value: number | null
  placeholder: string
  label: string
  onChange: (toman: number | null) => void
}

/** Text input for a price in millions of toman. Keeps what the user typed, but follows outside resets. */
export function MillionInput({ value, placeholder, label, onChange }: Props) {
  const [text, setText] = useState(showMillions(value))
  const [seen, setSeen] = useState(value)
  if (value !== seen) {
    setSeen(value)
    if (value !== parseMillions(text)) setText(showMillions(value))
  }
  return (
    <input
      className="input"
      inputMode="decimal"
      placeholder={placeholder}
      aria-label={label}
      value={text}
      onChange={(e) => {
        const next = parseMillions(e.target.value)
        setText(e.target.value)
        setSeen(next)
        onChange(next)
      }}
    />
  )
}
