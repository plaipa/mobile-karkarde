import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'
import { checklist, counters, journey } from '../model/content'
import { Counter } from './Counter'
import './about.css'

export function CounterStrip() {
  return (
    <section className="container">
      <div className="counters">
        {counters.map((c) => <Counter key={c.label} to={c.to} suffix={c.suffix} label={c.label} />)}
      </div>
    </section>
  )
}

export function Journey() {
  return (
    <section className="container ab-section">
      <div className="ab-title">
        <span className="chip chip--primary">مسیر یک گوشی</span>
        <h2>از دست فروشنده تا دست شما</h2>
        <p>هر گوشی پنج مرحله را طی می‌کند</p>
      </div>
      <ol className="timeline">
        {journey.map((step) => (
          <li key={step.n} className="tl">
            <div className="tl__card">
              <span className="chip chip--dark">{step.tag}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
            <span className="tl__node">{step.n}</span>
            <span className="tl__empty" />
          </li>
        ))}
      </ol>
    </section>
  )
}

export function InspectionChecklist() {
  return (
    <section className="container ab-section">
      <h2 className="ab-h2">بازرسی ۱۰۰ نقطه‌ای؛ چه چیزهایی را چک می‌کنیم؟</h2>
      <div className="checks">
        {checklist.map((item) => (
          <div key={item.title} className="check-card">
            <span className="tick">✓</span>
            <div><strong>{item.title}</strong><small>{item.text}</small></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function AnonymityDiagram() {
  return (
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
  )
}

export function JoinCta() {
  return (
    <section className="container ab-section">
      <div className="cta-band">
        <div>
          <h2>آمادهٔ همکاری هستید؟</h2>
          <p>ثبت‌نام رایگان است و بعد از تأیید، قیمت‌های عمده را می‌بینید.</p>
        </div>
        <Link to={paths.login} className="btn btn--dark btn--lg">ثبت‌نام همکار</Link>
      </div>
    </section>
  )
}
