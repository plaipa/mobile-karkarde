import { statusLabel } from '../model/status'
import type { ListingStatus } from '../model/types'
import './listing-status.css'

export function ListingStatusChip({ status }: { status: ListingStatus }) {
  return <span className={`chip chip--status-${status}`}>{statusLabel[status]}</span>
}
