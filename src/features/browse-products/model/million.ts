import { toEn, toFa } from '@/shared/lib/format'

const MILLION = 1_000_000

/** "۱۲٫۵" typed in millions of toman → toman (`null` when empty or not a positive number). */
export function parseMillions(text: string): number | null {
  const n = parseFloat(toEn(text).replace('٫', '.'))
  return Number.isFinite(n) && n > 0 ? Math.round(n * MILLION) : null
}

/** Toman → the text shown in the input, in millions with Persian digits. */
export const showMillions = (toman: number | null) => (toman === null ? '' : toFa(toman / MILLION))
