import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { isValidMobile, normalizeMobile } from '@/features/auth-by-phone'
import { statusOf, useAllListings } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { addInspector, removeInspector, useInspectors } from '@/entities/staff'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './admin.css'

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' })

/** A readable random code: letters and digits without look-alikes. */
function randomCode(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(bytes, (b) => chars[b % chars.length]).join('')
}

/** «پنل ادمین»: the numbers at a glance, and who is allowed to review devices. */
export function AdminPage() {
  const { phone, role } = useSession()
  const isAdmin = role === 'admin'
  const inspectors = useInspectors(isAdmin)
  const listings = useAllListings(isAdmin ? phone : null)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState(randomCode)
  const [error, setError] = useState('')
  const [added, setAdded] = useState<{ name: string; phone: string; code: string } | null>(null)

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
    setAdded({ name: name.trim(), phone: normalized, code })
    setName('')
    setMobile('')
    setCode(randomCode())
  }

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / پنل ادمین</nav>
      <h1 className="page__title">پنل ادمین</h1>

      <section className="adm__stats" aria-label="آمار دستگاه‌ها">
        <div><b>{toFa(listings.length)}</b><small>کل دستگاه‌ها</small></div>
        <div><b>{toFa(count('pending'))}</b><small>در انتظار بازرسی</small></div>
        <div><b>{toFa(count('approved'))}</b><small>منتشر شده</small></div>
        <div><b>{toFa(count('rejected'))}</b><small>رد شده</small></div>
      </section>

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

        {added && (
          <div className="notice" role="status">
            «{added.name}» اضافه شد. این اطلاعات را همین الان برایش بفرستید؛ کد را دوباره نمی‌توانید ببینید:
            <br />شماره <b dir="ltr">{toFa(added.phone)}</b> · کد ورود <b dir="ltr">{added.code}</b>
          </div>
        )}

        {inspectors.length === 0 ? (
          <p className="muted">هنوز کارشناسی تعیین نشده است.</p>
        ) : (
          <ul className="adm__list">
            {inspectors.map((i) => (
              <li key={i.phone}>
                <span>
                  <strong>{i.name}</strong>
                  <small dir="ltr">{toFa(i.phone)}</small>
                  <small>از {dateFormat.format(i.addedAt)}</small>
                </span>
                <button type="button" className="adm__remove" aria-label={`برداشتن ${i.name} از کارشناسی`} onClick={() => void removeInspector(i.phone)}>برداشتن</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="btn-row">
        <Link to={paths.inspector} className="btn btn--primary">رفتن به پنل کارشناس</Link>
        <Link to={paths.account} className="btn btn--outline">تنظیمات حساب (کد ورود، ایمیل)</Link>
      </div>
    </div>
  )
}
