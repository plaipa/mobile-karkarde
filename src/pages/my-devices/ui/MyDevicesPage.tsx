import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { findCategory } from '@/entities/category'
import { ListingPhotos, ListingStatusChip, removeListing, restoreListing, statusOf, useMyListings, type MyListing } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import './my-devices.css'

type Filter = 'all' | 'pending' | 'approved' | 'rejected'
const UNDO_MS = 6000
const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' })

function details(l: MyListing): string {
  const hasBattery = l.category !== 'speaker' && l.battery
  const cycles = l.batteryCycles !== undefined && `${toFa(l.batteryCycles)} سایکل`
  return [l.storage, l.color, hasBattery && `باتری ${toFa(l.battery)}٪`, cycles].filter(Boolean).join(' · ')
}

/** «دستگاه‌های من»: what this partner has submitted for sale, newest first. */
export function MyDevicesPage() {
  const { phone } = useSession()
  const listings = useMyListings(phone)
  const [removed, setRemoved] = useState<MyListing | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const counts = {
    pending: listings.filter((l) => statusOf(l) === 'pending').length,
    approved: listings.filter((l) => statusOf(l) === 'approved').length,
    rejected: listings.filter((l) => statusOf(l) === 'rejected').length,
  }
  const shown = filter === 'all' ? listings : listings.filter((l) => statusOf(l) === filter)

  // The undo offer expires on its own, so the page never keeps a stale prompt.
  useEffect(() => {
    if (!removed) return
    const t = window.setTimeout(() => setRemoved(null), UNDO_MS)
    return () => window.clearTimeout(t)
  }, [removed])

  const remove = (l: MyListing) => {
    void removeListing(l.id)
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

      {listings.length > 0 && (
        <Tabs
          items={[
            { id: 'all' as const, label: `همه (${toFa(listings.length)})` },
            { id: 'pending' as const, label: `در انتظار (${toFa(counts.pending)})` },
            { id: 'approved' as const, label: `منتشر شده (${toFa(counts.approved)})` },
            { id: 'rejected' as const, label: `رد شده (${toFa(counts.rejected)})` },
          ]}
          value={filter}
          onChange={setFilter}
        />
      )}

      {listings.length === 0 ? (
        <div className="panel mydev__empty">
          <p>هنوز دستگاهی ثبت نکرده‌اید.</p>
          <p className="muted">دستگاهی که برای فروش ثبت کنید، همین‌جا با وضعیتش دیده می‌شود.</p>
          <Link to={paths.sell} className="btn btn--primary btn--lg">ثبت اولین دستگاه</Link>
        </div>
      ) : (
        shown.length === 0 ? (
          <div className="panel"><p>دستگاهی با این وضعیت ندارید.</p></div>
        ) : (
        <ul className="mydev">
          {shown.map((l) => (
            <li key={l.id} className="mydev__item">
              <div className="mydev__main">
                <strong>{l.model}</strong>
                <small>{[findCategory(l.category).title, l.brand, details(l)].filter(Boolean).join(' · ')}</small>
                <small className="mydev__meta">کد {l.code} · ثبت‌شده در {dateFormat.format(l.createdAt)}</small>
                {l.publication && <small className="mydev__meta">قیمت منتشرشده: {toFa(l.publication.price.toLocaleString('en'))} تومان · <Link to={paths.product(l.code)}>دیدن در لیست قیمت</Link></small>}
                <ListingPhotos listingId={l.id} />
                {l.review?.status === 'rejected' && <small className="mydev__reason">دلیل رد: {l.review.note}</small>}
                {l.review?.status === 'approved' && l.review.note && <small className="mydev__meta">یادداشت کارشناس: {l.review.note}</small>}
                {l.review?.status === 'rejected' && (
                  <Link to={paths.sellFrom(l.id)} className="btn btn--outline btn--sm mydev__again">اصلاح و ثبت دوباره</Link>
                )}
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
        )
      )}

      {removed && (
        <div className="mydev__undo" role="status">
          <span>«{removed.model}» حذف شد.</span>
          <button type="button" onClick={() => { void restoreListing(removed.id); setRemoved(null) }}>بازگرداندن</button>
        </div>
      )}
    </div>
  )
}
