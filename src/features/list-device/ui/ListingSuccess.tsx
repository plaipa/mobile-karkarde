import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'

export function ListingSuccess({ photosSaved, onAnother }: { photosSaved: boolean | null; onAnother: () => void }) {
  return (
    <div className="container page narrow">
      <div className="panel">
        <h1 className="page__title">درخواست شما آماده است ✓</h1>
        <p>در نسخهٔ نهایی، آگهی بعد از بازرسی و پردازش عکس‌ها (حذف پس‌زمینه و پاک‌سازی اطلاعات) منتشر می‌شود. این دستگاه در «دستگاه‌های من» ثبت شد.</p>
        {photosSaved === false
          ? <p className="error" role="alert">ذخیرهٔ عکس‌ها در این مرورگر ممکن نشد (حافظه پر است یا مرورگر در حالت خصوصی است). مشخصات دستگاه ثبت شد، ولی بازرس عکسی نمی‌بیند.</p>
          : <p className="notice">نسخهٔ آزمایشی: دستگاه و عکس‌ها فقط در همین مرورگر ذخیره شدند و به سرور ارسال نشدند.</p>}
        <div className="btn-row">
          <button className="btn btn--primary" onClick={onAnother}>ثبت دستگاه دیگر</button>
          <Link to={paths.devices} className="btn btn--outline">دستگاه‌های من</Link>
        </div>
      </div>
    </div>
  )
}
