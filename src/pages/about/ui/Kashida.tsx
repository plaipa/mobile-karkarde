const TATWEEL = 'ـ'

interface Props {
  before: string
  after: string
  length?: number
}

/**
 * A word stretched with tatweel, like the «کشیده» logo. The word is ONE text run, so the letters always join
 * (splitting it into coloured spans broke the shaping in Safari and let the word wrap in two). A second copy of the
 * same run is painted in the brand colour and clipped to the stretch, so only the stretch is coloured and draws in.
 */
export function Kashida({ before, after, length = 6 }: Props) {
  const word = `${before}${TATWEEL.repeat(length)}${after}`
  return (
    <span className="kash" role="text" aria-label={before + after}>
      <span className="kash__base" aria-hidden="true">{word}</span>
      <span className="kash__ink" aria-hidden="true">{word}</span>
    </span>
  )
}
