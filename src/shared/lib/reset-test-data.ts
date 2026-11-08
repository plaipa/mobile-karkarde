import { clearAll } from './blob-store'

/** Wipes everything this site keeps in the browser (sign-in, devices, inspectors, photos) so a tester can start over. */
export async function resetTestData() {
  try {
    Object.keys(localStorage).filter((k) => k.startsWith('mk_')).forEach((k) => localStorage.removeItem(k))
  } catch {
    /* storage unavailable */
  }
  await clearAll()
}
