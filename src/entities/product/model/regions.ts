import type { Sim } from './types'

/**
 * Apple region codes (the letters before `/A` in the model number, e.g. MG6K3ZA/A → `ZA`).
 * Ordered by how often Iranian partners ask for them.
 */
export const regions: readonly { code: string; label: string }[] = [
  { code: 'AE', label: 'امارات' },
  { code: 'ZD', label: 'امارات (ZD)' },
  { code: 'CH', label: 'چین' },
  { code: 'ZA', label: 'سنگاپور' },
  { code: 'LL', label: 'آمریکا' },
  { code: 'ZP', label: 'هنگ‌کنگ' },
  { code: 'J', label: 'ژاپن' },
  { code: 'KH', label: 'کره' },
  { code: 'HN', label: 'هند' },
  { code: 'B', label: 'انگلیس' },
  { code: 'TU', label: 'ترکیه' },
]

export const regionLabel = (code: string) => regions.find((r) => r.code === code)?.label ?? code

/** `ZA` → `ZA/A`, the way partners write it. */
export const regionCode = (code: string) => `${code}/A`

export const simLabels: Record<Sim, string> = {
  'physical-esim': 'سیم + eSIM',
  dual: 'دو سیم فیزیکی',
  esim: 'فقط eSIM',
}

export const simOrder: readonly Sim[] = ['physical-esim', 'dual', 'esim']
