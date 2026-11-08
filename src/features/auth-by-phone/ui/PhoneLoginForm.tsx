import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession, type SignInOutcome } from '@/entities/session'
import type { AuthError } from '@/shared/api/supabase'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { isValidEmail, isValidMobile, isValidOtp, normalizeMobile } from '../model/validation'

type Step = 'phone' | 'code' | 'email' | 'email-code'

const errorText: Record<AuthError, string> = {
  blocked: 'این حساب مسدود شده است. برای پیگیری با پشتیبانی تماس بگیرید.',
  bad_code: 'کد درست نیست.',
  bad_credentials: 'ایمیل یا رمز درست نیست، یا هنوز این ایمیل تأیید نشده است.',
  locked: 'چند بار اشتباه وارد کردید. ۱۰ دقیقه بعد دوباره تلاش کنید.',
  expired: 'زمان این مرحله تمام شد. از اول وارد شوید.',
  network: 'اتصال به اینترنت برقرار نیست.',
  server: 'مشکلی پیش آمد. کمی بعد دوباره تلاش کنید.',
  too_soon: 'کمی صبر کنید و دوباره تلاش کنید.',
  no_email: 'ایمیلی ثبت نشده است.',
  email_not_configured: 'ارسال ایمیل هنوز راه‌اندازی نشده است.',
  email_send_failed: 'ارسال ایمیل ممکن نشد.',
}

/** Sign-in: mobile number + code, or (when the number is out of reach) email + password, optionally followed by a code. */
export function PhoneLoginForm() {
  const { signInWithPhone, signInWithEmail, signInWithEmailCode } = useSession()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [challenge, setChallenge] = useState('')
  const [phoneHint, setPhoneHint] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const go = (next: Step) => { setStep(next); setError(''); setCode('') }

  const handle = (outcome: SignInOutcome) => {
    if (outcome.status === 'done') {
      navigate(paths.catalog)
    } else if (outcome.status === 'code') {
      setChallenge(outcome.challenge)
      setPhoneHint(outcome.phoneHint)
      go('email-code')
    } else {
      setError(errorText[outcome.error])
    }
  }

  const run = async (fn: () => Promise<SignInOutcome>) => {
    setBusy(true)
    setError('')
    handle(await fn())
    setBusy(false)
  }

  const submitPhone = (e: FormEvent) => {
    e.preventDefault()
    const normalized = normalizeMobile(phone)
    if (!isValidMobile(normalized)) {
      setError('شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.')
      return
    }
    setPhone(normalized)
    go('code')
  }

  const submitCode = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidOtp(code)) return setError('کد تأیید را وارد کنید.')
    void run(() => signInWithPhone(phone, code.trim()))
  }

  const submitEmail = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) return setError('ایمیل را درست وارد کنید.')
    if (!password) return setError('رمز را وارد کنید.')
    void run(() => signInWithEmail(email.trim(), password))
  }

  const submitEmailCode = (e: FormEvent) => {
    e.preventDefault()
    if (!isValidOtp(code)) return setError('کد تأیید را وارد کنید.')
    void run(() => signInWithEmailCode(challenge, code.trim()))
  }

  return (
    <>
      <h1 className="page__title">ورود یا ثبت‌نام</h1>
      <p className="muted">فقط شمارهٔ موبایل شما کافی است. رمز عبور لازم نیست؛ یک کد برایتان می‌فرستیم.</p>

      {step === 'phone' && (
        <form onSubmit={submitPhone} className="form">
          <label>شمارهٔ موبایل خود را بنویسید
            <input className="input input--xl" inputMode="numeric" autoComplete="tel" dir="ltr" autoFocus placeholder="09123456789" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block">دریافت کد تأیید</button>
          <button type="button" className="btn btn--outline btn--block" onClick={() => go('email')}>به شماره‌ام دسترسی ندارم؛ ورود با ایمیل</button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={submitCode} className="form">
          <label>کدی که برای <b dir="ltr">{toFa(phone)}</b> پیامک شد را بنویسید
            <input className="input input--xl input--code" autoComplete="one-time-code" autoCapitalize="none" dir="ltr" autoFocus maxLength={32} placeholder="• • • • •" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود'}</button>
          <button type="button" className="btn btn--outline btn--block" onClick={() => go('phone')}>ویرایش شماره</button>
        </form>
      )}

      {step === 'email' && (
        <form onSubmit={submitEmail} className="form">
          <label>ایمیل
            <input className="input" type="email" dir="ltr" autoComplete="email" autoCapitalize="none" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>رمز
            <input className="input" type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود با ایمیل'}</button>
          <button type="button" className="btn btn--outline btn--block" onClick={() => go('phone')}>برگشت به ورود با شماره</button>
          <small className="muted">فقط اگر قبلاً در «تنظیمات حساب» ایمیل ثبت و تأیید کرده باشید کار می‌کند.</small>
        </form>
      )}

      {step === 'email-code' && (
        <form onSubmit={submitEmailCode} className="form">
          <label>تأیید دو مرحله‌ای: کدی که برای شمارهٔ <b dir="ltr">{toFa(`****${phoneHint}`)}</b> پیامک شد را بنویسید
            <input className="input input--xl input--code" autoComplete="one-time-code" autoCapitalize="none" dir="ltr" autoFocus maxLength={32} placeholder="• • • • •" value={code} onChange={(e) => setCode(e.target.value)} />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn btn--primary btn--lg btn--block" disabled={busy}>{busy ? 'در حال ورود…' : 'ورود'}</button>
          <button type="button" className="btn btn--outline btn--block" onClick={() => go('email')}>برگشت</button>
        </form>
      )}

      <p className="muted login__legal">با ورود، <Link to={paths.terms}>شرایط استفاده</Link> و <Link to={paths.privacy}>حریم خصوصی</Link> را می‌پذیرید.</p>
      <p className="notice">نسخهٔ آزمایشی: پیامک هنوز ارسال نمی‌شود. همکاران کد <b dir="ltr">۱۲۳۴</b> را می‌نویسند؛ کارشناس و مدیر کد ورود مخصوص خودشان را.</p>
    </>
  )
}
