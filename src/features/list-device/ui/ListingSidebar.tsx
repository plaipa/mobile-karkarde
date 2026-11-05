import type { CategoryId } from '@/entities/category'
import './list-device.css'

interface Props {
  category: CategoryId
  unlocked: boolean
  errors: readonly string[]
  onUnlockedChange: (value: boolean) => void
  /** Back to the device-details step. */
  onBack: () => void
}

export function ListingSidebar({ category, unlocked, errors, onUnlockedChange, onBack }: Props) {
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
      <button className="btn btn--primary btn--lg btn--block">ثبت نهایی دستگاه</button>
      <button type="button" className="btn btn--outline btn--block" onClick={onBack}>برگشت به مشخصات</button>
    </aside>
  )
}
