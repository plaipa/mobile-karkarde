import type { Category } from '@/entities/category'
import { serviceCities } from '@/shared/config/cities'
import { toEn } from '@/shared/lib/format'
import { asksBatteryCycles } from '../model/validate-listing'
import type { ListingForm } from '../model/types'
import { colorsFor, hasOfficialColors, modelsFor, storageOptions } from '../model/device-models'
import { ChoiceField } from './ChoiceField'
import './list-device.css'

interface Props {
  category: Category
  form: ListingForm
  onChange: (patch: Partial<ListingForm>) => void
}

export function DeviceInfoFields({ category, form, onChange }: Props) {
  const isWatch = category.id === 'watch'
  const hasHealth = category.id !== 'speaker'
  const askCycles = asksBatteryCycles(category.id, form.battery)
  return (
    <section className="panel">
      <h2>اطلاعات دستگاه</h2>
      <div className="fields">
        <label>شهر دستگاه
          <select className="input" value={form.city} onChange={(e) => onChange({ city: e.target.value })}>
            {serviceCities.map((c) => <option key={c.name} value={c.name} disabled={!c.active}>{c.active ? c.name : `${c.name} (به‌زودی)`}</option>)}
          </select>
        </label>
        <label>برند
          <select className="input" value={form.brand} onChange={(e) => onChange({ brand: e.target.value, model: '' })}>
            <option value="">انتخاب کنید</option>
            {category.brands.map((b) => <option key={b}>{b}</option>)}
          </select>
        </label>
        <ChoiceField
          key={`model-${form.brand}`}
          label="مدل"
          value={form.model}
          options={modelsFor(category.id, form.brand)}
          onChange={(model) => onChange({ model, ...(colorsFor(category.id, form.brand, model).includes(form.color) ? {} : { color: '' }) })}
          disabled={!form.brand}
          placeholder={form.brand ? 'انتخاب کنید' : 'ابتدا برند را انتخاب کنید'}
          otherPlaceholder="مثلاً آیفون ۱۳ پرو مکس"
        />
        {hasHealth && (
          <ChoiceField
            label={isWatch ? 'اندازه' : 'حافظه'}
            value={form.storage}
            options={storageOptions[category.id]}
            onChange={(storage) => onChange({ storage })}
            otherPlaceholder={isWatch ? '۴۵ میلی‌متر' : '۲۵۶ گیگابایت'}
          />
        )}
        {hasHealth && (
          <label>سلامت باتری (٪)
            <input className="input" inputMode="numeric" value={form.battery} onChange={(e) => onChange({ battery: e.target.value, ...(toEn(e.target.value).trim() === '100' ? {} : { batteryCycles: '' }) })} placeholder="۸۹" />
          </label>
        )}
        {askCycles && (
          <label>سایکل باتری
            <input className="input" inputMode="numeric" value={form.batteryCycles} onChange={(e) => onChange({ batteryCycles: e.target.value })} placeholder="۵۰" />
            <small className="muted">در تنظیمات گوشی: باتری، سلامت باتری. چون سلامت ۱۰۰٪ است، تعداد سایکل را هم می‌پرسیم.</small>
          </label>
        )}
        <ChoiceField
          key={`color-${form.brand}-${form.model}`}
          label={<>رنگ {hasOfficialColors(category.id, form.brand, form.model) && <small className="muted">رنگ‌های رسمی همین مدل</small>}</>}
          value={form.color}
          options={colorsFor(category.id, form.brand, form.model)}
          onChange={(color) => onChange({ color })}
          otherPlaceholder="نام رنگ"
        />
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
