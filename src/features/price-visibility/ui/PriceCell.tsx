import { useSession } from '@/entities/session'
import { money } from '@/shared/lib/format'
import './price-tag.css'

/**
 * Plain text price for table cells. Signed out it shows a quiet lock instead of a sign-in link on every row:
 * the page explains once, above the list, how to see prices.
 */
export function PriceCell({ price }: { price: number }) {
  const { verified } = useSession()
  if (verified) return <>{money(price)}</>
  return (
    <span className="price-lock" title="قیمت فقط برای همکاران تأییدشده">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <rect x="4" y="10.5" width="16" height="10.5" rx="2.5" />
        <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      </svg>
      مخصوص همکار
    </span>
  )
}
