import { Link } from 'react-router-dom'
import { DeviceArt } from '@/entities/category'
import { paths } from '@/shared/config/routes'
import { Kashida } from './Kashida'
import './about.css'

/** Opening statement: the headline carries the brand's stretched kashida; the phone is being "scanned". */
export function AboutHero() {
  return (
    <section className="abh">
      <div className="container abh__grid">
        <div className="abh__text">
          <p className="ab-eyebrow">دربارهٔ موبایل کارکرده</p>
          <h1 className="abh__title">
            گوشی کارکرده،
            <br />
            معاملهٔ <Kashida before="مطمئ" after="ن" length={7} />.
          </h1>
          <p className="abh__lead">
            ما واسطهٔ همکاران بازار موبایل هستیم. هر دستگاه را پیش از فروش تست می‌کنیم، گرید می‌دهیم و با عکس
            استاندارد عرضه می‌کنیم؛ و هویت فروشنده همیشه پیش ما می‌ماند.
          </p>
          <div className="abh__cta">
            <Link className="btn btn--accent btn--lg" to={paths.login}>ثبت‌نام همکار</Link>
            <Link className="btn btn--ghost btn--lg" to={paths.catalog}>لیست قیمت امروز</Link>
          </div>
        </div>

        <div className="abh__visual" aria-hidden="true">
          <div className="abh__ring" />
          <div className="abh__device">
            <DeviceArt w={190} h={372} />
            <span className="abh__scan" />
          </div>
          <span className="abh__tag abh__tag--1"><i />باتری ۹۱٪</span>
          <span className="abh__tag abh__tag--2"><i />نمایشگر سالم</span>
          <span className="abh__tag abh__tag--3"><b>A</b>گرید</span>
        </div>
      </div>
    </section>
  )
}
