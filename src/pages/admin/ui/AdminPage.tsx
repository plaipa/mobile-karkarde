import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isValidMobile, normalizeMobile } from '@/features/auth-by-phone'
import { statusOf, useAllListings } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { addInspector, removeInspector, setPartnerBlocked, useInspectors, usePartners, type Inspector } from '@/entities/staff'
import { paths } from '@/shared/config/routes'
import { toEn, toFa } from '@/shared/lib/format'
import './admin.css'

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' })

/** A readable random code: letters and digits without look-alikes. */
function randomCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

interface Issued { name: string; phone: string; code: string; reset: boolean }

/** One کارشناس: a new login code can be issued at any time (for a forgotten code), or the person is removed. */
function InspectorRow({ i, onIssued }: { i: Inspector; onIssued: (x: Issued) => void }) {
  const reset = async () => {
    if (!window.confirm(`کد ورود «${i.name}» عوض شود؟ کد قبلی از کار می‌افتد.`)) return
    const code = randomCode()
    if (await addInspector(i.phone, i.name, code) === null) onIssued({ name: i.name, phone: i.phone, code, reset: true })
  }
  return (
    <li>
      <span>
        <strong>{i.name}</strong>
        <small dir="ltr">{toFa(i.phone)}</small>
        <small>از {dateFormat.format(i.addedAt)}</small>
      </span>
      <span className="adm__row-actions">
        <button type="button" className="adm__link" onClick={() => void reset()}>کد جدید</button>
        <button type="button" className="adm__remove" aria-label={`برداشتن ${i.name} از کارشناسی`} onClick={() => { if (window.confirm(`«${i.name}» از کارشناسی برداشته شود؟`)) void removeInspector(i.phone) }}>برداشتن</button>
      </span>
    </li>
  )
}

/** «پنل ادمین»: the numbers at a glance, who reviews devices, and who may use the site. */
export function AdminPage() {
  const { phone, role } = useSession()
  const isAdmin = role === 'admin'
  const inspectors = useInspectors(isAdmin)
  const partners = usePartners(isAdmin)
  const listings = useAllListings(isAdmin ? phone : null)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState(randomCode)
  const [error, setError] = useState('')
  const [issued, setIssued] = useState<Issued | null>(null)
  const [query, setQuery] = useState('')

  const shownPartners = useMemo(() => {
    const needle = toEn(query).trim().toLowerCase()
    return partners.filter((p) => !needle || p.phone.includes(needle) || p.name.toLowerCase().includes(needle))
  }, [partners, query])

  if (!isAdmin) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">پنل ادمین</h1>
          <p>{phone ? 'این بخش فقط برای مدیر سایت است.' : 'برای ورود به این بخش ابتدا وارد شوید.'}</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">{phone ? 'بازگشت به پنل' : 'ورود'}</Link>
        </div>
      </div>
    )
  }

  const count = (s: 'pending' | 'approved' | 'rejected') => listings.filter((l) => statusOf(l) === s).length

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const normalized = normalizeMobile(mobile)
    if (!name.trim()) return setError('نام کارشناس را بنویسید.')
    if (!isValidMobile(normalized)) return setError('شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
    if (!/^[A-Za-z0-9]{6,32}$/.test(code)) return setError('کد ورود باید ۶ تا ۳۲ حرف انگلیسی یا عدد باشد.')
    const err = await addInspector(normalized, name.trim(), code)
    if (err) return setError(err)
    setError('')
    setIssued({ name: name.trim(), phone: normalized, code, reset: false })
    setName('')
    setMobile('')
    setCode(randomCode())
  }

  const toggleBlock = async (p: { phone: string; name: string; blocked: boolean }) => {
    const label = p.name || toFa(p.phone)
    const ask = p.blocked ? `مسدودیت «${label}» برداشته شود؟` : `«${label}» مسدود شود؟ از حسابش خارج می‌شود و دیگر نمی‌تواند وارد شود.`
    if (window.confirm(ask)) await setPartnerBlocked(p.phone, !p.blocked)
  }

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / پنل ادمین</nav>
      <h1 className="page__title">پنل ادمین</h1>

      <section className="adm__stats" aria-label="آمار">
        <div><b>{toFa(listings.length)}</b><small>کل دستگاه‌ها</small></div>
        <div><b>{toFa(count('pending'))}</b><small>در انتظار بازرسی</small></div>
        <div><b>{toFa(count('approved'))}</b><small>منتشر شده</small></div>
        <div><b>{toFa(count('rejected'))}</b><small>رد شده</small></div>
        <div><b>{toFa(partners.length)}</b><small>همکار</small></div>
        <div><b>{toFa(inspectors.length)}</b><small>کارشناس</small></div>
      </section>

      <div className="btn-row">
        <Link to={paths.inspector} className="btn btn--primary">پنل کارشناس (همهٔ دستگاه‌ها)</Link>
        <Link to={paths.account} className="btn btn--outline">تنظیمات حساب (کد ورود، ایمیل)</Link>
      </div>

      <section className="panel adm__section">
        <h2>کارشناس‌ها</h2>
        <p className="muted">کارشناس بعد از ورود «پنل کارشناس» را می‌بیند و دستگاه‌ها را تأیید یا رد می‌کند. هر کارشناس کد ورود مخصوص خودش را دارد؛ آن را فقط خودش و شما می‌دانید.</p>
        <form onSubmit={(e) => void submit(e)} className="form" noValidate>
          <label>نام کارشناس
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </label>
          <label>شمارهٔ موبایل
            <input className="input" inputMode="numeric" dir="ltr" placeholder="09123456789" value={mobile} onChange={(e) => setMobile(e.target.value)} autoComplete="off" />
          </label>
          <label>کد ورود
            <input className="input" dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" autoCapitalize="none" />
            <small className="muted">خودکار ساخته شده؛ می‌توانید عوضش کنید.</small>
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary adm__add">افزودن کارشناس</button>
        </form>

        {issued && (
          <div className="notice" role="status">
            {issued.reset ? `کد ورود «${issued.name}» عوض شد.` : `«${issued.name}» اضافه شد.`} این اطلاعات را همین الان برایش بفرستید؛ کد را دوباره نمی‌توانید ببینید:
            <br />شماره <b dir="ltr">{toFa(issued.phone)}</b> · کد ورود <b dir="ltr">{issued.code}</b>
          </div>
        )}

        {inspectors.length === 0 ? (
          <p className="muted">هنوز کارشناسی تعیین نشده است.</p>
        ) : (
          <ul className="adm__list">
            {inspectors.map((i) => <InspectorRow key={i.phone} i={i} onIssued={setIssued} />)}
          </ul>
        )}
      </section>

      <section className="panel adm__section">
        <h2>همکاران ({toFa(partners.length)})</h2>
        <p className="muted">همهٔ کسانی که وارد سایت شده‌اند. اگر کسی سوءاستفاده کرد، مسدودش کنید: فوراً از حسابش خارج می‌شود و دیگر نمی‌تواند وارد شود.</p>
        <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جست‌وجو: شماره یا نام" aria-label="جست‌وجوی همکار" />
        {shownPartners.length === 0 ? (
          <p className="muted">{query ? 'موردی پیدا نشد.' : 'هنوز همکاری وارد نشده است.'}</p>
        ) : (
          <ul className="adm__list">
            {shownPartners.map((p) => (
              <li key={p.phone} className={p.blocked ? 'is-blocked' : undefined}>
                <span>
                  <strong dir="ltr">{toFa(p.phone)}{p.name ? ` · ${p.name}` : ''}</strong>
                  <small>{toFa(p.devices)} دستگاه · {toFa(p.published)} منتشر شده · از {dateFormat.format(p.joinedAt)}</small>
                  {p.blocked && <small className="adm__blocked">مسدود</small>}
                </span>
                <button type="button" className={p.blocked ? 'adm__link' : 'adm__remove'} onClick={() => void toggleBlock(p)}>{p.blocked ? 'رفع مسدودی' : 'مسدود کردن'}</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
