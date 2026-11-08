import type { ListingStatus, MyListing } from './types'

export const statusOf = (l: MyListing): ListingStatus => l.review?.status ?? 'pending'

export const statusLabel: Record<ListingStatus, string> = {
  pending: 'در انتظار بازرسی',
  approved: 'تأیید شده',
  rejected: 'رد شده',
}
