import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { PhoneArt } from '../components/PhoneArt'
import { count, toFa } from '../lib/format'

const journey = [
  ['۱', 'دریافت از همکار', 'فروشنده با قالب مخصوص از زوایای مشخص عکس می‌گیرد و مشخصات را ثبت می‌کند.', 'ثبت آگهی'],
  ['۲', 'بازرسی و تست', 'نمایشگر، باتری، دوربین‌ها، شبکه و قفل حساب با چک‌لیست ۱۰۰ نقطه‌ای بررسی می‌شود.', '۱۰۰ نقطه'],
  ['۳', 'استانداردسازی عکس‌ها', 'پس‌زمینه حذف می‌شود، اطلاعات پنهان عکس پاک می‌شود و هویت فروشنده نامرئی می‌ماند.', 'هویت پنهان'],
  ['۴', 'گریدبندی و قیمت', 'گرید A/B/C مشخص می‌شود و قیمت عمده با توجه به بازار تعیین می‌شود.', 'گرید و قیمت'],
  ['۵', 'فروش و ارسال', 'سفارش فقط از طریق ما هماهنگ می‌شود و ظرف ۴۸ ساعت ارسال می‌شود.', '۴۸ ساعت'],
]

const checks = [
  ['نمایشگر و لمس', 'پیکسل سوخته، لکه و حساسیت لمس'],
  ['سلامت باتری', 'درصد واقعی و شارژ‌پذیری'],
  ['دوربین‌ها', 'فوکوس، لنز و فلاش'],
  ['سیم‌کارت و آنتن', 'مخابرات، وای‌فای و بلوتوث'],
  ['بدنه و قاب', 'خط‌وخش، ضربه و تعویض قطعه'],
  ['قفل و رجیستری', 'خاموش بودن حساب و وضعیت رجیستر'],
]

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen] as const
}

function Counter({ to, suffix = '', label }: { to: number; suffix?: string; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const k = Math.min((t - t0) / 1200, 1)
      setV(Math.round(to * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to])
  return (
    <div ref={ref} className="counter">
      <b>{count(v)}{suffix}</b>
      <span>{label}</span>
    </div>
  )
}

export default function About() {
  return (
    <>
      <section className="ab-hero">
        <i className="ab-glow ab-glow--1" /><i className="ab-glow ab-glow--2" />
        <div className="container ab-hero__row">
          <div className="ab-hero__phones" aria-hidden="true">
            <PhoneArt w={150} h={296} tone="#2F5BFF" tilt={-10} className="ap ap--l" />
            <PhoneArt w={190} h={374} tone="#B8F23A" className="ap ap--c" />
            <PhoneArt w={150} h={296} tone="#7C93FF" tilt={10} className="ap ap--r" />
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
            <div className="hero__cta">
              <Link to="/login" className="btn btn--accent btn--lg">ثبت‌نام همکار</Link>
              <Link to="/products" className="btn btn--ghost btn--lg">مشاهدهٔ محصولات</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="counters">
          <Counter to={350} suffix="+" label="همکار فعال" />
          <Counter to={12000} suffix="+" label="دستگاه فروخته‌شده" />
          <Counter to={100} label="نقطهٔ بازرسی" />
          <Counter to={48} suffix=" ساعت" label="زمان ارسال" />
        </div>
      </section>

      <section className="container ab-section">
        <div className="ab-title">
          <span className="chip chip--primary">مسیر یک گوشی</span>
          <h2>از دست فروشنده تا دست شما</h2>
          <p>هر گوشی پنج مرحله را طی می‌کند</p>
        </div>
        <ol className="timeline">
          {journey.map(([n, t, d, tag]) => (
            <li key={n} className="tl">
              <div className="tl__card">
                <span className="chip chip--dark">{tag}</span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
              <span className="tl__node">{n}</span>
              <span className="tl__empty" />
            </li>
          ))}
        </ol>
      </section>

      <section className="container ab-section">
        <h2 className="ab-h2">بازرسی ۱۰۰ نقطه‌ای؛ چه چیزهایی را چک می‌کنیم؟</h2>
        <div className="checks">
          {checks.map(([t, d]) => (
            <div key={t} className="check-card">
              <span className="tick">✓</span>
              <div><strong>{t}</strong><small>{d}</small></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container ab-section">
        <div className="anon">
          <h2>هویت هر دو طرف نزد ما محفوظ است</h2>
          <div className="anon__flow">
            <div className="anon__node"><strong>همکار خریدار</strong><small>فقط کد آگهی را می‌بیند</small></div>
            <span className="anon__arrow">⇄</span>
            <div className="anon__node anon__node--hi"><strong>موبایل کارکرده</strong><small>واسطه، بازرسی و هماهنگی</small></div>
            <span className="anon__arrow">⇄</span>
            <div className="anon__node"><strong>همکار فروشنده</strong><small>نام و شماره‌اش دیده نمی‌شود</small></div>
          </div>
          <p>عکس‌ها بدون موقعیت مکانی، نام دستگاه و پس‌زمینهٔ شخصی منتشر می‌شوند.</p>
        </div>
      </section>

      <section className="container ab-section">
        <div className="cta-band">
          <div>
            <h2>آمادهٔ همکاری هستید؟</h2>
            <p>ثبت‌نام رایگان است و بعد از تأیید، قیمت‌های عمده را می‌بینید.</p>
          </div>
          <Link to="/login" className="btn btn--dark btn--lg">ثبت‌نام همکار</Link>
        </div>
      </section>
    </>
  )
}
