import type { CategoryId } from '@/entities/category'

/** Cosmetic grade code (stored by the backend); show it to people with `gradeLabel`. */
export type Grade = 'A' | 'B' | 'C' | 'D'

/** `physical-esim` = one nano-SIM + eSIM, `dual` = two nano-SIM trays, `esim` = no tray at all. */
export type Sim = 'physical-esim' | 'dual' | 'esim'

export interface Product {
  /** Public listing code, e.g. `MK-2041`. The seller's identity is never part of this model. */
  code: string
  category: CategoryId
  brand: string
  name: string
  /** Storage for phones, case size for watches (display text). */
  storage?: string
  /** Phone storage in GB — the value the storage filter works on. */
  storageGb?: number
  /** Apple part-number region without the trailing `/A`, e.g. `ZA`, `CH`, `LL` (see `regions.ts`). */
  region?: string
  sim?: Sim
  /** Battery health in percent. */
  battery?: number
  grade: Grade
  /** Partner price in toman. */
  price: number
  registered: boolean
  warranty: boolean
  color: string
  addedDays: number
  notes: string
}
