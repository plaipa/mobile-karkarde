import { defaultCity } from '@/shared/config/cities'

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
  /** Where the device is; the seller can change it per listing. */
  city: string
  brand: string
  model: string
  storage: string
  battery: string
  /** Battery cycle count; asked only for phones at 100% health. */
  batteryCycles: string
  imei: string
  color: string
  notes: string
  /** Seller confirms iCloud / Google / Samsung account lock is off. */
  unlocked: boolean
}

export const emptyListingForm: ListingForm = {
  city: defaultCity,
  brand: '',
  model: '',
  storage: '',
  battery: '',
  batteryCycles: '',
  imei: '',
  color: '',
  notes: '',
  unlocked: false,
}
