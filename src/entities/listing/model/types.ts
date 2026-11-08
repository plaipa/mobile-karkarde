import type { CategoryId } from '@/entities/category'

export type ListingStatus = 'pending' | 'approved' | 'rejected'

/** A کارشناس's decision on a device. */
export interface Review {
  status: Exclude<ListingStatus, 'pending'>
  /** Reason for a rejection (required) or a remark on approval (optional). */
  note: string
  /** The reviewer's mobile number. */
  by: string
  at: number
}

/** What the کارشناس sets when approving; this is what buyers see in the price list. */
export interface Publication {
  grade: 'A' | 'B' | 'C' | 'D'
  /** Toman. */
  price: number
  region?: string
  sim?: 'physical-esim' | 'dual' | 'esim'
  registered: boolean
  warranty: boolean
}

/** A device a partner submitted for sale ("دستگاه‌های من"). */
export interface MyListing {
  id: string
  /** Public listing code (MK-5001…), also the product code once published. */
  code: string
  /** Owner's mobile number. */
  phone: string
  category: CategoryId
  brand: string
  model: string
  storage: string
  battery: string
  /** Battery cycle count (phones at 100% health only). */
  batteryCycles?: number
  color: string
  city: string
  notes: string
  createdAt: number
  /** Absent until a کارشناس decides. */
  review?: Review
  /** Present once approved. */
  publication?: Publication
}

export type NewListing = Omit<MyListing, 'id' | 'code' | 'createdAt' | 'review' | 'publication'>

export type ReviewInput =
  | ({ status: 'approved'; note: string } & Publication)
  | { status: 'rejected'; note: string }
