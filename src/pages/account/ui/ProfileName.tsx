import { useEffect, useState, type FormEvent } from 'react'
import { saveDisplayName, useProfileName } from '@/entities/account'

/** The name the panel greets you with (admins and کارشناس also see the name their admin gave them). */
export function ProfileName({ phone }: { phone: string }) {
  const saved = useProfileName(phone)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => setName(saved), [saved])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    const r = await saveDisplayName(name)
    setBusy(false)
    if (r.ok) setMessage('نام ذخیره شد.')
    else setError(r.error)
  }

  return (
    <form onSubmit={(e) => void save(e)} className="form" noValidate>
      <label>نام شما
        <input className="input" value={name} maxLength={60} autoComplete="name" onChange={(e) => setName(e.target.value)} placeholder="مثلاً علی رضایی یا موبایل رضایی" />
        <small className="muted">فقط برای خوش‌آمدگویی در پنل و شناخته‌شدن توسط کارشناس و مدیر است؛ به خریداران نمایش داده نمی‌شود.</small>
      </label>
      <button className="btn btn--primary" disabled={busy}>ذخیرهٔ نام</button>
      {message && <p role="status" className="acct__ok">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </form>
  )
}
