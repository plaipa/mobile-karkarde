import { useId } from 'react'
import type { CategoryId } from '../data'

interface Props {
  kind?: CategoryId
  w?: number
  h?: number
  tone?: string
  tilt?: number
  className?: string
}

// Vector placeholder until real photos exist. Real listings replace this with the processed product photo.
export function PhoneArt({ kind = 'phone', w = 84, h = 164, tone = '#2F5BFF', tilt = 0, className }: Props) {
  const id = useId()
  const gid = `g${id.replace(/:/g, '')}`
  const style = tilt ? { transform: `rotate(${tilt}deg)` } : undefined
  const defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tone} />
        <stop offset="1" stopColor="#0B1020" />
      </linearGradient>
    </defs>
  )
  if (kind === 'watch') {
    return (
      <svg className={className} style={style} width={w} height={h} viewBox="0 0 100 160" aria-hidden="true">
        {defs}
        <rect x="30" y="0" width="40" height="160" rx="10" fill="#222A42" />
        <rect x="12" y="38" width="76" height="84" rx="24" fill="#222A42" />
        <rect x="17" y="43" width="66" height="74" rx="20" fill={`url(#${gid})`} />
        <rect x="88" y="66" width="5" height="22" rx="2.5" fill="#151B2E" />
      </svg>
    )
  }
  if (kind === 'speaker') {
    return (
      <svg className={className} style={style} width={w} height={h} viewBox="0 0 100 160" aria-hidden="true">
        {defs}
        <rect x="8" y="14" width="84" height="132" rx="34" fill="#222A42" />
        <rect x="14" y="20" width="72" height="120" rx="29" fill={`url(#${gid})`} />
        {[0, 1, 2, 3, 4].map((r) =>
          [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={36 + c * 14} cy={48 + r * 16} r="3" fill="#0B1020" opacity=".55" />),
        )}
      </svg>
    )
  }
  return (
    <svg className={className} style={style} width={w} height={h} viewBox="0 0 100 196" aria-hidden="true">
      {defs}
      <rect x="2" y="2" width="96" height="192" rx="20" fill="#222A42" />
      <rect x="6" y="6" width="88" height="184" rx="17" fill={`url(#${gid})`} />
      <circle cx="50" cy="16" r="4.5" fill="#0B1020" />
    </svg>
  )
}
