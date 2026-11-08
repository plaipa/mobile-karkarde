import { useState } from 'react'
import { Link } from 'react-router-dom'
import { beta } from '@/shared/config/beta'
import { paths } from '@/shared/config/routes'
import { telegramLink, whatsappLink } from '@/shared/config/support'
import { toFa } from '@/shared/lib/format'
import { resetTestData } from '@/shared/lib/reset-test-data'
import './beta.css'

const scenarios: readonly { title: string; steps: string }[] = [
  { title: '۱. ورود همکار و دیدن قیمت‌ها', steps: 'از «ورود همکار» با یک شمارهٔ دلخواه و کد ۱۲۳۴ وارد شوید. لیست قیمت را مرور و فیلتر کنید و یک دستگاه را به سبد اضافه کنید.' },
  { title: '۲. ثبت دستگاه با عکس', steps: 'از «ثبت دستگاه» مشخصات را پر کنید، همهٔ عکس‌های اجباری را بگیرید یا از گالری انتخاب کنید و ثبت نهایی را بزنید. بعد در «دستگاه‌های من» عکس‌ها و وضعیت «در انتظار بازرسی» را ببینید.' },
  { title: '۳. تعیین کارشناس (ادمین)', steps: 'ادمین وارد «پنل ادمین» می‌شود، نام و شمارهٔ کارشناس را می‌نویسد و کد ورود او را به خودش می‌دهد.' },
  { title: '۴. بازرسی و انتشار', steps: 'کارشناس با شماره و کد خودش وارد می‌شود، در «پنل کارشناس» عکس‌های دستگاه را می‌بیند و یا با گرید و قیمت تأیید می‌کند (دستگاه در لیست قیمت منتشر می‌شود) و یا با نوشتن دلیل رد می‌کند.' },
  { title: '۵. نتیجه برای همکار و خریدار', steps: 'همکار در «دستگاه‌های من» وضعیت و دلیل رد را می‌بیند. دستگاه تأییدشده با قیمتش در لیست قیمت برای همکاران واردشده دیده می‌شود.' },
  { title: '۶. ایمیل و تأیید دو مرحله‌ای', steps: 'در «تنظیمات حساب» ایمیل و رمز ثبت کنید، کد ۶ رقمی را از ایمیلتان وارد کنید، سپس خارج شوید و با «ورود با ایمیل» وارد شوید. تأیید دو مرحله‌ای را هم روشن و امتحان کنید.' },
]

/** «راهنمای تست»: how to try every flow, the sample accounts, feedback links and a reset button for testers. */
export function BetaPage() {
  const [cleared, setCleared] = useState(false)
  const feedback = `سلام، بازخورد من دربارهٔ ${beta.label} (${beta.build}):\n`

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.home}>خانه</Link> / راهنمای تست</nav>
      <h1 className="page__title">راهنمای تست · {beta.build}</h1>
      <p className="muted">این سایت در حالت آزمایشی است: ورود با پیامک و سرور هنوز وصل نیست و همهٔ اطلاعات (دستگاه‌ها، عکس‌ها، کارشناس‌ها) فقط در همین مرورگر می‌ماند. هر مرحله را امتحان کنید و هر چیزی که گیج‌کننده یا خراب بود برایمان بفرستید.</p>

      <section className="panel beta__section">
        <h2>حساب‌های آزمایشی</h2>
        <ul className="beta__accounts">
          <li><b>همکار</b><span>هر شمارهٔ ۱۱ رقمی با ۰۹ <small>مثلاً <bdi dir="ltr">{toFa('09121234567')}</bdi></small></span></li>
          <li><b>کد پیامک همکار</b><span>{toFa('1234')} <small>(پیامک هنوز ارسال نمی‌شود)</small></span></li>
          <li><b>ادمین و کارشناس</b><span>شمارهٔ ادمین و کد ورود را مدیر پروژه می‌دهد؛ کارشناس را ادمین اضافه می‌کند</span></li>
        </ul>
        <p className="muted">برای عوض‌کردن نقش «خروج» بزنید و با شمارهٔ دیگر وارد شوید. نقش‌ها روی دستگاه‌های جدا هم کار می‌کنند.</p>
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
        <h2>خروج و پاک‌کردن این مرورگر</h2>
        <p className="muted">ورود و تنظیمات این مرورگر (شهر، سبد، اندازهٔ نوشته) پاک می‌شود. دستگاه‌ها و عکس‌های ثبت‌شده روی سرور می‌مانند.</p>
        <div className="btn-row">
          <button className="btn btn--outline" onClick={() => { void resetTestData().then(() => setCleared(true)) }}>خروج و پاک‌کردن</button>
        </div>
        {cleared && <p role="status" className="beta__done">انجام شد. صفحه را دوباره باز کنید.</p>}
      </section>
    </div>
  )
}
