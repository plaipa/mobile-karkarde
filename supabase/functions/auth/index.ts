import { createClient } from 'npm:@supabase/supabase-js@2'

/**
 * Login for mobilekarkarde.ir (deployed as the edge function `auth`, verify_jwt = false).
 *  - phone-login        { phone, code }
 *  - email-login        { email, password }  -> session, or { step: 'code', challenge } when two-step is on
 *  - email-login-code   { challenge, code }
 *  - send-email-code    (signed-in user)     -> mails a 6-digit code to the user's saved email via Bird
 * Codes for phone login are a shared test code (secret PARTNER_CODE, default 1234) until a real SMS service is connected.
 * Secrets: BIRD_API_KEY (workspace key with only emails:write), optional PARTNER_CODE and MAIL_FROM.
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } })

const url = Deno.env.get('SUPABASE_URL')!
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const partnerCode = Deno.env.get('PARTNER_CODE') ?? '1234'
const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

const PHONE = /^09\d{9}$/
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** The account password is derived on the server, so nobody can sign in as a phone without passing the code check. */
async function derivedPassword(phone: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(serviceKey), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`mk-login:${phone}`)))
  return Array.from(sig, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Signs the phone in (creating its account the first time) and returns the session tokens. */
async function sessionFor(phone: string) {
  const email = `${phone}@phone.mobilekarkarde.ir`
  const password = await derivedPassword(phone)
  await admin.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { phone } }) // already exists: fine
  const anon = createClient(url, anonKey, { auth: { persistSession: false } })
  const { data, error } = await anon.auth.signInWithPassword({ email, password })
  if (error || !data.session) return null
  const s = data.session
  return { access_token: s.access_token, refresh_token: s.refresh_token, expires_in: s.expires_in, expires_at: s.expires_at, token_type: s.token_type }
}

async function sendVerificationEmail(to: string, code: string) {
  const key = Deno.env.get('BIRD_API_KEY')
  if (!key) {
    // Names only, never values: helps spot a misspelled secret name.
    console.error('BIRD_API_KEY is not set. Secret names seen:', Object.keys(Deno.env.toObject()).filter((k) => !k.startsWith('SUPABASE_') && !k.startsWith('DENO_') && !k.startsWith('SB_')))
    return { ok: false, status: 503, error: 'email_not_configured' }
  }
  const region = /^b[km]_([a-z0-9]+)_/.exec(key)?.[1] ?? 'eu1'
  const from = Deno.env.get('MAIL_FROM') ?? 'موبایل کارکرده <no-reply@mail.mobilekarkarde.ir>'
  const html = `<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:2;color:#111214">
<p>سلام،</p><p>کد تأیید ایمیل شما در «موبایل کارکرده»:</p>
<p style="font-size:32px;letter-spacing:8px;font-weight:700;direction:ltr;text-align:right">${code}</p>
<p>این کد ۱۵ دقیقه اعتبار دارد. اگر شما درخواست نداده‌اید، این ایمیل را نادیده بگیرید.</p></div>`
  const res = await fetch(`https://${region}.platform.bird.com/v1/email/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'کد تأیید ایمیل · موبایل کارکرده',
      html,
      text: `کد تأیید ایمیل شما در موبایل کارکرده: ${code}\nاین کد ۱۵ دقیقه اعتبار دارد.`,
      category: 'transactional',
    }),
  })
  if (!res.ok) {
    console.error('bird send failed', res.status, await res.text())
    return { ok: false, status: 502, error: 'email_send_failed' }
  }
  return { ok: true }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
  if (req.method !== 'POST') return json({ error: 'method' }, 405)
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return json({ error: 'bad_request' }, 400) }
  const action = String(body.action ?? '')

  try {
    if (action === 'phone-login') {
      const phone = String(body.phone ?? '')
      const code = String(body.code ?? '')
      if (!PHONE.test(phone) || code.length < 4 || code.length > 32) return json({ error: 'bad_request' }, 400)
      const { data, error } = await admin.rpc('login_check', { p_phone: phone, p_code: code, p_partner_code: partnerCode })
      if (error) throw error
      if (data === 'locked') return json({ error: 'locked' }, 429)
      if (data !== 'ok') return json({ error: 'bad_code' }, 401)
      const session = await sessionFor(phone)
      return session ? json({ session }) : json({ error: 'server' }, 500)
    }

    if (action === 'email-login') {
      const email = String(body.email ?? '').trim()
      const password = String(body.password ?? '')
      if (!EMAIL.test(email) || password.length < 1 || password.length > 128) return json({ error: 'bad_request' }, 400)
      const { data, error } = await admin.rpc('email_login_check', { p_email: email, p_password: password })
      if (error) throw error
      const row = Array.isArray(data) ? data[0] : data
      if (row?.result === 'locked') return json({ error: 'locked' }, 429)
      if (row?.result !== 'ok') return json({ error: 'bad_credentials' }, 401)
      if (row.two_factor) {
        const { data: challenge, error: cErr } = await admin.rpc('create_challenge', { p_phone: row.phone })
        if (cErr) throw cErr
        return json({ step: 'code', challenge, phone_hint: String(row.phone).slice(-4) })
      }
      const session = await sessionFor(row.phone)
      return session ? json({ session }) : json({ error: 'server' }, 500)
    }

    if (action === 'email-login-code') {
      const challenge = String(body.challenge ?? '')
      const code = String(body.code ?? '')
      if (!/^[0-9a-f-]{36}$/.test(challenge) || code.length < 4 || code.length > 32) return json({ error: 'bad_request' }, 400)
      const { data, error } = await admin.rpc('finish_challenge', { p_id: challenge, p_code: code, p_partner_code: partnerCode })
      if (error) throw error
      if (data === 'locked') return json({ error: 'locked' }, 429)
      if (data === 'expired') return json({ error: 'expired' }, 410)
      if (!PHONE.test(String(data))) return json({ error: 'bad_code' }, 401)
      const session = await sessionFor(String(data))
      return session ? json({ session }) : json({ error: 'server' }, 500)
    }

    if (action === 'send-email-code') {
      const jwt = (req.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '')
      const { data: u } = await admin.auth.getUser(jwt)
      const phone = u?.user?.app_metadata?.phone
      if (!phone || !PHONE.test(phone)) return json({ error: 'unauthorized' }, 401)
      const { data, error } = await admin.rpc('issue_email_code', { p_phone: phone })
      if (error) {
        if (String(error.message).includes('too soon')) return json({ error: 'too_soon' }, 429)
        if (String(error.message).includes('no email')) return json({ error: 'no_email' }, 400)
        throw error
      }
      const row = Array.isArray(data) ? data[0] : data
      const sent = await sendVerificationEmail(row.email, row.code)
      if (!sent.ok) return json({ error: sent.error }, sent.status)
      return json({ sent: true })
    }

    return json({ error: 'unknown_action' }, 400)
  } catch (e) {
    console.error(action, e)
    return json({ error: 'server' }, 500)
  }
})
