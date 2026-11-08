import { supabase } from '@/shared/api/supabase'

/** Signs out and wipes what this browser remembers (sign-in, city, cart, text size). Devices and photos live on the server and stay. */
export async function resetTestData() {
  await supabase.auth.signOut().catch(() => undefined)
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('mk_') || k.startsWith('sb-')).forEach((k) => localStorage.removeItem(k))
  } catch {
    /* storage unavailable */
  }
}
