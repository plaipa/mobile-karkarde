import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories, gradeInfo, photoAngles, products } from '../data'
import { toFa } from '../lib/format'
import { useCart } from '../lib/cart'
import { PhoneArt } from '../components/PhoneArt'
import { PriceTag, ProductCard } from '../components/ProductCard'

export default function ProductPage() {
  const { code } = useParams()
  const p = products.find((x) => x.code === code)
  const cart = useCart()
  const [angle, setAngle] = useState(photoAngles[0].id)
  if (!p) return <div className="container page"><p className="empty">این دستگاه پیدا نشد. <Link to="/products">بازگشت به محصولات</Link></p></div>
  const cat = categories.find((c) => c.id === p.category)!
  const similar = products.filter((x) => x.category === p.category && x.code !== p.code).slice(0, 4)
  const rows: [string, string][] = [
    ['برند', p.brand],
    ['رنگ', p.color],
    ...(p.storage ? ([[p.category === 'watch' ? 'اندازه' : 'حافظه', p.storage]] as [string, string][]) : []),
    ...(p.battery ? ([['سلامت باتری', `${toFa(p.battery)}٪`]] as [string, string][]) : []),
    ['رجیستری', p.category === 'phone' ? (p.registered ? 'انجام شده' : 'انجام نشده') : 'ندارد'],
    ['گارانتی', p.warranty ? '۳ ماه گارانتی موبایل کارکرده' : 'ندارد'],
    ...(p.category !== 'speaker' ? ([['قفل حساب', 'خاموش (تأیید شده)']] as [string, string][]) : []),
  ]
  const report: [string, string, 'ok' | 'warn'][] = [
    ['نمایشگر و لمس', 'سالم', 'ok'],
    ['باتری', p.battery ? `${toFa(p.battery)}٪ · قابل قبول` : 'سالم', 'ok'],
    ['عملکرد', 'سالم', 'ok'],
    ['بدنه', p.grade === 'A' ? 'بدون عیب قابل توجه' : p.notes, p.grade === 'A' ? 'ok' : 'warn'],
  ]
  return (
    <div className="container page">
      <p className="crumbs"><Link to="/">خانه</Link> / <Link to={`/products?cat=${p.category}`}>{cat.title}</Link> / {p.name}</p>
      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__main">
            <span className="chip chip--white">{photoAngles.find((a) => a.id === angle)?.label}</span>
            <i className="halo" />
            <PhoneArt kind={p.category} tone={cat.tone} w={p.category === 'phone' ? 190 : 200} h={p.category === 'phone' ? 380 : 320} />
          </div>
          <div className="thumbs">
            {photoAngles.map((a) => (
              <button key={a.id} className={`thumb${a.id === angle ? ' is-on' : ''}`} onClick={() => setAngle(a.id)}>
                <PhoneArt kind={p.category} tone={cat.tone} w={26} h={p.category === 'phone' ? 52 : 40} />
                <span>{a.label}</span>
              </button>
            ))}
          </div>
          <p className="muted small">عکس‌ها پس از حذف پس‌زمینه و پاک‌سازی اطلاعات پنهان منتشر می‌شوند. (در این نمونه به‌جای عکس واقعی، تصویر نمادین نمایش داده می‌شود.)</p>
        </div>
        <div className="pdp__info">
          <div className="chips">
            <span className="chip chip--soft">{p.brand}</span>
            <span className={`chip chip--${p.grade}`}>گرید {p.grade}</span>
            <span className="chip chip--muted">کد: MK-{toFa(p.code.slice(3))}</span>
          </div>
          <h1>{p.name}</h1>
          <p className="muted">{p.color} · {p.notes}</p>
          <dl className="specs">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <div className="buybox">
            <small>قیمت همکار</small>
            <PriceTag price={p.price} />
            <div className="buybox__row">
              <button className="btn btn--primary btn--lg" onClick={() => cart.add(p.code)} disabled={cart.has(p.code)}>{cart.has(p.code) ? 'در سبد شما' : 'افزودن به سبد'}</button>
              <Link to="/cart" className="btn btn--outline btn--lg">مشاهدهٔ سبد</Link>
            </div>
          </div>
          <p className="callout">🔒 اطلاعات فروشنده نزد ما محفوظ است. سفارش از طریق موبایل کارکرده هماهنگ می‌شود.</p>
          <p className="muted small">{gradeInfo[p.grade]}</p>
        </div>
      </div>
      <section className="section">
        <h2>گزارش بازرسی</h2>
        <div className="report">
          {report.map(([t, s, st]) => (
            <div key={t} className="report__item"><span>{t}</span><span className={`chip chip--${st === 'ok' ? 'A' : 'B'}`}>{s}</span></div>
          ))}
        </div>
      </section>
      <section className="section">
        <h2>دستگاه‌های مشابه</h2>
        <div className="grid">{similar.map((x) => <ProductCard key={x.code} p={x} />)}</div>
      </section>
    </div>
  )
}
