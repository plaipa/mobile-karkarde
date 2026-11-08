import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { EmailSecurity } from './EmailSecurity'
import { StaffCode } from './StaffCode'
import { TextSizeToggle } from '@/features/text-size'
import { serviceCities } from '@/shared/config/cities'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './account.css'

/** «تنظیمات حساب»: the partner's number, the city new devices start with, reading comfort, and sign-out. */
export function AccountPage() {
  const { phone, role, city, setCity, signOut } = useSession()
  const navigate = useNavigate()

  if (!phone) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">تنظیمات حساب</h1>
          <p>برای تغییر تنظیمات، ابتدا به‌عنوان همکار وارد شوید.</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">ورود همکار</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / تنظیمات حساب</nav>
      <h1 className="page__title">تنظیمات حساب</h1>

      <section className="panel acct">
        <h2>حساب</h2>
        <div className="acct__row">
          <span>شمارهٔ موبایل</span>
          <b dir="ltr">{toFa(phone)}</b>
        </div>
        <label className="acct__row acct__row--field">
          <span>
            شهر پیش‌فرض آگهی‌ها
            <small className="muted">هنگام ثبت هر دستگاه همین شهر انتخاب می‌شود؛ برای هر دستگاه می‌توانید عوضش کنید.</small>
          </span>
          <select className="input" value={city} onChange={(e) => setCity(e.target.value)}>
            {serviceCities.map((c) => <option key={c.name} value={c.name} disabled={!c.active}>{c.active ? c.name : `${c.name} (به‌زودی)`}</option>)}
          </select>
        </label>
      </section>

      {(role === 'admin' || role === 'inspector') && <StaffCode />}

      <EmailSecurity phone={phone} />

      <section className="panel acct">
        <h2>نمایش</h2>
        <TextSizeToggle />
      </section>

      <section className="panel acct">
        <h2>خروج</h2>
        <p className="muted">با خروج، قیمت‌ها دوباره پنهان می‌شوند. دستگاه‌های ثبت‌شده‌تان در همین مرورگر می‌مانند.</p>
        <div className="btn-row">
          <button className="btn btn--outline" onClick={() => { void signOut().then(() => navigate(paths.home)) }}>خروج از حساب</button>
        </div>
      </section>
    </div>
  )
}
