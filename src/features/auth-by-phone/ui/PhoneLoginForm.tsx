import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { isValidMobile, isValidOtp, normalizeMobile } from '../model/validation'

type Step = 'phone' | 'code'

/** Two-step sign-in: mobile number, then the SMS code. */
export function PhoneLoginForm() {
  const { signIn } = useSession()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submitPhone = (e: FormEvent) => {
    e.preventDefault()
    const normalized = normalizeMobile(phone)
    if (!isValidMobile(normalized)) {
      setError('شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
      return
    }
    setError('')
    setPhone(normalized)
    setStep('code')
  }

  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidOtp(code)) {
      setError('کد تأیید را وارد کنید.')
      return
    }
    signIn(phone)
    navigate(paths.catalog)
  }

  return (
    <>
      <h1 className="page__title">ورود یا ثبت‌نام همکار</h1>
      <p className="muted">فقط شمارهٔ موبایل شما کافی است. رمز عبور لازم نیست؛ یک کد پیامکی برایتان می‌فرستیم.</p>
      {step === 'phone' ? (
        <form onSubmit={submitPhone} className="form">
          <label>شمارهٔ موبایل خود را بنویسید
            <input className="input input--xl" inputMode="numeric" autoComplete="tel" dir="ltr" autoFocus placeholder="09123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block">دریافت کد تأیید</button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="form">
          <label>کدی که برای <b dir="ltr">{toFa(phone)}</b> پیامک شد را بنویسید
            <input className="input input--xl input--code" inputMode="numeric" autoComplete="one-time-code" dir="ltr" autoFocus maxLength={6} placeholder="• • • • •" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block">ورود</button>
          <button type="button" className="btn btn--outline btn--block" onClick={() => setStep('phone')}>ویرایش شماره</button>
        </form>
      )}
      <p className="muted login__legal">با ورود، <Link to={paths.terms}>شرایط استفاده</Link> و <Link to={paths.privacy}>حریم خصوصی</Link> را می‌پذیرید.</p>
      <p className="notice">نسخهٔ نمایشی: پیامک ارسال نمی‌شود و هر کد ۴ تا ۶ رقمی پذیرفته می‌شود. ورود واقعی بعد از اتصال به سرور فعال خواهد شد.</p>
    </>
  )
}
