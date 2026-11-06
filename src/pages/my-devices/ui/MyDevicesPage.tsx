import { Link } from 'react-router-dom'
import { findCategory } from '@/entities/category'
import { removeListing, useMyListings, type MyListing } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './my-devices.css'

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium' })

function details(l: MyListing): string {
  const hasBattery = l.category !== 'speaker' && l.battery
  return [l.storage, l.color, hasBattery && `باتری ${toFa(l.battery)}٪`].filter(Boolean).join(' · ')
}

/** «دستگاه‌های من»: what this partner has submitted for sale, newest first. */
export function MyDevicesPage() {
  const { phone } = useSession()
  const listings = useMyListings(phone)

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
              </div>
              <div className="mydev__side">
                <span className="chip chip--city-soft">{l.city}</span>
                <span className="chip chip--pending">در انتظار بازرسی</span>
                <button
                  type="button"
                  className="btn btn--outline btn--sm"
                  aria-label={`حذف ${l.model}`}
                  onClick={() => { if (window.confirm('این دستگاه از فهرست شما حذف شود؟')) removeListing(l.id) }}
                >
                  حذف
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
