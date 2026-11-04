import type { Category } from '@/entities/category'
import type { ListingForm } from '../model/types'
import './list-device.css'

interface Props {
  category: Category
  form: ListingForm
  onChange: (patch: Partial<ListingForm>) => void
}

export function DeviceInfoFields({ category, form, onChange }: Props) {
  const isWatch = category.id === 'watch'
  const hasHealth = category.id !== 'speaker'
  return (
    <section className="panel">
      <h2>اطلاعات دستگاه</h2>
      <div className="fields">
        <label>برند
          <select className="input" value={form.brand} onChange={(e) => onChange({ brand: e.target.value })}>
            <option value="">انتخاب کنید</option>
            {category.brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <label>مدل
          <input className="input" value={form.model} onChange={(e) => onChange({ model: e.target.value })} placeholder="مثلاً آیفون ۱۳ پرو مکس" />
        </label>
        {hasHealth && (
          <label>{isWatch ? 'اندازه' : 'حافظه'}
            <input className="input" value={form.storage} onChange={(e) => onChange({ storage: e.target.value })} placeholder={isWatch ? '۴۵ میلی‌متر' : '۲۵۶ گیگابایت'} />
          </label>
        )}
        {hasHealth && (
          <label>سلامت باتری (٪)
            <input className="input" inputMode="numeric" value={form.battery} onChange={(e) => onChange({ battery: e.target.value })} placeholder="۸۹" />
          </label>
        )}
        <label>رنگ
          <input className="input" value={form.color} onChange={(e) => onChange({ color: e.target.value })} />
        </label>
        <label>IMEI / شمارهٔ سریال <small className="muted">فقط برای تأیید ما؛ هرگز نمایش داده نمی‌شود</small>
          <input className="input" dir="ltr" inputMode="numeric" value={form.imei} onChange={(e) => onChange({ imei: e.target.value })} />
        </label>
        <label className="fields__wide">توضیحات
          <textarea className="input" rows={3} value={form.notes} onChange={(e) => onChange({ notes: e.target.value })} placeholder="وضعیت ظاهری، تعویضی‌ها، لوازم همراه…" />
        </label>
      </div>
    </section>
  )
}
