import { useState, type FormEvent } from 'react'
import { isValidEmail } from '@/features/auth-by-phone'
import { saveEmailLogin, sendEmailCode, setTwoFactor, useAccountSecurity, verifyEmailCode } from '@/entities/account'

/** Email + password as a second way in (verified by a code mailed to the address), and optional two-step verification. */
export function EmailSecurity({ phone }: { phone: string }) {
  const { security, loading } = useAccountSecurity(phone)
  const [editing, setEditing] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const wrap = async (fn: () => Promise<{ ok: boolean; error?: string }>, okMessage = '') => {
    setBusy(true)
    setError('')
    setMessage('')
    const r = await fn()
    setBusy(false)
    if (r.ok) setMessage(okMessage)
    else setError(r.error ?? 'انجام نشد.')
    return r.ok
  }

  const save = async (e: FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) return setError('ایمیل را درست وارد کنید.')
    if (password.length < 8) return setError('رمز باید حداقل ۸ حرف باشد.')
    const saved = await wrap(() => saveEmailLogin(email.trim(), password))
    if (!saved) return
    setEditing(false)
    setPassword('')
    await wrap(sendEmailCode, 'یک کد ۶ رقمی به ایمیلتان فرستادیم. آن را پایین بنویسید.')
  }

  const verify = async (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code.trim())) return setError('کد ۶ رقمی را بنویسید.')
    if (await wrap(() => verifyEmailCode(code), 'ایمیل تأیید شد. حالا می‌توانید با آن وارد شوید.')) setCode('')
  }

  if (loading) return null

  const formVisible = editing || !security.email

  return (
    <section className="panel acct">
      <h2>ورود با ایمیل</h2>
      <p className="muted">اگر به شمارهٔ موبایلتان دسترسی نداشتید، با ایمیل و رمز وارد شوید. ایمیل باید با یک کد که برایتان می‌فرستیم تأیید شود.</p>

      {security.email && !formVisible && (
        <div className="acct__row">
          <span>
            <b dir="ltr">{security.email}</b>
            <small className="muted">{security.emailVerified ? '✓ تأیید شده' : 'هنوز تأیید نشده'}</small>
          </span>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => { setEditing(true); setEmail(security.email ?? ''); setMessage(''); setError('') }}>تغییر ایمیل یا رمز</button>
        </div>
      )}

      {formVisible && (
        <form onSubmit={(e) => void save(e)} className="form" noValidate>
          <label>ایمیل
            <input className="input" type="email" dir="ltr" autoComplete="email" autoCapitalize="none" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>رمز (حداقل ۸ حرف)
            <input className="input" type="password" dir="ltr" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <div className="btn-row">
            <button className="btn btn--primary" disabled={busy}>{busy ? 'در حال ذخیره…' : 'ذخیره و ارسال کد'}</button>
            {editing && security.email && <button type="button" className="btn btn--outline" onClick={() => { setEditing(false); setError('') }}>انصراف</button>}
          </div>
        </form>
      )}

      {security.email && !security.emailVerified && !formVisible && (
        <form onSubmit={(e) => void verify(e)} className="form" noValidate>
          <label>کد ۶ رقمی ایمیل
            <input className="input input--code" inputMode="numeric" dir="ltr" maxLength={6} autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          <div className="btn-row">
            <button className="btn btn--primary" disabled={busy}>تأیید ایمیل</button>
            <button type="button" className="btn btn--outline" disabled={busy} onClick={() => void wrap(sendEmailCode, 'کد تازه فرستاده شد.')}>ارسال دوبارهٔ کد</button>
          </div>
        </form>
      )}

      {security.emailVerified && !formVisible && (
        <label className="check check--box">
          <input
            type="checkbox"
            checked={security.twoFactor}
            disabled={busy}
            onChange={(e) => void wrap(() => setTwoFactor(e.target.checked), e.target.checked ? 'تأیید دو مرحله‌ای روشن شد.' : 'تأیید دو مرحله‌ای خاموش شد.')}
          />
          تأیید دو مرحله‌ای: بعد از ایمیل و رمز، یک کد به شمارهٔ موبایلم پیامک شود.
        </label>
      )}
      {security.emailVerified && security.twoFactor && !formVisible && (
        <p className="notice">نسخهٔ آزمایشی: پیامک هنوز ارسال نمی‌شود؛ در مرحلهٔ دوم همان کد ورود همیشگی‌تان را بنویسید.</p>
      )}

      {message && <p role="status" className="acct__ok">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
    </section>
  )
}
