import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { categories, photoTemplates, type CategoryId, type PhotoSlot } from '../data'
import { CameraCapture } from '../components/CameraCapture'
import { PhoneArt } from '../components/PhoneArt'
import { containsContact, processImage, type Processed } from '../lib/image'
import { toFa } from '../lib/format'
import { useAuth } from '../lib/auth'

type Photos = Record<string, Processed>

const key = (cat: CategoryId, slot: string) => `${cat}:${slot}`

export default function Upload() {
  const { phone } = useAuth()
  const [cat, setCat] = useState<CategoryId>('phone')
  const [photos, setPhotos] = useState<Photos>({})
  const [busy, setBusy] = useState<string | null>(null)
  const [camSlot, setCamSlot] = useState<PhotoSlot | null>(null)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [form, setForm] = useState({ brand: '', model: '', storage: '', battery: '', imei: '', color: '', notes: '', unlocked: false })
  const photosRef = useRef(photos)
  photosRef.current = photos

  useEffect(() => () => { Object.values(photosRef.current).forEach((p) => URL.revokeObjectURL(p.url)) }, [])

  const category = categories.find((c) => c.id === cat)!
  const slots = photoTemplates[cat]
  const required = slots.filter((s) => s.required)
  const doneRequired = required.filter((s) => photos[key(cat, s.id)]).length
  const canCamera = useMemo(() => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia, [])

  const attach = async (slot: PhotoSlot, file: Blob) => {
    const k = key(cat, slot.id)
    setBusy(k)
    try {
      const p = await processImage(file)
      setPhotos((prev) => { if (prev[k]) URL.revokeObjectURL(prev[k].url); return { ...prev, [k]: p } })
    } catch {
      setErrors(['خواندن عکس ممکن نشد. فایل دیگری انتخاب کنید.'])
    } finally {
      setBusy(null)
    }
  }
  const remove = (slot: PhotoSlot) => {
    const k = key(cat, slot.id)
    setPhotos((prev) => { const n = { ...prev }; if (n[k]) URL.revokeObjectURL(n[k].url); delete n[k]; return n })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: string[] = []
    if (!form.brand) errs.push('برند را انتخاب کنید.')
    if (!form.model.trim()) errs.push('مدل دستگاه را وارد کنید.')
    if (cat !== 'speaker' && !/^\d{1,3}$/.test(form.battery.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))))) errs.push('سلامت باتری را به‌صورت عدد (۰ تا ۱۰۰) وارد کنید.')
    if (containsContact(form.notes) || containsContact(form.model)) errs.push('در توضیحات، شماره تلفن یا آیدی شبکه‌های اجتماعی مجاز نیست. ارتباط فقط از طریق موبایل کارکرده انجام می‌شود.')
    const missing = required.filter((s) => !photos[key(cat, s.id)])
    if (missing.length) errs.push(`عکس‌های اجباری باقی‌مانده: ${missing.map((s) => s.label).join('، ')}`)
    if (cat !== 'speaker' && !form.unlocked) errs.push('باید تأیید کنید که قفل حساب (iCloud / Google / Samsung) دستگاه خاموش است.')
    setErrors(errs)
    if (!errs.length) { setDone(true); window.scrollTo(0, 0) }
  }

  if (!phone) {
    return (
      <div className="container page narrow">
        <div className="panel"><h1 className="page__title">ثبت دستگاه برای فروش</h1><p>برای ثبت دستگاه ابتدا به‌عنوان همکار وارد شوید.</p><Link to="/login" className="btn btn--primary btn--lg">ورود همکار</Link></div>
      </div>
    )
  }
  if (done) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">درخواست شما آماده است ✓</h1>
          <p>در نسخهٔ نهایی، آگهی بعد از بازرسی و پردازش عکس‌ها (حذف پس‌زمینه و پاک‌سازی اطلاعات) منتشر می‌شود.</p>
          <p className="notice">نسخهٔ نمایشی: عکس‌ها فقط در همین مرورگر پردازش شدند و هیچ‌چیز به سرور ارسال نشد.</p>
          <button className="btn btn--primary" onClick={() => { setDone(false); setPhotos({}); setForm({ brand: '', model: '', storage: '', battery: '', imei: '', color: '', notes: '', unlocked: false }) }}>ثبت دستگاه دیگر</button>
        </div>
      </div>
    )
  }

  const camIndex = camSlot ? slots.findIndex((s) => s.id === camSlot.id) + 1 : 0
  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }))

  return (
    <div className="container page">
      <h1 className="page__title">ثبت دستگاه برای فروش</h1>
      <div className="tabs" role="tablist">
        {categories.map((c) => (
          <button key={c.id} role="tab" aria-selected={c.id === cat} className={`tab${c.id === cat ? ' is-on' : ''}`} onClick={() => { setCat(c.id); setErrors([]); setForm((f) => ({ ...f, brand: '' })) }}>{c.title}</button>
        ))}
      </div>

      <form onSubmit={submit} className="upload" noValidate>
        <div className="upload__main">
          <section className="panel">
            <h2>اطلاعات دستگاه</h2>
            <div className="fields">
              <label>برند
                <select className="input" value={form.brand} onChange={(e) => set({ brand: e.target.value })}>
                  <option value="">انتخاب کنید</option>
                  {category.brands.map((b) => <option key={b}>{b}</option>)}
                </select>
              </label>
              <label>مدل
                <input className="input" value={form.model} onChange={(e) => set({ model: e.target.value })} placeholder="مثلاً آیفون ۱۳ پرو مکس" />
              </label>
              {cat !== 'speaker' && (
                <label>{cat === 'watch' ? 'اندازه' : 'حافظه'}
                  <input className="input" value={form.storage} onChange={(e) => set({ storage: e.target.value })} placeholder={cat === 'watch' ? '۴۵ میلی‌متر' : '۲۵۶ گیگابایت'} />
                </label>
              )}
              {cat !== 'speaker' && (
                <label>سلامت باتری (٪)
                  <input className="input" inputMode="numeric" value={form.battery} onChange={(e) => set({ battery: e.target.value })} placeholder="۸۹" />
                </label>
              )}
              <label>رنگ
                <input className="input" value={form.color} onChange={(e) => set({ color: e.target.value })} />
              </label>
              <label>IMEI / شمارهٔ سریال <small className="muted">فقط برای تأیید ما؛ هرگز نمایش داده نمی‌شود</small>
                <input className="input" dir="ltr" inputMode="numeric" value={form.imei} onChange={(e) => set({ imei: e.target.value })} />
              </label>
              <label className="fields__wide">توضیحات
                <textarea className="input" rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="وضعیت ظاهری، تعویضی‌ها، لوازم همراه…" />
              </label>
            </div>
          </section>

          <section className="panel">
            <div className="upload__head">
              <h2>عکس‌های دستگاه</h2>
              <span className="chip chip--soft">{toFa(doneRequired)} از {toFa(required.length)} عکس اجباری</span>
            </div>
            <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={required.length} aria-valuenow={doneRequired}><i style={{ width: `${(doneRequired / required.length) * 100}%` }} /></div>
            <div className="slots">
              {slots.map((s) => {
                const k = key(cat, s.id)
                const p = photos[k]
                return (
                  <div key={s.id} className={`slot${p ? ' is-done' : ''}`}>
                    <div className="slot__box">
                      {p ? <img src={p.url} alt={s.label} /> : <PhoneArt kind={cat} tone="#8A93A6" w={cat === 'phone' ? 40 : 52} h={cat === 'phone' ? 80 : 64} className="slot__ghost" />}
                      {busy === k && <span className="slot__busy">در حال پردازش…</span>}
                      {p && <span className="slot__ok">✓</span>}
                    </div>
                    <div className="slot__meta">
                      <span className={`chip ${s.required ? 'chip--req' : 'chip--muted'}`}>{s.required ? 'اجباری' : 'اختیاری'}</span>
                      <strong>{s.label}</strong>
                    </div>
                    <small className="muted">{s.hint}</small>
                    {p?.warnings.map((w) => <small key={w} className="warn">⚠ {w}</small>)}
                    <div className="slot__actions">
                      {canCamera && !s.screenshot && <button type="button" className="btn btn--primary btn--sm" onClick={() => setCamSlot(s)}>{p ? 'گرفتن مجدد' : 'گرفتن عکس'}</button>}
                      <label className="btn btn--outline btn--sm">
                        {s.screenshot ? 'انتخاب اسکرین‌شات' : 'گالری'}
                        <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void attach(s, f); e.target.value = '' }} />
                      </label>
                      {p && <button type="button" className="btn btn--outline btn--sm" onClick={() => remove(s)}>حذف</button>}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <aside className="upload__side">
          <div className="panel tip"><h3>نکات عکس‌برداری</h3>
            <ul><li>پس‌زمینهٔ ساده و روشن انتخاب کنید.</li><li>از نور طبیعی و بدون فلاش استفاده کنید.</li><li>گوشی را داخل کادر راهنما قرار دهید.</li><li>قاب و محافظ را قبل از عکس بردارید.</li></ul>
          </div>
          <div className="panel tip tip--ok"><h3>پردازش خودکار عکس‌ها</h3><p>پس‌زمینه حذف و با پس‌زمینهٔ استاندارد جایگزین می‌شود و اطلاعات مکانی عکس پاک می‌شود. هویت شما برای خریداران نمایش داده نمی‌شود.</p></div>
          <div className="panel tip tip--warn"><h3>اسکرین‌شات‌ها</h3><p>قبل از گرفتن اسکرین‌شات، نام اپل‌آیدی، شماره و نام دستگاه را از صفحه پاک کنید.</p></div>
          {cat !== 'speaker' && (
            <label className="panel check check--box"><input type="checkbox" checked={form.unlocked} onChange={(e) => set({ unlocked: e.target.checked })} />
              تأیید می‌کنم قفل حساب (iCloud / Google / Samsung) دستگاه خاموش است و از حساب خارج شده‌ام.
            </label>
          )}
          {errors.length > 0 && <ul className="error-list" role="alert">{errors.map((er) => <li key={er}>{er}</li>)}</ul>}
          <button className="btn btn--primary btn--lg btn--block">ادامه و تأیید نهایی</button>
        </aside>
      </form>

      {camSlot && (
        <CameraCapture slot={camSlot} step={camIndex} total={slots.length} onClose={() => setCamSlot(null)}
          onCapture={(b) => { const s = camSlot; setCamSlot(null); void attach(s, b) }} />
      )}
    </div>
  )
}
