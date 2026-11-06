import { Link } from 'react-router-dom'
import { serviceAreaLabel } from '@/shared/config/cities'
import { paths } from '@/shared/config/routes'
import { count, toFa } from '@/shared/lib/format'
import heroPhone from '../assets/hero-phone.webp'
import heroPhoneSm from '../assets/hero-phone-sm.webp'
import './home.css'

export function Hero() {
  return (
    <section className="hero">
      <div className="container hero__row">
        <div className="hero__text">
          <div className="hero__chips">
            <span className="chip chip--soft">ویژهٔ همکاران ✓</span>
            <span className="chip chip--city"><i aria-hidden="true" />{serviceAreaLabel}</span>
          </div>
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
        <div className="hero__visual">
          {/* Photo: Rohan Krishnan on Unsplash (Unsplash License). */}
          <img
            className="hero__photo"
            src={heroPhone}
            srcSet={`${heroPhoneSm} 480w, ${heroPhone} 880w`}
            sizes="(max-width: 1020px) 100vw, 440px"
            width={880}
            height={1000}
            alt="گوشی آیفون در دست، آمادهٔ تحویل به همکار"
            fetchPriority="high"
            decoding="async"
          />
          <span className="chip chip--accent hv-chip hv-chip--a" aria-hidden="true">درحد · باتری {toFa(91)}٪</span>
          <span className="chip chip--white hv-chip hv-chip--b" aria-hidden="true">بازرسی {toFa(100)} نقطه‌ای ✓</span>
        </div>
      </div>
    </section>
  )
}
