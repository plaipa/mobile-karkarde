import { useId } from 'react'
import type { CategoryId } from '../model/types'

interface Props {
  kind?: CategoryId
  w?: number
  h?: number
  tone?: string
  tilt?: number
  className?: string
}

const BODY = '#2B2C30'
const SCREEN_DARK = '#111214'

/**
 * Vector placeholder until real photos exist.
 * Real listings replace this with the processed product photo.
 */
export function DeviceArt({ kind = 'phone', w = 84, h = 164, tone = 'var(--primary)', tilt = 0, className }: Props) {
  const gradientId = `g${useId().replace(/:/g, '')}`
  const style = tilt ? { transform: `rotate(${tilt}deg)` } : undefined
  const common = { className, style, width: w, height: h, 'aria-hidden': true } as const

  const defs = (
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" style={{ stopColor: tone }} />
        <stop offset="1" stopColor={SCREEN_DARK} />
      </linearGradient>
    </defs>
  )
  const screen = `url(#${gradientId})`

  if (kind === 'watch') {
    return (
      <svg {...common} viewBox="0 0 100 160">
        {defs}
        <rect x="30" y="0" width="40" height="160" rx="10" fill={BODY} />
        <rect x="12" y="38" width="76" height="84" rx="24" fill={BODY} />
        <rect x="17" y="43" width="66" height="74" rx="20" fill={screen} />
        <rect x="88" y="66" width="5" height="22" rx="2.5" fill="#1B1C1F" />
      </svg>
    )
  }

  if (kind === 'speaker') {
    return (
      <svg {...common} viewBox="0 0 100 160">
        {defs}
        <rect x="8" y="14" width="84" height="132" rx="34" fill={BODY} />
        <rect x="14" y="20" width="72" height="120" rx="29" fill={screen} />
        {[0, 1, 2, 3, 4].map((row) =>
          [0, 1, 2].map((col) => <circle key={`${row}${col}`} cx={36 + col * 14} cy={48 + row * 16} r="3" fill={SCREEN_DARK} opacity=".55" />),
        )}
      </svg>
    )
  }

  return (
    <svg {...common} viewBox="0 0 100 196">
      {defs}
      <rect x="2" y="2" width="96" height="192" rx="20" fill={BODY} />
      <rect x="6" y="6" width="88" height="184" rx="17" fill={screen} />
      <circle cx="50" cy="16" r="4.5" fill={SCREEN_DARK} />
    </svg>
  )
}
