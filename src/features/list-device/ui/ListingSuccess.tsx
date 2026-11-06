import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'

export function ListingSuccess({ onAnother }: { onAnother: () => void }) {
  return (
    <div className="container page narrow">
      <div className="panel">
        <h1 className="page__title">درخواست شما آماده است ✓</h1>
        <p>در نسخهٔ نهایی، آگهی بعد از بازرسی و پردازش عکس‌ها (حذف پس‌زمینه و پاک‌سازی اطلاعات) منتشر می‌شود. این دستگاه در «دستگاه‌های من» ثبت شد.</p>
        <p className="notice">نسخهٔ نمایشی: عکس‌ها فقط در همین مرورگر پردازش شدند و هیچ‌چیز به سرور ارسال نشد.</p>
        <div className="btn-row">
          <button className="btn btn--primary" onClick={onAnother}>ثبت دستگاه دیگر</button>
          <Link to={paths.devices} className="btn btn--outline">دستگاه‌های من</Link>
        </div>
      </div>
    </div>
  )
}
