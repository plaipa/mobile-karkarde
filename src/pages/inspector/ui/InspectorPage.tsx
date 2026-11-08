import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories, findCategory } from '@/entities/category'
import { adminRemoveListing, ListingPhotos, ListingStatusChip, reopenListing, reviewListing, statusOf, useAllListings, type MyListing, type Publication } from '@/entities/listing'
import { gradeLabel, grades, regions, simLabels, simOrder, type Grade, type Sim } from '@/entities/product'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toEn, toFa } from '@/shared/lib/format'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import './inspector.css'

type View = 'queue' | 'done' | 'all'
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime() }
const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })
const MIN_PRICE = 500_000

function summary(l: MyListing): string {
  const battery = l.category !== 'speaker' && l.battery ? `باتری ${toFa(l.battery)}٪` : ''
  const cycles = l.batteryCycles !== undefined ? `${toFa(l.batteryCycles)} سایکل` : ''
  return [findCategory(l.category).title, l.brand, l.storage, l.color, battery, cycles, l.city].filter(Boolean).join(' · ')
}

const parsePrice = (text: string) => Number(toEn(text).replace(/[^\d]/g, '')) || 0
const formatPrice = (n: number) => toFa(n.toLocaleString('en'))

/** Approving publishes the device: the کارشناس sets the grade and the partner price buyers will see. */
function ApproveForm({ listing, initial, onCancel }: { listing: MyListing; initial?: Publication; onCancel: () => void }) {
  const editing = Boolean(initial)
  const [grade, setGrade] = useState<Grade | ''>(initial?.grade ?? '')
  const [priceText, setPriceText] = useState(initial ? String(initial.price) : '')
  const [region, setRegion] = useState(initial?.region ?? '')
  const [sim, setSim] = useState<Sim | ''>(initial?.sim ?? '')
  const [registered, setRegistered] = useState(initial?.registered ?? false)
  const [warranty, setWarranty] = useState(initial?.warranty ?? false)
  const [note, setNote] = useState(listing.review?.note ?? '')
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
        <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void submit()}>{busy ? 'در حال ذخیره…' : editing ? 'ذخیرهٔ تغییرات' : 'تأیید و انتشار'}</button>
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

function ReviewCard({ listing, isAdmin }: { listing: MyListing; isAdmin: boolean }) {
  const status = statusOf(listing)
  const [mode, setMode] = useState<'idle' | 'approve' | 'reject' | 'edit'>('idle')
  const pub = listing.publication
  const phoneDigits = listing.phone.replace(/^0/, '98')

  return (
    <li className="insp__item">
      <div className="insp__head">
        <strong>{listing.model}</strong>
        <ListingStatusChip status={status} />
      </div>
      <small>{summary(listing)}</small>
      {listing.notes && <p className="insp__notes">توضیح فروشنده: {listing.notes}</p>}
      <ListingPhotos listingId={listing.id} />
      <small className="insp__meta">کد {listing.code} · ثبت در {dateFormat.format(listing.createdAt)}</small>
      <small className="insp__meta">
        همکار: <b dir="ltr">{toFa(listing.phone)}</b> ·{' '}
        <a href={`tel:${listing.phone}`}>تماس</a> ·{' '}
        <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noreferrer">واتس‌اپ</a>
      </small>

      {listing.review && mode !== 'edit' ? (
        <>
          <small className="insp__meta">
            {listing.review.status === 'approved' ? 'تأیید' : 'رد'} توسط <b dir="ltr">{toFa(listing.review.by)}</b> در {dateFormat.format(listing.review.at)}
            {listing.review.note && ` — ${listing.review.note}`}
          </small>
          {pub && <small className="insp__meta">گرید {pub.grade} · {formatPrice(pub.price)} تومان · <Link to={paths.product(listing.code)}>دیدن در لیست قیمت</Link></small>}
          <div className="insp__actions">
            {pub && <button type="button" className="btn btn--primary btn--sm" onClick={() => setMode('edit')}>ویرایش قیمت و گرید</button>}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => void reopenListing(listing.id)}>بازگرداندن به صف</button>
            {isAdmin && (
              <button type="button" className="btn btn--outline btn--sm insp__danger" onClick={() => { if (window.confirm(`«${listing.model}» از سایت حذف شود؟`)) void adminRemoveListing(listing.id) }}>حذف از سایت</button>
            )}
          </div>
        </>
      ) : mode === 'edit' && pub ? (
        <ApproveForm listing={listing} initial={pub} onCancel={() => setMode('idle')} />
      ) : mode === 'approve' ? (
        <ApproveForm listing={listing} onCancel={() => setMode('idle')} />
      ) : mode === 'reject' ? (
        <RejectForm listing={listing} onCancel={() => setMode('idle')} />
      ) : (
        <div className="insp__actions">
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setMode('approve')}>تأیید دستگاه</button>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setMode('reject')}>رد کردن</button>
          {isAdmin && (
            <button type="button" className="btn btn--outline btn--sm insp__danger" onClick={() => { if (window.confirm(`«${listing.model}» از سایت حذف شود؟`)) void adminRemoveListing(listing.id) }}>حذف از سایت</button>
          )}
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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const stats = useMemo(() => {
    const today = startOfToday()
    const mine = all.filter((l) => l.review?.by === phone)
    return {
      pending: all.filter((l) => statusOf(l) === 'pending').length,
      approved: all.filter((l) => statusOf(l) === 'approved').length,
      rejected: all.filter((l) => statusOf(l) === 'rejected').length,
      mine: mine.length,
      today: mine.filter((l) => (l.review?.at ?? 0) >= today).length,
    }
  }, [all, phone])

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

  const needle = toEn(query).trim().toLowerCase()
  const matches = (l: MyListing) =>
    (!category || l.category === category) &&
    (!needle || [l.code, l.model, l.brand, l.phone, l.color].some((v) => toEn(v).toLowerCase().includes(needle)))
  // The queue is first-come, first-served: the oldest submission is reviewed first.
  const queue = all.filter((l) => statusOf(l) === 'pending' && matches(l)).sort((a, b) => a.createdAt - b.createdAt)
  const done = all.filter((l) => statusOf(l) !== 'pending' && matches(l)).sort((a, b) => (b.review?.at ?? 0) - (a.review?.at ?? 0))
  const everything = all.filter(matches)
  const shown = view === 'queue' ? queue : view === 'done' ? done : everything
  const tabs = [
    { id: 'queue' as const, label: `در انتظار بازرسی (${toFa(stats.pending)})` },
    { id: 'done' as const, label: `بررسی‌شده (${toFa(stats.approved + stats.rejected)})` },
    { id: 'all' as const, label: `همه (${toFa(all.length)})` },
  ]

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / پنل کارشناس</nav>
      <h1 className="page__title">پنل کارشناس</h1>
      <p className="muted">با «تأیید»، گرید و قیمت را می‌نویسید و دستگاه در لیست قیمت منتشر می‌شود؛ با «رد»، دلیلش برای همکار نمایش داده می‌شود. قدیمی‌ترین دستگاه اول می‌آید.</p>

      <section className="insp__stats" aria-label="آمار">
        <div><b>{toFa(stats.pending)}</b><small>در انتظار</small></div>
        <div><b>{toFa(stats.today)}</b><small>امروز توسط شما</small></div>
        <div><b>{toFa(stats.mine)}</b><small>کل بررسی‌های شما</small></div>
        <div><b>{toFa(stats.approved)}</b><small>منتشر شده</small></div>
      </section>

      <Tabs items={tabs} value={view} onChange={setView} />
      <div className="insp__filters">
        <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جست‌وجو: کد، مدل، رنگ یا شمارهٔ همکار" aria-label="جست‌وجو" />
        <select className="input" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="دسته">
          <option value="">همهٔ دسته‌ها</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {shown.length === 0 ? (
        <div className="panel"><p>{query || category ? 'موردی با این جست‌وجو پیدا نشد.' : view === 'queue' ? 'دستگاهی در انتظار بازرسی نیست.' : 'موردی نیست.'}</p></div>
      ) : (
        <ul className="insp">
          {shown.map((l) => <ReviewCard key={l.id} listing={l} isAdmin={role === 'admin'} />)}
        </ul>
      )}
    </div>
  )
}
