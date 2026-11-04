export type GuideShape = 'tall' | 'wide' | 'edgeH' | 'edgeV' | 'square' | 'watch' | 'speaker' | 'free'

export interface PhotoSlot {
  id: string
  label: string
  hint: string
  required: boolean
  /** Outline drawn over the camera preview so every seller frames the device the same way. */
  shape: GuideShape
  /** Screenshots (battery / storage) come from the gallery, not the camera. */
  screenshot?: boolean
}

export interface ListingForm {
  brand: string
  model: string
  storage: string
  battery: string
  imei: string
  color: string
  notes: string
  /** Seller confirms iCloud / Google / Samsung account lock is off. */
  unlocked: boolean
}

export const emptyListingForm: ListingForm = {
  brand: '',
  model: '',
  storage: '',
  battery: '',
  imei: '',
  color: '',
  notes: '',
  unlocked: false,
}
