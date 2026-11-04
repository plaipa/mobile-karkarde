import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <p className="muted">بعد از تأیید حساب، قیمت‌های عمده و ثبت دستگاه برای شما فعال می‌شود.</p>
      {step === 'phone' ? (
        <form onSubmit={submitPhone} className="form">
          <label>شمارهٔ موبایل
            <input className="input" inputMode="numeric" autoComplete="tel" dir="ltr" placeholder="09123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block">دریافت کد تأیید</button>
        </form>
      ) : (
        <form onSubmit={submitCode} className="form">
          <label>کد تأیید ارسال‌شده به <b dir="ltr">{toFa(phone)}</b>
            <input className="input" inputMode="numeric" autoComplete="one-time-code" dir="ltr" placeholder="12345" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block">ورود</button>
          <button type="button" className="btn btn--outline btn--block" onClick={() => setStep('phone')}>ویرایش شماره</button>
        </form>
      )}
      <p className="notice">نسخهٔ نمایشی: پیامک ارسال نمی‌شود و هر کد ۴ تا ۶ رقمی پذیرفته می‌شود. ورود واقعی بعد از اتصال به سرور فعال خواهد شد.</p>
    </>
  )
}
