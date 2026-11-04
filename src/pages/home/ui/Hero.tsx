import { Link } from 'react-router-dom'
import { DeviceArt } from '@/entities/category'
import { paths } from '@/shared/config/routes'
import { count, toFa } from '@/shared/lib/format'
import './home.css'

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__row">
        <div className="hero__text">
          <span className="chip chip--soft">ویژهٔ همکاران ✓</span>
          <h1>بازار تخصصی خرید و فروش موبایل کارکرده برای همکاران</h1>
          <p>
            دستگاه‌های تست‌شده با عکس واقعی، گرید مشخص و قیمت عمده. فروشنده و خریدار مستقیم با هم در ارتباط نیستند؛
            ما واسطهٔ مطمئن شما هستیم.
          </p>
          <div className="hero__cta">
            <Link to={paths.login} className="btn btn--primary btn--lg">ثبت‌نام همکار</Link>
            <Link to={paths.catalog} className="btn btn--outline btn--lg">مشاهدهٔ لیست قیمت</Link>
          </div>
          <ul className="stats">
            <li><b>{toFa(48)} ساعت</b><span>ارسال سفارش</span></li>
            <li><b>{toFa(350)}+</b><span>همکار فعال</span></li>
            <li><b>{count(1200)}+</b><span>دستگاه موجود</span></li>
          </ul>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <i className="glow" />
          <DeviceArt w={110} h={218} tone="#2F5BFF" tilt={-8} className="hv hv--l" />
          <DeviceArt w={140} h={274} tone="#B8F23A" className="hv hv--c" />
          <DeviceArt w={110} h={218} tone="#7C93FF" tilt={8} className="hv hv--r" />
          <span className="chip chip--accent hv-chip hv-chip--a">گرید A · باتری {toFa(91)}٪</span>
          <span className="chip chip--white hv-chip hv-chip--b">بازرسی {toFa(100)} نقطه‌ای ✓</span>
        </div>
      </div>
    </section>
  )
}
