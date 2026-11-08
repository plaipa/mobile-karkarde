import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { findCategory } from '@/entities/category'
import { ListingPhotos, ListingStatusChip, deletePhotos, removeListing, restoreListing, statusOf, useMyListings, type MyListing } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './my-devices.css'

const UNDO_MS = 6000
const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' })

function details(l: MyListing): string {
  const hasBattery = l.category !== 'speaker' && l.battery
  return [l.storage, l.color, hasBattery && `باتری ${toFa(l.battery)}٪`].filter(Boolean).join(' · ')
}

/** «دستگاه‌های من»: what this partner has submitted for sale, newest first. */
export function MyDevicesPage() {
  const { phone } = useSession()
  const listings = useMyListings(phone)
  const [removed, setRemoved] = useState<MyListing | null>(null)

  // The undo offer expires on its own, so the page never keeps a stale prompt.
  useEffect(() => {
    if (!removed) return
    const t = window.setTimeout(() => { void deletePhotos(removed.id); setRemoved(null) }, UNDO_MS)
    return () => window.clearTimeout(t)
  }, [removed])

  const remove = (l: MyListing) => {
    removeListing(l.id)
    setRemoved(l)
  }

  if (!phone) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">دستگاه‌های من</h1>
          <p>برای دیدن دستگاه‌هایی که ثبت کرده‌اید، ابتدا به‌عنوان همکار وارد شوید.</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">ورود همکار</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / دستگاه‌های من</nav>
      <div className="mydev__head">
        <h1 className="page__title">دستگاه‌های من</h1>
        <Link to={paths.sell} className="btn btn--primary">ثبت دستگاه</Link>
      </div>

      {listings.length === 0 ? (
        <div className="panel mydev__empty">
          <p>هنوز دستگاهی ثبت نکرده‌اید.</p>
          <p className="muted">دستگاهی که برای فروش ثبت کنید، همین‌جا با وضعیتش دیده می‌شود.</p>
          <Link to={paths.sell} className="btn btn--primary btn--lg">ثبت اولین دستگاه</Link>
        </div>
      ) : (
        <ul className="mydev">
          {listings.map((l) => (
            <li key={l.id} className="mydev__item">
              <div className="mydev__main">
                <strong>{l.model}</strong>
                <small>{[findCategory(l.category).title, l.brand, details(l)].filter(Boolean).join(' · ')}</small>
                <small className="mydev__meta">ثبت‌شده در {dateFormat.format(l.createdAt)}</small>
                <ListingPhotos listingId={l.id} />
                {l.review?.status === 'rejected' && <small className="mydev__reason">دلیل رد: {l.review.note}</small>}
              </div>
              <div className="mydev__side">
                <span className="chip chip--city-soft">{l.city}</span>
                <ListingStatusChip status={statusOf(l)} />
                <button type="button" className="mydev__remove" aria-label={`حذف ${l.model}`} onClick={() => remove(l)}>
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {removed && (
        <div className="mydev__undo" role="status">
          <span>«{removed.model}» حذف شد.</span>
          <button type="button" onClick={() => { restoreListing(removed); setRemoved(null) }}>بازگرداندن</button>
        </div>
      )}
    </div>
  )
}
