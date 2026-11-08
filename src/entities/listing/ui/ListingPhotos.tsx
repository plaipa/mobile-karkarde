import { useState } from 'react'
import { usePhotos, type ListingPhoto } from '../model/photos'
import './listing-photos.css'

interface Props {
  listingId: string
  /**
   * `buyer`: only the standard-background photos (the original until it is ready).
   * `team`: the partner and the reviewers also see the original, because a flaw on the device must stay visible to them.
   */
  audience?: 'buyer' | 'team'
}

const waiting = (p: ListingPhoto) => p.state === 'pending' || p.state === 'processing'

/** A device's saved photos as a thumbnail grid; tap one to see it large with its label. */
export function ListingPhotos({ listingId, audience = 'team' }: Props) {
  const photos = usePhotos(listingId)
  const [open, setOpen] = useState<number | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  if (photos === null) return <small className="lphotos__note">در حال بارگذاری عکس‌ها…</small>
  if (photos.length === 0) return <small className="lphotos__note">عکسی برای این دستگاه ذخیره نشده است.</small>
  const current = open === null ? null : photos[open]
  const team = audience === 'team'
  const pendingCount = photos.filter(waiting).length
  const failedCount = photos.filter((p) => p.state === 'failed').length
  const shown = (p: ListingPhoto) => (!showOriginal && p.processed ? p.processed.url : p.url)
  const move = (delta: number) => setOpen((open! + photos.length + delta) % photos.length)

  return (
    <>
      <ul className="lphotos">
        {photos.map((p, i) => (
          <li key={p.name}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`نمایش بزرگ: ${p.label}`}>
              <img src={p.processed?.thumbUrl ?? p.thumbUrl} alt={p.label} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
      {team && pendingCount > 0 && <small className="lphotos__note">پس‌زمینهٔ {pendingCount} عکس در حال حذف است؛ چند دقیقهٔ دیگر دوباره سر بزنید.</small>}
      {team && failedCount > 0 && <small className="lphotos__note">پس‌زمینهٔ {failedCount} عکس حذف نشد و عکس اصلی نمایش داده می‌شود.</small>}
      {current && (
        <div className="lphotos__view" role="dialog" aria-modal="true" aria-label={current.label} onClick={() => setOpen(null)}>
          <img src={team ? shown(current) : (current.processed?.url ?? current.url)} alt={current.label} />
          <div className="lphotos__bar" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => move(-1)} aria-label="قبلی">›</button>
            <span>{current.label}</span>
            <button type="button" onClick={() => move(1)} aria-label="بعدی">‹</button>
            {team && current.processed && (
              <button type="button" onClick={() => setShowOriginal((v) => !v)}>{showOriginal ? 'پس‌زمینهٔ استاندارد' : 'عکس اصلی'}</button>
            )}
            <button type="button" className="lphotos__close" onClick={() => setOpen(null)}>بستن</button>
          </div>
        </div>
      )}
    </>
  )
}
