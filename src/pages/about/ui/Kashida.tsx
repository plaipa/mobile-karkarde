const TATWEEL = 'ـ'

/**
 * A word stretched with tatweel, like the «کشیده» logo: the stretch is painted in the brand colour and draws in.
 * Only the colour changes inside the word, so the letters stay joined.
 */
export function Kashida({ before, after, length = 6 }: { before: string; after: string; length?: number }) {
  return (
    <span className="kash">
      {before}
      <span className="kash__line">{TATWEEL.repeat(length)}</span>
      {after}
    </span>
  )
}
