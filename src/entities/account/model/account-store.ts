import { callAuth, supabase, type AuthError } from '@/shared/api/supabase'
import { invalidate, useRemote } from '@/shared/lib/remote'

export interface AccountSecurity {
  email: string | null
  emailVerified: boolean
  twoFactor: boolean
}

const none: AccountSecurity = { email: null, emailVerified: false, twoFactor: false }

/** The signed-in user's email sign-in and two-step settings. */
export function useAccountSecurity(phone: string | null) {
  const { data, loading } = useRemote<AccountSecurity>(`account:${phone}`, async () => {
    const { data: rows, error } = await supabase.rpc('my_security')
    if (error) throw error
    const r = (rows as { email: string; email_verified: boolean; two_factor: boolean }[])[0]
    return r ? { email: r.email, emailVerified: r.email_verified, twoFactor: r.two_factor } : none
  }, none, { enabled: phone !== null, poll: false })
  return { security: data, loading }
}

export type ActionResult = { ok: true } | { ok: false; error: string }

const fail = (error: string): ActionResult => ({ ok: false, error })

/** Saves (or changes) the email and password. The email stays unverified until its code is entered. */
export async function saveEmailLogin(email: string, password: string): Promise<ActionResult> {
  const { error } = await supabase.rpc('set_email_login', { p_email: email, p_password: password })
  if (error) {
    if (error.message.includes('email taken')) return fail('این ایمیل برای حساب دیگری ثبت شده است.')
    if (error.message.includes('bad email')) return fail('ایمیل را درست وارد کنید.')
    if (error.message.includes('bad password')) return fail('رمز باید حداقل ۸ حرف باشد.')
    return fail('ذخیره نشد. دوباره تلاش کنید.')
  }
  invalidate('account:')
  return { ok: true }
}

const sendErrors: Partial<Record<AuthError, string>> = {
  too_soon: 'کد تازه فرستاده شده است. یک دقیقه صبر کنید و دوباره بخواهید.',
  email_not_configured: 'ارسال ایمیل هنوز راه‌اندازی نشده است.',
  email_send_failed: 'ارسال ایمیل ممکن نشد. کمی بعد دوباره تلاش کنید.',
  no_email: 'اول ایمیل را ثبت کنید.',
  network: 'اتصال به اینترنت برقرار نیست.',
}

/** Mails a 6-digit code to the saved email. */
export async function sendEmailCode(): Promise<ActionResult> {
  const r = await callAuth('send-email-code')
  return r.ok ? { ok: true } : fail(sendErrors[r.error ?? 'server'] ?? 'ارسال کد ممکن نشد. دوباره تلاش کنید.')
}

export async function verifyEmailCode(code: string): Promise<ActionResult> {
  const { data, error } = await supabase.rpc('verify_email_code', { p_code: code.trim() })
  if (error) return fail('بررسی کد ممکن نشد. دوباره تلاش کنید.')
  if (!data) return fail('کد درست نیست یا منقضی شده است. یک کد تازه بخواهید.')
  invalidate('account:')
  return { ok: true }
}

export async function setTwoFactor(enabled: boolean): Promise<ActionResult> {
  const { error } = await supabase.rpc('set_two_factor', { p_enabled: enabled })
  if (error) return fail('ابتدا ایمیل را تأیید کنید.')
  invalidate('account:')
  return { ok: true }
}

/** A کارشناس or admin changes their own login code. */
export async function setMyStaffCode(code: string): Promise<ActionResult> {
  const { error } = await supabase.rpc('set_my_code', { p_code: code })
  return error ? fail('کد باید ۶ تا ۳۲ حرف انگلیسی یا عدد باشد.') : { ok: true }
}

/** The name shown in the panel greeting (a کارشناس/admin falls back to the name the admin gave). */
export function useProfileName(phone: string | null) {
  const { data } = useRemote<string>(`profile:${phone}`, async () => {
    const { data: rows, error } = await supabase.rpc('my_profile')
    if (error) throw error
    return ((rows as { display_name: string }[])[0]?.display_name ?? '').trim()
  }, '', { enabled: phone !== null, poll: false })
  return data
}

export async function saveDisplayName(name: string): Promise<ActionResult> {
  const { error } = await supabase.rpc('set_my_name', { p_name: name })
  if (error) return fail('نام نباید بیشتر از ۶۰ حرف باشد.')
  invalidate('profile:')
  return { ok: true }
}
