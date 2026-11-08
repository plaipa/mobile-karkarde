import { useState, type FormEvent } from 'react'
import { setMyStaffCode } from '@/entities/account'

/** A کارشناس or admin changes the code they sign in with. */
export function StaffCode() {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setMessage('')
    setError('')
    const r = await setMyStaffCode(code)
    setBusy(false)
    if (r.ok) { setMessage('کد ورود جدید ذخیره شد.'); setCode('') } else setError(r.error)
  }

  return (
    <section className="panel acct">
      <h2>کد ورود من</h2>
      <p className="muted">این کدی است که با شمارهٔ موبایلتان برای ورود می‌نویسید. آن را به کسی ندهید.</p>
      <form onSubmit={(e) => void save(e)} className="form" noValidate>
        <label>کد جدید (۶ تا ۳۲ حرف انگلیسی یا عدد)
          <input className="input" dir="ltr" autoCapitalize="none" autoComplete="new-password" value={code} onChange={(e) => setCode(e.target.value)} />
        </label>
        <button className="btn btn--primary" disabled={busy}>ذخیرهٔ کد</button>
      </form>
      {message && <p role="status" className="acct__ok">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  )
}
