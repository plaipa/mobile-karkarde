import { useSession } from '@/entities/session'
import { money } from '@/shared/lib/format'
import { PriceTag } from './PriceTag'

/** Plain text price for table cells; falls back to the locked tag when signed out. */
export function PriceCell({ price }: { price: number }) {
  const { phone } = useSession()
  return phone ? <>{money(price)}</> : <PriceTag price={price} />
}
