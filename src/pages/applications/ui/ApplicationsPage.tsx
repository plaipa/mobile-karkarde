import { useState } from 'react'
import { Link } from 'react-router-dom'
import { reviewApplication, useApplicationPhotos, useApplications, type Application } from '@/entities/application'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import './applications.css'

type View = 'pending' | 'all'
const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })
const statusText = { pending: 'در انتظار', approved: 'تأیید شده', rejected: 'رد شده' } as const

const mapLink = (a: Application) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.address} ${a.city}`)}`
const instagramLink = (v: string) => {
  const handle = v.trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '')
  return /^[A-Za-z0-9._]+$/.test(handle) ? `https://instagram.com/${handle}` : null
}

function ApplicationCard({ app }: { app: Application }) {
  const photos = useApplicationPhotos(app)
  const [mode, setMode] = useState<'idle' | 'reject'>('idle')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const insta = app.instagram ? instagramLink(app.instagram) : null

  const decide = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !note.trim()) return setError('دلیل رد را بنویسید تا همکار بداند چه چیزی را اصلاح کند.')
    if (status === 'approved' && !window.confirm(`ثبت‌نام «${app.shopName}» تأیید شود؟ همکار قیمت‌ها را می‌بیند و می‌تواند دستگاه ثبت کند.`)) return
    setBusy(true)
    const err = await reviewApplication(app.phone, status, note.trim())
    setBusy(false)
    if (err) setError(err)
  }

  return (
    <li className="appl__item">
      <div className="appl__head">
        <strong>{app.shopName}</strong>
        <span className={`chip chip--status-${app.status === 'pending' ? 'pending' : app.status}`}>{statusText[app.status]}</span>
      </div>
      <small>{app.fullName} · {app.city}</small>
      <p className="appl__address">{app.address}</p>
      <div className="appl__links">
        <a href={mapLink(app)} target="_blank" rel="noreferrer">نشانی روی نقشه</a>
        <a href={`tel:${app.landline}`}>تماس با تلفن ثابت <bdi dir="ltr">{toFa(app.landline)}</bdi></a>
        <a href={`tel:${app.phone}`}>موبایل <bdi dir="ltr">{toFa(app.phone)}</bdi></a>
        <a href={`https://wa.me/${app.phone.replace(/^0/, '98')}`} target="_blank" rel="noreferrer">واتس‌اپ</a>
        {insta && <a href={insta} target="_blank" rel="noreferrer">اینستاگرام</a>}
        {app.instagram && !insta && <span dir="ltr">{app.instagram}</span>}
      </div>
      <div className="appl__photos">
        {photos.front ? <a href={photos.front} target="_blank" rel="noreferrer"><img src={photos.front} alt="سردر مغازه" /><small>سردر</small></a> : <small className="muted">در حال بارگذاری عکس…</small>}
        {photos.inside && <a href={photos.inside} target="_blank" rel="noreferrer"><img src={photos.inside} alt="داخل مغازه" /><small>داخل مغازه</small></a>}
      </div>
      <small className="appl__meta">ارسال در {dateFormat.format(app.submittedAt)}</small>

      {app.status !== 'pending' ? (
        <>
          <small className="appl__meta">{statusText[app.status]} توسط <b dir="ltr">{toFa(app.reviewedBy ?? '')}</b>{app.reviewedAt ? ` در ${dateFormat.format(app.reviewedAt)}` : ''}{app.reviewNote ? ` — ${app.reviewNote}` : ''}</small>
          <div className="appl__actions">
            {app.status === 'rejected' && <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void decide('approved')}>تأیید با وجود رد قبلی</button>}
            {app.status === 'approved' && <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => setMode('reject')}>لغو تأیید (رد)</button>}
          </div>
        </>
      ) : (
        <div className="appl__actions">
          <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void decide('approved')}>تأیید</button>
          <button type="button" className="btn btn--outline btn--sm" disabled={busy} onClick={() => setMode('reject')}>رد کردن</button>
        </div>
      )}
      {mode === 'reject' && (
        <div className="appl__form">
          <label>دلیل رد
            <textarea className="input" rows={2} value={note} onChange={(e) => { setNote(e.target.value); setError('') }} placeholder="مثلاً: عکس سردر دیده نمی‌شود" autoFocus />
          </label>
          <div className="appl__actions">
            <button type="button" className="btn btn--primary btn--sm" disabled={busy} onClick={() => void decide('rejected')}>ثبت رد</button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => { setMode('idle'); setError('') }}>انصراف</button>
          </div>
        </div>
      )}
      {error && <p className="error" role="alert">{error}</p>}
    </li>
  )
}

/** «درخواست‌های ثبت‌نام»: admins review the shop details and photos before a partner sees prices. */
export function ApplicationsPage() {
  const { phone, role } = useSession()
  const isAdmin = role === 'admin'
  const apps = useApplications(isAdmin)
  const [view, setView] = useState<View>('pending')

  if (!isAdmin) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">درخواست‌های ثبت‌نام</h1>
          <p>{phone ? 'این بخش فقط برای مدیر سایت است.' : 'برای ورود به این بخش ابتدا وارد شوید.'}</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">{phone ? 'بازگشت به پنل' : 'ورود'}</Link>
        </div>
      </div>
    )
  }

  const pending = apps.filter((a) => a.status === 'pending')
  const shown = view === 'pending' ? pending : apps
  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / <Link to={paths.admin}>پنل ادمین</Link> / درخواست‌های ثبت‌نام</nav>
      <h1 className="page__title">درخواست‌های ثبت‌نام</h1>
      <p className="muted">مشخصات مغازه را با نقشه، تلفن ثابت و عکس سردر بسنجید و تأیید یا رد کنید. تا تأیید نشود، همکار قیمت‌ها را نمی‌بیند و دستگاه ثبت نمی‌کند.</p>
      <Tabs items={[{ id: 'pending' as const, label: `در انتظار (${toFa(pending.length)})` }, { id: 'all' as const, label: `همه (${toFa(apps.length)})` }]} value={view} onChange={setView} />
      {shown.length === 0 ? (
        <div className="panel"><p>{view === 'pending' ? 'درخواستی در انتظار نیست.' : 'هنوز درخواستی نیامده است.'}</p></div>
      ) : (
        <ul className="appl">{shown.map((a) => <ApplicationCard key={`${a.phone}-${a.submittedAt}`} app={a} />)}</ul>
      )}
    </div>
  )
}
