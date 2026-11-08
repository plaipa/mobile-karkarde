import type { CategoryId } from '@/entities/category'

/** A device the partner submitted for sale ("دستگاه‌های من"). Photos are not kept here: they never leave the capture screen in this prototype. */
export type ListingStatus = 'pending' | 'approved' | 'rejected'

/** An inspector's decision on a device. */
export interface Review {
  status: Exclude<ListingStatus, 'pending'>
  /** Reason for a rejection (required) or a remark on approval (optional). */
  note: string
  /** Inspector's mobile number. */
  by: string
  at: number
}

export interface MyListing {
  id: string
  /** Owner's mobile number; the list is filtered by it so partners sharing a browser don't see each other's devices. */
  phone: string
  category: CategoryId
  brand: string
  model: string
  storage: string
  battery: string
  color: string
  city: string
  notes: string
  createdAt: number
  /** Absent until an inspector decides; devices saved before inspection existed are simply pending. */
  review?: Review
}

export type NewListing = Omit<MyListing, 'id' | 'createdAt' | 'review'>
