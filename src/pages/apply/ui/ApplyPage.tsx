import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { emptyApplication, submitApplication, useApplicationPhotos, useMyApplication, validateApplication, type Application, type ApplicationForm } from '@/entities/application'
import { useSession } from '@/entities/session'
import { activeCities } from '@/shared/config/cities'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import './apply.css'

const dateFormat = new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' })

/** A photo picker with a preview (the picked file stays in memory until the form is sent). */
function PhotoField({ label, hint, required, file, current, onPick }: {
  label: string; hint: string; required?: boolean; file: File | null; current?: string | null; onPick: (f: File | null) => void
}) {
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    if (!file) { setPreview(null); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  const src = preview ?? current ?? null
  return (
    <div className="apply__photo">
      <span className="apply__label">{label} {required ? <small className="chip chip--req">اجباری</small> : <small className="chip chip--muted">اختیاری</small>}</span>
      <small className="muted">{hint}</small>
      {src && <img src={src} alt={label} />}
      <label className="btn btn--outline btn--sm">
        {src ? 'عوض کردن عکس' : 'گرفتن یا انتخاب عکس'}
        <input type="file" accept="image/*" hidden onChange={(e: ChangeEvent<HTMLInputElement>) => { onPick(e.target.files?.[0] ?? null); e.target.value = '' }} />
      </label>
    </div>
  )
}

function Summary({ app }: { app: Application }) {
  const photos = useApplicationPhotos(app)
  return (
    <dl className="apply__summary">
      <div><dt>نام</dt><dd>{app.fullName}</dd></div>
      <div><dt>مغازه</dt><dd>{app.shopName}</dd></div>
      <div><dt>شهر و نشانی</dt><dd>{app.city}، {app.address}</dd></div>
      <div><dt>تلفن ثابت</dt><dd dir="ltr">{toFa(app.landline)}</dd></div>
      {app.instagram && <div><dt>اینستاگرام</dt><dd dir="ltr">{app.instagram}</dd></div>}
      {photos.front && <div><dt>سردر</dt><dd><img src={photos.front} alt="سردر مغازه" /></dd></div>}
    </dl>
  )
}

/** «ثبت‌نام همکار»: shop details and photos, reviewed by an admin before prices and listing are unlocked. */
export function ApplyPage() {
  const { phone, role, verification, refresh } = useSession()
  const { application, loading } = useMyApplication(phone)
  const [form, setForm] = useState<ApplicationForm>({ ...emptyApplication, city: activeCities[0] ?? '' })
  const [front, setFront] = useState<File | null>(null)
  const [inside, setInside] = useState<File | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState(false)
  const filled = useRef(false)
  const frontPhotos = useApplicationPhotos(application)

  // After a rejection (or "edit"), the form starts with what was sent before.
  useEffect(() => {
    if (!application || filled.current) return
    filled.current = true
    setForm({ fullName: application.fullName, shopName: application.shopName, city: application.city, address: application.address, landline: application.landline, instagram: application.instagram })
  }, [application])

  if (!phone) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">ثبت‌نام همکار</h1>
          <p>ابتدا با شمارهٔ موبایل وارد شوید، بعد مشخصات مغازه را می‌نویسید.</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">ورود</Link>
        </div>
      </div>
    )
  }
  if (loading) return <div className="container page narrow"><p className="muted">در حال بارگذاری…</p></div>

  const patch = (p: Partial<ApplicationForm>) => setForm((f) => ({ ...f, ...p }))
  const hasFront = Boolean(front) || (editing || application?.status === 'rejected') && Boolean(application?.photoFront)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateApplication(form, hasFront)
    setErrors(found)
    if (found.length || busy) return
    // The old front photo is re-used only when the partner did not pick a new one.
    const frontBlob: Blob | null = front
    if (!frontBlob) { setErrors(['برای ارسال دوباره، عکس سردر را دوباره انتخاب کنید.']); return }
    setBusy(true)
    const err = await submitApplication(phone, form, frontBlob, inside)
    setBusy(false)
    if (err) return setErrors([err])
    setEditing(false)
    setFront(null)
    setInside(null)
    await refresh()
    window.scrollTo(0, 0)
  }

  const staff = role === 'admin' || role === 'inspector'
  const showForm = !application || application.status === 'rejected' || editing

  return (
    <div className="container page narrow">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.login}>پنل</Link> / ثبت‌نام همکار</nav>
      <h1 className="page__title">ثبت‌نام همکار</h1>

      {staff && <p className="notice">شما کارشناس یا مدیر هستید و نیازی به ثبت‌نام همکار ندارید؛ این صفحه فقط برای امتحان است.</p>}

      {application?.status === 'approved' && (
        <div className="panel apply__state apply__state--ok">
          <h2>ثبت‌نام شما تأیید شده است ✓</h2>
          <p>قیمت‌ها را می‌بینید و می‌توانید دستگاه ثبت کنید.</p>
          <div className="btn-row"><Link to={paths.catalog} className="btn btn--primary">لیست قیمت</Link><Link to={paths.sell} className="btn btn--outline">ثبت دستگاه</Link></div>
        </div>
      )}

      {application?.status === 'pending' && !editing && (
        <div className="panel apply__state">
          <h2>درخواست شما در حال بررسی است</h2>
          <p>ارسال‌شده در {dateFormat.format(application.submittedAt)}. مدیر سایت مشخصات را بررسی می‌کند و ممکن است با تلفن ثابت مغازه تماس بگیرد. نتیجه همین‌جا و در پنل شما نمایش داده می‌شود.</p>
          <Summary app={application} />
          <button type="button" className="btn btn--outline" onClick={() => setEditing(true)}>ویرایش و ارسال دوبارهٔ مشخصات</button>
        </div>
      )}

      {application?.status === 'rejected' && (
        <div className="panel apply__state apply__state--bad">
          <h2>درخواست شما رد شد</h2>
          <p><b>دلیل:</b> {application.reviewNote}</p>
          <p className="muted">مشخصات را اصلاح کنید و دوباره بفرستید.</p>
        </div>
      )}

      {showForm && (
        <form className="panel apply__form form" onSubmit={(e) => void submit(e)} noValidate>
          <p className="muted">برای دیدن قیمت‌ها و ثبت دستگاه، مشخصات مغازه‌تان را بنویسید. مدیر سایت آن را بررسی می‌کند. این اطلاعات فقط برای مدیر دیده می‌شود، نه خریداران و همکاران دیگر.</p>
          <label>نام و نام خانوادگی
            <input className="input" value={form.fullName} onChange={(e) => patch({ fullName: e.target.value })} autoComplete="name" />
          </label>
          <label>نام مغازه یا کسب‌وکار
            <input className="input" value={form.shopName} onChange={(e) => patch({ shopName: e.target.value })} autoComplete="organization" />
          </label>
          <label>شهر
            <select className="input" value={form.city} onChange={(e) => patch({ city: e.target.value })}>
              {activeCities.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>نشانی کامل مغازه
            <textarea className="input" rows={3} value={form.address} onChange={(e) => patch({ address: e.target.value })} placeholder="خیابان، کوچه، پلاک، طبقه" />
          </label>
          <label>تلفن ثابت مغازه (با کد شهر)
            <input className="input" inputMode="numeric" dir="ltr" value={form.landline} onChange={(e) => patch({ landline: e.target.value })} placeholder="04133445566" />
          </label>
          <label>اینستاگرام یا تلگرام مغازه <small className="muted">اختیاری</small>
            <input className="input" dir="ltr" value={form.instagram} onChange={(e) => patch({ instagram: e.target.value })} placeholder="@my_shop" />
          </label>
          <PhotoField label="عکس سردر مغازه" hint="تابلو و نمای بیرون مغازه، از روبه‌رو و روشن." required file={front} current={editing || application?.status === 'rejected' ? frontPhotos.front : null} onPick={setFront} />
          <PhotoField label="عکس داخل مغازه" hint="ویترین یا داخل مغازه." file={inside} onPick={setInside} />
          {errors.length > 0 && <ul className="error-list" role="alert">{errors.map((x) => <li key={x}>{x}</li>)}</ul>}
          <button className="btn btn--primary btn--lg btn--block" disabled={busy}>{busy ? 'در حال ارسال…' : 'ارسال برای بررسی'}</button>
          {editing && <button type="button" className="btn btn--outline btn--block" onClick={() => { setEditing(false); setErrors([]) }}>انصراف</button>}
        </form>
      )}

      {verification === 'verified' && !application && !staff && (
        <p className="notice">فعلاً تأیید همکار اجباری نیست و همهٔ همکاران قیمت‌ها را می‌بینند؛ ولی همین حالا هم می‌توانید ثبت‌نام را کامل کنید.</p>
      )}
    </div>
  )
}
