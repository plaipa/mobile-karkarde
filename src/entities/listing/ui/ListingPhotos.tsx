import { useState } from 'react'
import { usePhotos } from '../model/photos'
import './listing-photos.css'

/** A device's saved photos as a thumbnail grid; tap one to see it large with its label. */
export function ListingPhotos({ listingId }: { listingId: string }) {
  const photos = usePhotos(listingId)
  const [open, setOpen] = useState<number | null>(null)
  if (photos === null) return <small className="lphotos__note">در حال بارگذاری عکس‌ها…</small>
  if (photos.length === 0) return <small className="lphotos__note">عکسی برای این دستگاه ذخیره نشده است.</small>
  const current = open === null ? null : photos[open]
  return (
    <>
      <ul className="lphotos">
        {photos.map((p, i) => (
          <li key={p.name}>
            <button type="button" onClick={() => setOpen(i)} aria-label={`نمایش بزرگ: ${p.label}`}>
              <img src={p.url} alt={p.label} loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
      {current && (
        <div className="lphotos__view" role="dialog" aria-modal="true" aria-label={current.label} onClick={() => setOpen(null)}>
          <img src={current.url} alt={current.label} />
          <div className="lphotos__bar" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setOpen((open! + photos.length - 1) % photos.length)} aria-label="قبلی">›</button>
            <span>{current.label}</span>
            <button type="button" onClick={() => setOpen((open! + 1) % photos.length)} aria-label="بعدی">‹</button>
            <button type="button" className="lphotos__close" onClick={() => setOpen(null)}>بستن</button>
          </div>
        </div>
      )}
    </>
  )
}
