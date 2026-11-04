import { Link } from 'react-router-dom'
import { DeviceArt } from '@/entities/category'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './about.css'

export function AboutHero() {
  return (
    <section className="ab-hero">
      <i className="ab-glow ab-glow--1" /><i className="ab-glow ab-glow--2" />
      <div className="container ab-hero__row">
        <div className="ab-hero__phones" aria-hidden="true">
          <DeviceArt w={150} h={296} tone="#2F5BFF" tilt={-10} className="ap ap--l" />
          <DeviceArt w={190} h={374} tone="#B8F23A" className="ap ap--c" />
          <DeviceArt w={150} h={296} tone="#7C93FF" tilt={10} className="ap ap--r" />
          <span className="chip chip--accent ap-chip ap-chip--a">✓ باتری {toFa(91)}٪</span>
          <span className="chip chip--white ap-chip ap-chip--b">گرید A</span>
        </div>
        <div className="ab-hero__text">
          <span className="chip chip--dark">دربارهٔ ما</span>
          <h1>واسطهٔ <em>مطمئن</em> شما<br />در بازار موبایل کارکرده</h1>
          <p>
            ما بین همکاران پل می‌زنیم؛ هر دستگاه قبل از انتشار تست، عکاسی و گریدبندی می‌شود و هویت فروشنده همیشه
            پنهان می‌ماند. شما فقط دستگاه خوب می‌بینید.
          </p>
          <div className="ab-hero__cta">
            <Link to={paths.login} className="btn btn--accent btn--lg">ثبت‌نام همکار</Link>
            <Link to={paths.catalog} className="btn btn--ghost btn--lg">مشاهدهٔ لیست قیمت</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
