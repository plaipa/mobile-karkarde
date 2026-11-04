import { describe, expect, it } from 'vitest'
import { parseMillions, showMillions } from './million'

describe('parseMillions', () => {
  it('reads Persian and Latin digits as millions of toman', () => {
    expect(parseMillions('۵۰')).toBe(50_000_000)
    expect(parseMillions('12.5')).toBe(12_500_000)
    expect(parseMillions('۱۲٫۵')).toBe(12_500_000)
  })

  it('returns null for empty, zero or non-numeric text', () => {
    expect(parseMillions('')).toBeNull()
    expect(parseMillions('0')).toBeNull()
    expect(parseMillions('abc')).toBeNull()
  })
})

describe('showMillions', () => {
  it('round-trips with Persian digits', () => {
    expect(showMillions(null)).toBe('')
    expect(parseMillions(showMillions(45_000_000))).toBe(45_000_000)
  })
})
