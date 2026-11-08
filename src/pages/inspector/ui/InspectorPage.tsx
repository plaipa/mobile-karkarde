import { useState } from 'react'
import { Link } from 'react-router-dom'
import { findCategory } from '@/entities/category'
import { ListingPhotos, ListingStatusChip, reopenListing, reviewListing, statusOf, useAllListings, type MyListing } from '@/entities/listing'
import { gradeLabel, grades, regions, simLabels, simOrder, type Grade, type Sim } from '@/entities/product'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toEn, toFa } from '@/shared/lib/format'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import './inspector.css'

type View = 'queue' | 'done'
const tabs = [
  { id: 'queue' as const, label: 'در انتظار بازرسی' },
  { id: 'done' as const, label: 'بررسی‌شده' },
]
const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })
const MIN_PRICE = 500_000

function summary(l: MyListing): string {
  const battery = l.category !== 'speaker' && l.battery ? `باتری ${toFa(l.battery)}٪` : ''
  return [findCategory(l.category).title, l.brand, l.storage, l.color, battery, l.city].filter(Boolean).join(' · ')
}

const parsePrice = (text: string) => Number(toEn(text).replace(/[^\d]/g, '')) || 0
const formatPrice = (n: number) => toFa(n.toLocaleString('en'))

/** Approving publishes the device: the کارشناس sets the grade and the partner price buyers will see. */
function ApproveForm({ listing, onCancel }: { listing: MyListing; onCancel: () => void }) {
  const [grade, setGrade] = useState<Grade | ''>('')
  const [priceText, setPriceText] = useState('')
  const [region, setRegion] = useState('')
  const [sim, setSim] = useState<Sim | ''>('')
  const [registered, setRegistered] = useState(false)
  const [warranty, setWarranty] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isPhone = listing.category === 'phone'
  const price = parsePrice(priceText)

  const submit = async () => {
    if (!grade) return setError('گرید دستگاه را انتخاب کنید.')
    if (price < MIN_PRICE) return setError(`قیمت را به تومان و کامل بنویسید (حداقل ${formatPrice(MIN_PRICE)}).`)
    setBusy(true)
    const err = await reviewListing(listing.id, {
      status: 'approved', note: note.trim(), grade, price,
      region: region || undefined, sim: sim || undefined, registered, warranty,
    })
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <div className="insp__form">
      <label>گرید
        <select className="input" value={grade} onChange={(e) => { setGrade(e.target.value as Grade); setError('') }}>
          <option value="">انتخاب کنید</option>
          {grades.map((g) => <option key={g} value={g}>{gradeLabel[g]} ({g})</option>)}
        </select>
      </label>
      <label>قیمت همکار (تومان)
        <input className="input" inputMode="numeric" dir="ltr" placeholder="مثلاً 92500000" value={priceText} onChange={(e) => { setPriceText(e.target.value); setError('') }} />
        {price > 0 && <small className="muted">{formatPrice(price)} تومان</small>}
      </label>
      {isPhone && (
        <>
          <label>ریجن (اختیاری)
            <select className="input" value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="">نامشخص</option>
              {regions.map((r) => <option key={r.code} value={r.code}>{r.label}</option>)}
            </select>
          </label>
          <label>سیم‌کارت (اختیاری)
            <select className="input" value={sim} onChange={(e) => setSim(e.target.value as Sim | '')}>
              <option value="">نامشخص</option>
              {simOrder.map((s) => <option key={s} value={s}>{simLabels[s]}</option>)}
            </select>
          </label>
        </>
      )}
      <label className="check"><input type="checkbox" checked={registered} onChange={(e) => setRegistered(e.target.checked)} /> رجیستر است</label>
      <label className="check"><input type="checkbox" checked={warranty} onChange={(e) => setWarranty(e.target.checked)} /> گارانتی دارد</label>
      <label>یادداشت (اختیاری)
        <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="insp__actions">
        <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void submit()}>{busy ? 'در حال انتشار…' : 'تأیید و انتشار'}</button>
        <button type="button" className="btn btn--outline btn--sm" onClick={onCancel}>انصراف</button>
      </div>
    </div>
  )
}

function RejectForm({ listing, onCancel }: { listing: MyListing; onCancel: () => void }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async () => {
    if (!note.trim()) return setError('دلیل رد را بنویسید تا همکار بداند چه چیزی را اصلاح کند.')
    setBusy(true)
    const err = await reviewListing(listing.id, { status: 'rejected', note: note.trim() })
    setBusy(false)
    if (err) setError(err)
  }
  return (
    <div className="insp__form">
      <label>دلیل رد
        <textarea className="input" rows={3} value={note} onChange={(e) => { setNote(e.target.value); setError('') }} placeholder="مثلاً: عکس لبهٔ پایین تار است" autoFocus />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="insp__actions">
        <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void submit()}>ثبت رد</button>
        <button type="button" className="btn btn--outline btn--sm" onClick={onCancel}>انصراف</button>
      </div>
    </div>
  )
}

function ReviewCard({ listing }: { listing: MyListing }) {
  const status = statusOf(listing)
  const [mode, setMode] = useState<'idle' | 'approve' | 'reject'>('idle')
  const pub = listing.publication

  return (
    <li className="insp__item">
      <div className="insp__head">
        <strong>{listing.model}</strong>
        <ListingStatusChip status={status} />
      </div>
      <small>{summary(listing)}</small>
      {listing.notes && <p className="insp__notes">توضیح فروشنده: {listing.notes}</p>}
      <ListingPhotos listingId={listing.id} />
      <small className="insp__meta">کد {listing.code} · همکار: <b dir="ltr">{toFa(listing.phone)}</b> · ثبت در {dateFormat.format(listing.createdAt)}</small>

      {listing.review ? (
        <>
          <small className="insp__meta">
            {listing.review.status === 'approved' ? 'تأیید' : 'رد'} توسط <b dir="ltr">{toFa(listing.review.by)}</b> در {dateFormat.format(listing.review.at)}
            {listing.review.note && ` — ${listing.review.note}`}
          </small>
          {pub && <small className="insp__meta">گرید {pub.grade} · {formatPrice(pub.price)} تومان · <Link to={paths.product(listing.code)}>دیدن در لیست قیمت</Link></small>}
          <div className="insp__actions">
            <button type="button" className="btn btn--outline btn--sm" onClick={() => void reopenListing(listing.id)}>بازگرداندن به صف</button>
          </div>
        </>
      ) : mode === 'approve' ? (
        <ApproveForm listing={listing} onCancel={() => setMode('idle')} />
      ) : mode === 'reject' ? (
        <RejectForm listing={listing} onCancel={() => setMode('idle')} />
      ) : (
        <div className="insp__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setMode('approve')}>تأیید دستگاه</button>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setMode('reject')}>رد کردن</button>
        </div>
      )}
    </li>
  )
}

/** «پنل کارشناس»: the queue of submitted devices; کارشناس and admin approve (publish) or reject them. */
export function InspectorPage() {
  const { phone, role } = useSession()
  const isStaff = role === 'inspector' || role === 'admin'
  const all = useAllListings(isStaff ? phone : null)
  const [view, setView] = useState<View>('queue')

  if (!isStaff) {
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
      <p className="muted">{toFa(queue.length)} دستگاه منتظر بازرسی است. با «تأیید»، گرید و قیمت را می‌نویسید و دستگاه در لیست قیمت منتشر می‌شود؛ با «رد»، دلیلش برای همکار نمایش داده می‌شود.</p>
      <Tabs items={tabs} value={view} onChange={setView} />
      {shown.length === 0 ? (
        <div className="panel"><p>{view === 'queue' ? 'دستگاهی در انتظار بازرسی نیست.' : 'هنوز دستگاهی بررسی نشده است.'}</p></div>
      ) : (
        <ul className="insp">
          {shown.map((l) => <ReviewCard key={l.id} listing={l} />)}
        </ul>
      )}
    </div>
  )
}
