import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findCategory } from '@/entities/category'
import { ListingPhotos, ListingStatusChip, reviewListing, statusOf, useAllListings, type MyListing } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { useRole } from '@/entities/staff'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import './inspector.css'

type View = 'queue' | 'done'
const tabs = [
  { id: 'queue' as const, label: 'در انتظار بازرسی' },
  { id: 'done' as const, label: 'بررسی‌شده' },
]
const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })

function summary(l: MyListing): string {
  const battery = l.category !== 'speaker' && l.battery ? `باتری ${toFa(l.battery)}٪` : ''
  return [findCategory(l.category).title, l.brand, l.storage, l.color, battery, l.city].filter(Boolean).join(' · ')
}

/** One device and the inspector's decision on it. Rejecting needs a reason the partner will read. */
function ReviewCard({ listing, reviewer }: { listing: MyListing; reviewer: string }) {
  const status = statusOf(listing)
  const [rejecting, setRejecting] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const approve = () => reviewListing(listing.id, { status: 'approved', note: '', by: reviewer, at: Date.now() })
  const reject = () => {
    if (!note.trim()) {
      setError('دلیل رد را بنویسید تا همکار بداند چه چیزی را اصلاح کند.')
      return
    }
    reviewListing(listing.id, { status: 'rejected', note: note.trim(), by: reviewer, at: Date.now() })
  }

  return (
    <li className="insp__item">
      <div className="insp__head">
        <strong>{listing.model}</strong>
        <ListingStatusChip status={status} />
      </div>
      <small>{summary(listing)}</small>
      {listing.notes && <p className="insp__notes">توضیح فروشنده: {listing.notes}</p>}
      <ListingPhotos listingId={listing.id} />
      <small className="insp__meta">همکار: <b dir="ltr">{toFa(listing.phone)}</b> · ثبت در {dateFormat.format(listing.createdAt)}</small>

      {listing.review ? (
        <>
          <small className="insp__meta">
            {listing.review.status === 'approved' ? 'تأیید' : 'رد'} توسط <b dir="ltr">{toFa(listing.review.by)}</b> در {dateFormat.format(listing.review.at)}
            {listing.review.note && ` — ${listing.review.note}`}
          </small>
          <div className="insp__actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => reviewListing(listing.id, undefined)}>بازگرداندن به صف</button>
          </div>
        </>
      ) : rejecting ? (
        <div className="insp__reject">
          <label>
            دلیل رد
            <textarea className="input" rows={3} value={note} onChange={(e) => { setNote(e.target.value); setError('') }} placeholder="مثلاً: عکس لبهٔ پایین تار است" autoFocus />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <div className="insp__actions">
            <button type="button" className="btn btn--primary btn--sm" onClick={reject}>ثبت رد</button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => { setRejecting(false); setError('') }}>انصراف</button>
          </div>
        </div>
      ) : (
        <div className="insp__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={approve}>تأیید دستگاه</button>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setRejecting(true)}>رد کردن</button>
        </div>
      )}
    </li>
  )
}

/** «پنل کارشناس»: the queue of submitted devices; inspectors (and admins) approve or reject them. */
export function InspectorPage() {
  const { phone } = useSession()
  const role = useRole(phone)
  const all = useAllListings()
  const [view, setView] = useState<View>('queue')

  if (role !== 'inspector' && role !== 'admin') {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">پنل کارشناس</h1>
          <p>{phone ? 'این بخش فقط برای کارشناس‌هاست. اگر باید کارشناس باشید، از مدیر سایت بخواهید شمارهٔ شما را اضافه کند.' : 'برای ورود به این بخش ابتدا وارد شوید.'}</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">{phone ? 'بازگشت به پنل' : 'ورود'}</Link>
        </div>
      </div>
    )
  }

  const queue = all.filter((l) => statusOf(l) === 'pending')
  const done = all.filter((l) => statusOf(l) !== 'pending').sort((a, b) => (b.review?.at ?? 0) - (a.review?.at ?? 0))
  const shown = view === 'queue' ? queue : done

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / پنل کارشناس</nav>
      <h1 className="page__title">پنل کارشناس</h1>
      <p className="muted">{toFa(queue.length)} دستگاه منتظر بازرسی است. بعد از تأیید، دستگاه برای انتشار آماده می‌شود؛ با رد، دلیل آن برای همکار نمایش داده می‌شود.</p>
      <Tabs items={tabs} value={view} onChange={setView} />
      {shown.length === 0 ? (
        <div className="panel"><p>{view === 'queue' ? 'دستگاهی در انتظار بازرسی نیست.' : 'هنوز دستگاهی بررسی نشده است.'}</p></div>
      ) : (
        <ul className="insp">
          {shown.map((l) => <ReviewCard key={l.id} listing={l} reviewer={phone ?? ''} />)}
        </ul>
      )}
      <p className="notice">نسخهٔ آزمایشی: دستگاه‌ها فقط در همین مرورگر ذخیره می‌شوند و عکس‌ها هم همین‌جا ذخیره می‌شوند و فقط روی دستگاهی دیده می‌شوند که همکار با آن ثبت کرده است.</p>
    </div>
  )
}
