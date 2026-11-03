import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { toEn, toFa } from '../lib/format'

export default function Login() {
  const { phone, login, logout } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [value, setValue] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (phone) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">پنل همکار</h1>
          <p>وارد شده‌اید با شمارهٔ <b dir="ltr">{toFa(phone)}</b></p>
          <div className="buybox__row">
            <button className="btn btn--primary" onClick={() => nav('/upload')}>ثبت دستگاه برای فروش</button>
            <button className="btn btn--outline" onClick={() => { logout(); nav('/') }}>خروج</button>
          </div>
        </div>
      </div>
    )
  }

  const submitPhone = (e: FormEvent) => {
    e.preventDefault()
    const n = toEn(value).replace(/\s/g, '')
    if (!/^09\d{9}$/.test(n)) { setError('شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.'); return }
    setError(''); setValue(n); setStep('code')
  }
  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\d{4,6}$/.test(toEn(code))) { setError('کد تأیید را وارد کنید.'); return }
    login(value); nav('/products')
  }

  return (
    <div className="container page narrow">
      <div className="panel">
        <h1 className="page__title">ورود یا ثبت‌نام همکار</h1>
        <p className="muted">بعد از تأیید حساب، قیمت‌های عمده و ثبت دستگاه برای شما فعال می‌شود.</p>
        {step === 'phone' ? (
          <form onSubmit={submitPhone} className="form">
            <label>شمارهٔ موبایل
              <input className="input" inputMode="numeric" autoComplete="tel" dir="ltr" placeholder="09123456789" value={value} onChange={(e) => setValue(e.target.value)} />
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn btn--primary btn--lg btn--block">دریافت کد تأیید</button>
          </form>
        ) : (
          <form onSubmit={submitCode} className="form">
            <label>کد تأیید ارسال‌شده به <b dir="ltr">{toFa(value)}</b>
              <input className="input" inputMode="numeric" autoComplete="one-time-code" dir="ltr" placeholder="12345" value={code} onChange={(e) => setCode(e.target.value)} />
            </label>
            {error && <p className="error" role="alert">{error}</p>}
            <button className="btn btn--primary btn--lg btn--block">ورود</button>
            <button type="button" className="btn btn--outline btn--block" onClick={() => setStep('phone')}>ویرایش شماره</button>
          </form>
        )}
        <p className="notice">نسخهٔ نمایشی: پیامک ارسال نمی‌شود و هر کد ۴ تا ۶ رقمی پذیرفته می‌شود. ورود واقعی بعد از اتصال به سرور فعال خواهد شد.</p>
      </div>
    </div>
  )
}
