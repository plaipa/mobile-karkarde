import type { CategoryId } from '@/entities/category'

/** A device the partner submitted for sale ("دستگاه‌های من"). Photos are not kept here: they never leave the capture screen in this prototype. */
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
}

export type NewListing = Omit<MyListing, 'id' | 'createdAt'>
