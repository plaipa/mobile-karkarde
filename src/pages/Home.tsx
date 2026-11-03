import { Link } from 'react-router-dom'
import { categories, products } from '../data'
import { count, toFa } from '../lib/format'
import { PhoneArt } from '../components/PhoneArt'
import { ProductCard } from '../components/ProductCard'

const steps = [
  ['۱', 'ثبت‌نام و تأیید', 'با شمارهٔ موبایل ثبت‌نام کنید. بعد از تأیید، قیمت‌ها نمایش داده می‌شود.'],
  ['۲', 'انتخاب دستگاه', 'عکس واقعی، گرید و سلامت باتری را ببینید و سبد خود را بسازید.'],
  ['۳', 'ثبت سفارش و ارسال', 'سفارش از طریق ما هماهنگ می‌شود و دستگاه ظرف ۴۸ ساعت ارسال می‌شود.'],
]

export default function Home() {
  const newest = [...products].filter((p) => p.category === 'phone' || p.category === 'watch').sort((a, b) => a.addedDays - b.addedDays).slice(0, 4)
  return (
    <>
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
              <Link to="/login" className="btn btn--primary btn--lg">ثبت‌نام همکار</Link>
              <Link to="/products" className="btn btn--outline btn--lg">مشاهدهٔ محصولات</Link>
            </div>
            <ul className="stats">
              <li><b>{toFa(48)} ساعت</b><span>ارسال سفارش</span></li>
              <li><b>{toFa(350)}+</b><span>همکار فعال</span></li>
              <li><b>{count(1200)}+</b><span>دستگاه موجود</span></li>
            </ul>
          </div>
          <div className="hero__visual" aria-hidden="true">
            <i className="glow" />
            <PhoneArt w={110} h={218} tone="#2F5BFF" tilt={-8} className="hv hv--l" />
            <PhoneArt w={140} h={274} tone="#B8F23A" className="hv hv--c" />
            <PhoneArt w={110} h={218} tone="#7C93FF" tilt={8} className="hv hv--r" />
            <span className="chip chip--accent hv-chip hv-chip--a">گرید A · باتری {toFa(91)}٪</span>
            <span className="chip chip--white hv-chip hv-chip--b">بازرسی {toFa(100)} نقطه‌ای ✓</span>
          </div>
        </div>
      </section>

      <section className="section container">
        <h2>دسته‌بندی‌ها</h2>
        <div className="cats">
          {categories.map((c) => (
            <Link key={c.id} to={`/products?cat=${c.id}`} className="cat">
              <PhoneArt kind={c.id} tone={c.tone} w={c.id === 'phone' ? 46 : 54} h={c.id === 'phone' ? 90 : 86} />
              <div>
                <strong>{c.title}</strong>
                <span className="cat__count">{count(c.count)} دستگاه</span>
                <small>{c.brands.join(' · ')}</small>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="section__head">
          <h2>تازه‌ترین دستگاه‌ها</h2>
          <Link to="/products" className="link">مشاهدهٔ همه ←</Link>
        </div>
        <div className="grid">{newest.map((p) => <ProductCard key={p.code} p={p} />)}</div>
      </section>

      <section className="section container">
        <div className="band">
          <h2>چطور کار می‌کند؟</h2>
          <div className="steps">
            {steps.map(([n, t, d]) => (
              <div key={n} className="step"><b>{n}</b><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
