import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'

export function ListingSuccess({ photosSaved, onAnother }: { photosSaved: boolean | null; onAnother: () => void }) {
  return (
    <div className="container page narrow">
      <div className="panel">
        <h1 className="page__title">درخواست شما آماده است ✓</h1>
        <p>دستگاه ثبت شد و منتظر بازرسی کارشناس ماست. بعد از تأیید، با قیمتی که کارشناس تعیین می‌کند در لیست قیمت می‌آید. وضعیتش را در «دستگاه‌های من» ببینید.</p>
        {photosSaved === false
          ? <p className="error" role="alert">بعضی عکس‌ها ارسال نشد (اتصال ضعیف بود). مشخصات دستگاه ثبت شد، ولی ممکن است کارشناس همهٔ عکس‌ها را نبیند؛ از «دستگاه‌های من» بررسی کنید.</p>
          : photosSaved === true && <p className="notice">عکس‌ها هم ذخیره شد. پس‌زمینهٔ عکس‌ها به‌صورت خودکار حذف و با پس‌زمینهٔ استاندارد عوض می‌شود؛ این کار چند دقیقه طول می‌کشد. عکس اصلی شما برای کارشناس هم می‌ماند.</p>}
        <div className="btn-row">
          <button className="btn btn--primary" onClick={onAnother}>ثبت دستگاه دیگر</button>
          <Link to={paths.devices} className="btn btn--outline">دستگاه‌های من</Link>
        </div>
      </div>
    </div>
  )
}
