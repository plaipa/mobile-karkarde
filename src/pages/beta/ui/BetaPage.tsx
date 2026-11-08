import { useState } from 'react'
import { Link } from 'react-router-dom'
import { beta } from '@/shared/config/beta'
import { paths } from '@/shared/config/routes'
import { adminPhones } from '@/shared/config/staff'
import { telegramLink, whatsappLink } from '@/shared/config/support'
import { toFa } from '@/shared/lib/format'
import { resetTestData } from '@/shared/lib/reset-test-data'
import './beta.css'

const scenarios: readonly { title: string; steps: string }[] = [
  { title: '۱. ورود همکار و دیدن قیمت‌ها', steps: 'از «ورود همکار» با یک شمارهٔ دلخواه و کد ۱۲۳۴ وارد شوید. لیست قیمت را مرور و فیلتر کنید و یک دستگاه را به سبد اضافه کنید.' },
  { title: '۲. ثبت دستگاه با عکس', steps: 'از «ثبت دستگاه» مشخصات را پر کنید، همهٔ عکس‌های اجباری را بگیرید یا از گالری انتخاب کنید و ثبت نهایی را بزنید. بعد در «دستگاه‌های من» عکس‌ها و وضعیت «در انتظار بازرسی» را ببینید.' },
  { title: '۳. تعیین بازرس (ادمین)', steps: 'با شمارهٔ ادمین وارد شوید، به «پنل ادمین» بروید و یک شمارهٔ دیگر را به‌عنوان بازرس اضافه کنید.' },
  { title: '۴. بازرسی', steps: 'با شمارهٔ بازرس وارد شوید (بهتر است در همان مرورگر). در «پنل بازرس» عکس‌های دستگاه را باز کنید و یک بار تأیید و یک بار با ذکر دلیل رد کنید.' },
  { title: '۵. نتیجه برای همکار', steps: 'دوباره با شمارهٔ همکار وارد شوید و در «دستگاه‌های من» وضعیت و دلیل رد را ببینید.' },
]

/** «راهنمای تست»: how to try every flow, the sample accounts, feedback links and a reset button for testers. */
export function BetaPage() {
  const [cleared, setCleared] = useState(false)
  const feedback = `سلام، بازخورد من دربارهٔ ${beta.label} (${beta.build}):\n`

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.home}>خانه</Link> / راهنمای تست</nav>
      <h1 className="page__title">راهنمای تست · {beta.build}</h1>
      <p className="muted">این سایت در حالت آزمایشی است: ورود با پیامک و سرور هنوز وصل نیست و همهٔ اطلاعات (دستگاه‌ها، عکس‌ها، بازرس‌ها) فقط در همین مرورگر می‌ماند. هر مرحله را امتحان کنید و هر چیزی که گیج‌کننده یا خراب بود برایمان بفرستید.</p>

      <section className="panel beta__section">
        <h2>حساب‌های آزمایشی</h2>
        <ul className="beta__accounts">
          <li><b>همکار</b><span>هر شمارهٔ ۱۱ رقمی با ۰۹ <small>مثلاً <bdi dir="ltr">{toFa('09121234567')}</bdi></small></span></li>
          <li><b>ادمین</b><span><bdi dir="ltr">{toFa(adminPhones[0] ?? '')}</bdi></span></li>
          <li><b>بازرس</b><span>هر شماره‌ای که ادمین اضافه کند</span></li>
          <li><b>کد پیامک</b><span>هر عدد ۴ تا ۶ رقمی <small>مثلاً {toFa('1234')}</small></span></li>
        </ul>
        <p className="muted">همهٔ نقش‌ها باید در یک مرورگر و روی یک دستگاه تست شوند، چون داده‌ها فقط همان‌جا ذخیره می‌شود. برای عوض‌کردن نقش «خروج» بزنید و با شمارهٔ دیگر وارد شوید.</p>
      </section>

      <section className="panel beta__section">
        <h2>سناریوهای تست</h2>
        <ol className="beta__steps">
          {scenarios.map((s) => (
            <li key={s.title}><b>{s.title}</b><p>{s.steps}</p></li>
          ))}
        </ol>
      </section>

      <section className="panel beta__section">
        <h2>ارسال بازخورد</h2>
        <p className="muted">چیزی که دیدید، روی کدام صفحه بود و با چه گوشی و مرورگری؟ یک عکس از صفحه هم کمک می‌کند.</p>
        <div className="btn-row">
          <a className="btn btn--primary" href={whatsappLink(feedback)} target="_blank" rel="noreferrer">واتس‌اپ</a>
          <a className="btn btn--outline" href={telegramLink()} target="_blank" rel="noreferrer">تلگرام</a>
        </div>
      </section>

      <section className="panel beta__section">
        <h2>شروع از اول</h2>
        <p className="muted">ورود، دستگاه‌ها، عکس‌ها و فهرست بازرس‌های این مرورگر پاک می‌شود. برای دور تازهٔ تست بزنید.</p>
        <div className="btn-row">
          <button className="btn btn--outline" onClick={() => { void resetTestData().then(() => setCleared(true)) }}>پاک‌کردن داده‌های آزمایشی</button>
        </div>
        {cleared && <p role="status" className="beta__done">پاک شد. صفحه را دوباره باز کنید تا از اول شروع شود.</p>}
      </section>
    </div>
  )
}
