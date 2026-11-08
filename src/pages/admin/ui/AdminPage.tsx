import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isValidMobile, normalizeMobile } from '@/features/auth-by-phone'
import { statusOf, useAllListings } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { addInspector, removeInspector, useInspectors, useRole } from '@/entities/staff'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './admin.css'

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' })

/** «پنل ادمین»: the numbers at a glance, and who is allowed to inspect devices. */
export function AdminPage() {
  const { phone } = useSession()
  const role = useRole(phone)
  const inspectors = useInspectors()
  const listings = useAllListings()
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('')

  if (role !== 'admin') {
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

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const normalized = normalizeMobile(mobile)
    if (!name.trim()) return setError('نام بازرس را بنویسید.')
    if (!isValidMobile(normalized)) return setError('شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
    if (!addInspector(normalized, name)) return setError('این شماره مدیر سایت است و خودش به پنل بازرس دسترسی دارد.')
    setError('')
    setName('')
    setMobile('')
  }

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / پنل ادمین</nav>
      <h1 className="page__title">پنل ادمین</h1>

      <section className="adm__stats" aria-label="آمار دستگاه‌ها">
        <div><b>{toFa(listings.length)}</b><small>کل دستگاه‌ها</small></div>
        <div><b>{toFa(count('pending'))}</b><small>در انتظار بازرسی</small></div>
        <div><b>{toFa(count('approved'))}</b><small>تأیید شده</small></div>
        <div><b>{toFa(count('rejected'))}</b><small>رد شده</small></div>
      </section>

      <section className="panel adm__section">
        <h2>بازرس‌ها</h2>
        <p className="muted">هر شمارهٔ موبایلی که اینجا اضافه کنید، بعد از ورود با همان شماره «پنل بازرس» را می‌بیند و می‌تواند دستگاه‌ها را تأیید یا رد کند.</p>
        <form onSubmit={submit} className="form adm__form" noValidate>
          <label>نام بازرس
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          </label>
          <label>شمارهٔ موبایل
            <input className="input" inputMode="numeric" dir="ltr" placeholder="09123456789" value={mobile} onChange={(e) => setMobile(e.target.value)} autoComplete="off" />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary">افزودن بازرس</button>
        </form>

        {inspectors.length === 0 ? (
          <p className="muted">هنوز بازرسی تعیین نشده است.</p>
        ) : (
          <ul className="adm__list">
            {inspectors.map((i) => (
              <li key={i.phone}>
                <span>
                  <strong>{i.name}</strong>
                  <small dir="ltr">{toFa(i.phone)}</small>
                  <small>از {dateFormat.format(i.addedAt)}</small>
                </span>
                <button type="button" className="adm__remove" aria-label={`برداشتن ${i.name} از بازرسی`} onClick={() => removeInspector(i.phone)}>برداشتن</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="btn-row">
        <Link to={paths.inspector} className="btn btn--primary">رفتن به پنل بازرس</Link>
      </div>
      <p className="notice">نسخهٔ نمایشی: فهرست بازرس‌ها فقط در همین مرورگر ذخیره می‌شود و شمارهٔ مدیر در <code>src/shared/config/staff.ts</code> نمونه است. با اتصال به سرور، نقش‌ها از سرور می‌آیند.</p>
    </div>
  )
}
