import { createClient } from '@supabase/supabase-js'

/** Both values are public by design: what a visitor can do is decided by the database rules (RLS), not by hiding these. */
export const SUPABASE_URL = 'https://akbgkwwjlskcfljwrlrx.supabase.co'
const PUBLISHABLE_KEY = 'sb_publishable_tNGydcpICozFG3mOiq0Tmg_LQqyHv_P'

export const supabase = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
})

export type AuthError = 'blocked' | 'bad_code' | 'bad_credentials' | 'locked' | 'expired' | 'too_soon' | 'no_email' | 'email_not_configured' | 'email_send_failed' | 'network' | 'server'

export interface AuthReply {
  ok: boolean
  status: number
  data: Record<string, unknown>
  error?: AuthError
}

/** Calls the `auth` edge function (login, email codes). Never throws. */
export async function callAuth(action: string, body: Record<string, unknown> = {}): Promise<AuthReply> {
  try {
    const { data: s } = await supabase.auth.getSession()
    const res = await fetch(`${SUPABASE_URL}/functions/v1/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: PUBLISHABLE_KEY,
        Authorization: `Bearer ${s.session?.access_token ?? PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ action, ...body }),
    })
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    return { ok: res.ok, status: res.status, data, error: res.ok ? undefined : ((data.error as AuthError) ?? 'server') }
  } catch {
    return { ok: false, status: 0, data: {}, error: 'network' }
  }
}

/** Stores the tokens the login function returned. Returns false when they were not accepted. */
export async function acceptSession(data: Record<string, unknown>): Promise<boolean> {
  const s = data.session as { access_token: string; refresh_token: string } | undefined
  if (!s) return false
  const { error } = await supabase.auth.setSession({ access_token: s.access_token, refresh_token: s.refresh_token })
  return !error
}
