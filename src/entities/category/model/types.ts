export type CategoryId = 'phone' | 'watch' | 'speaker'

export interface Category {
  id: CategoryId
  title: string
  /** Rough number of devices in stock (marketing figure until the real inventory API exists). */
  count: number
  brands: string[]
  /** Accent color used by the illustrations. */
  tone: string
}
