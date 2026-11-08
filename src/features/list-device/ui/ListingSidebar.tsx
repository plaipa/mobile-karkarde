import { Link } from 'react-router-dom'
import type { CategoryId } from '@/entities/category'
import { paths } from '@/shared/config/routes'
import './list-device.css'

interface Props {
  category: CategoryId
  unlocked: boolean
  errors: readonly string[]
  submitting: boolean
  onUnlockedChange: (value: boolean) => void
  /** Back to the device-details step. */
  onBack: () => void
}

export function ListingSidebar({ category, unlocked, errors, submitting, onUnlockedChange, onBack }: Props) {
  return (
    <aside className="upload__side">
      <div className="panel tip">
        <h3>نکات عکس‌برداری</h3>
        <ul>
          <li>پس‌زمینهٔ ساده و روشن انتخاب کنید.</li>
          <li>از نور طبیعی و بدون فلاش استفاده کنید.</li>
          <li>گوشی را داخل کادر راهنما قرار دهید.</li>
          <li>قاب و محافظ را قبل از عکس بردارید.</li>
        </ul>
      </div>
      <div className="panel tip tip--ok">
        <h3>پردازش خودکار عکس‌ها</h3>
        <p>پس‌زمینه حذف و با پس‌زمینهٔ استاندارد جایگزین می‌شود و اطلاعات مکانی عکس پاک می‌شود. هویت شما برای خریداران نمایش داده نمی‌شود.</p>
      </div>
      <div className="panel tip tip--warn">
        <h3>اسکرین‌شات‌ها</h3>
        <p>قبل از گرفتن اسکرین‌شات، نام اپل‌آیدی، شماره و نام دستگاه را از صفحه پاک کنید.</p>
      </div>
      {category !== 'speaker' && (
        <label className="panel check check--box">
          <input type="checkbox" checked={unlocked} onChange={(e) => onUnlockedChange(e.target.checked)} />
          تأیید می‌کنم قفل حساب (iCloud / Google / Samsung) دستگاه خاموش است و از حساب خارج شده‌ام.
        </label>
      )}
      {errors.length > 0 && <ul className="error-list" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
      <p className="muted listing__legal">با ثبت نهایی، <Link to={paths.terms}>شرایط استفاده</Link> و <Link to={paths.privacy}>حریم خصوصی</Link> را می‌پذیرید.</p>
      <button className="btn btn--primary btn--lg btn--block" disabled={submitting}>{submitting ? 'در حال ارسال عکس‌ها…' : 'ثبت نهایی دستگاه'}</button>
      <button type="button" className="btn btn--outline btn--block" onClick={onBack}>برگشت به مشخصات</button>
    </aside>
  )
}
