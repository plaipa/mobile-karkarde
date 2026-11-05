import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'
import { whatsappLink } from '@/shared/config/support'
import { toFa } from '@/shared/lib/format'
import { useInView } from '@/shared/lib/use-in-view'
import { checklist, counters, grades, journey, knots, privacy, sampleReport } from '../model/content'
import { Counter } from './Counter'
import { Kashida } from './Kashida'
import './about.css'

export function CounterStrip() {
  return (
    <section className="container">
      <div className="counters">
        {counters.map((c) => <Counter key={c.label} {...c} />)}
      </div>
    </section>
  )
}

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: React.ReactNode; lead?: string }) {
  return (
    <header className="ab-head">
      <p className="ab-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {lead && <p className="ab-head__lead">{lead}</p>}
    </header>
  )
}

export function Knots() {
  return (
    <section className="container ab-section">
      <SectionHead eyebrow="چرا موبایل کارکرده" title={<>بازار کارکرده سه گره دارد.<br />ما هر سه را باز کرده‌ایم.</>} />
      <ol className="knots">
        {knots.map((k, i) => (
          <li key={k.problem} className="knot">
            <span className="knot__n">{toFa(i + 1)}</span>
            <s className="knot__problem">{k.problem}</s>
            <p className="knot__answer">{k.answer}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Journey() {
  const [ref, seen] = useInView<HTMLOListElement>(0.25)
  return (
    <section className="container ab-section">
      <SectionHead
        eyebrow="مسیر یک گوشی"
        title="از دست فروشنده تا قفسهٔ شما"
        lead="هر دستگاه پنج ایستگاه را پشت سر می‌گذارد. هیچ‌کدام را جا نمی‌اندازیم."
      />
      <ol ref={ref} className={`track${seen ? ' is-seen' : ''}`}>
        {journey.map((s, i) => (
          <li key={s.title} className="stop" style={{ '--i': i } as React.CSSProperties}>
            <span className="stop__node">{toFa(i + 1)}</span>
            <span className="stop__tag">{s.tag}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ReportCard() {
  const r = sampleReport
  return (
    <figure className="report" aria-label="نمونهٔ گزارش بازرسی">
      <div className="report__head">
        <div>
          <small>گزارش بازرسی</small>
          <strong dir="ltr">{r.model}</strong>
          <span>{r.spec}</span>
        </div>
        <span className="report__grade">{r.grade}</span>
      </div>
      <div className="report__battery">
        <div className="report__battery-label">
          <span>سلامت باتری</span>
          <b>{toFa(r.battery)}٪</b>
        </div>
        <div className="report__bar"><i style={{ width: `${r.battery}%` }} /></div>
      </div>
      <ul className="report__rows">
        {r.rows.map((row) => (
          <li key={row.label}>
            <span>{row.label}</span>
            <b><i aria-hidden="true">✓</i>{row.value}</b>
          </li>
        ))}
      </ul>
      <figcaption className="report__foot">
        <span>۱۰۰ از ۱۰۰ نقطه تست شد</span>
        <span className="report__stamp">تأیید شد</span>
      </figcaption>
    </figure>
  )
}

export function Inspection() {
  return (
    <section className="container ab-section">
      <div className="inspect">
        <div className="inspect__text">
          <SectionHead
            eyebrow="بازرسی ۱۰۰ نقطه‌ای"
            title="چیزی را می‌فروشیم که خودمان باز کرده‌ایم."
            lead="هر دستگاه یک گزارش دارد. همان چیزی که ما می‌بینیم، شما هم پیش از خرید می‌بینید."
          />
          <ul className="checks">
            {checklist.map((c) => (
              <li key={c.title} className="check">
                <strong>{c.title}</strong>
                <small>{c.text}</small>
              </li>
            ))}
          </ul>
        </div>
        <ReportCard />
      </div>
    </section>
  )
}

export function Grades() {
  return (
    <section className="container ab-section">
      <SectionHead
        eyebrow="گریدبندی"
        title="یک حرف، به‌جای ده‌ها سؤال"
        lead="گرید روی هر دستگاه یعنی لازم نیست برای فهمیدن وضعیتش زنگ بزنید."
      />
      <div className="grades">
        {grades.map((g) => (
          <article key={g.id} className={`grade grade--${g.id}`}>
            <span className="grade__letter">{g.id}</span>
            <h3>{g.name}</h3>
            <p>{g.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export function Privacy() {
  return (
    <section className="container ab-section">
      <div className="privacy">
        <div className="privacy__text">
          <SectionHead eyebrow="حریم فروشنده" title="خریدار شما را نمی‌بیند. فقط ما را می‌بیند." />
          <ul className="privacy__list">
            {privacy.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
        <div className="chain" aria-label="خریدار و فروشنده فقط از طریق موبایل کارکرده با هم در ارتباط‌اند">
          <div className="chain__node">
            <b>خریدار</b>
            <small>همکار خرید</small>
          </div>
          <span className="chain__link" aria-hidden="true" />
          <div className="chain__node chain__node--hub">
            <b>موبایل کارکرده</b>
            <small>قیمت، تست، ارسال</small>
          </div>
          <span className="chain__link" aria-hidden="true" />
          <div className="chain__node chain__node--masked">
            <b>فروشنده</b>
            <small>هویت محفوظ</small>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Manifesto() {
  return (
    <section className="container ab-section">
      <blockquote className="manifesto">
        <p>
          بازار کارکرده با اعتماد زنده است. ما این اعتماد را روی یک خط{' '}
          <Kashida before="کش" after="یده‌ایم" length={5} />: <em>تست، گرید، قیمت روز.</em>
        </p>
      </blockquote>
    </section>
  )
}

export function JoinCta() {
  return (
    <section className="container ab-section ab-section--last">
      <div className="join">
        <div>
          <h2>آمادهٔ همکاری هستید؟</h2>
          <p>ثبت‌نام همکاران رایگان است. پس از تأیید مدارک، لیست قیمت عمده و خرید برایتان باز می‌شود.</p>
        </div>
        <div className="join__cta">
          <Link className="btn btn--dark btn--lg" to={paths.login}>ثبت‌نام همکار</Link>
          <a className="btn join__ghost btn--lg" href={whatsappLink()} target="_blank" rel="noreferrer">گفتگو در واتساپ</a>
        </div>
      </div>
    </section>
  )
}
