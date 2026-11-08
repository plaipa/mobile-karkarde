import { supabase } from '@/shared/api/supabase'
import { processImage } from '@/shared/lib/image/process-image'
import { invalidate, useRemote } from '@/shared/lib/remote'
import { normalizeLandline, type ApplicationForm } from './validation'

export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface Application extends ApplicationForm {
  phone: string
  photoFront: string
  photoInside: string | null
  status: ApplicationStatus
  reviewNote: string
  reviewedBy: string | null
  reviewedAt: number | null
  submittedAt: number
}

interface Row {
  phone: string; full_name: string; shop_name: string; city: string; address: string; landline: string; instagram: string
  photo_front: string; photo_inside: string | null; status: ApplicationStatus; review_note: string
  reviewed_by: string | null; reviewed_at: string | null; submitted_at: string
}

const toApplication = (r: Row): Application => ({
  phone: r.phone, fullName: r.full_name, shopName: r.shop_name, city: r.city, address: r.address, landline: r.landline,
  instagram: r.instagram, photoFront: r.photo_front, photoInside: r.photo_inside, status: r.status, reviewNote: r.review_note,
  reviewedBy: r.reviewed_by, reviewedAt: r.reviewed_at ? Date.parse(r.reviewed_at) : null, submittedAt: Date.parse(r.submitted_at),
})

/** The signed-in partner's own registration (null until they send one). */
export function useMyApplication(phone: string | null) {
  const { data, loading } = useRemote<Application | null>(`application:${phone}`, async () => {
    const { data: rows, error } = await supabase.rpc('my_application')
    if (error) throw error
    const row = (rows as Row[])[0]
    return row ? toApplication(row) : null
  }, null, { enabled: phone !== null, poll: false })
  return { application: data, loading }
}

/** Every registration, waiting ones first — for کارشناس and admin. */
export function useApplications(enabled: boolean) {
  const { data } = useRemote<Application[]>('applications', async () => {
    const { data: rows, error } = await supabase.rpc('list_applications')
    if (error) throw error
    return (rows as Row[]).map(toApplication)
  }, [], { enabled })
  return data
}

async function upload(phone: string, kind: 'front' | 'inside', file: Blob): Promise<string | null> {
  // The photo is re-encoded first (this drops location and device metadata) and uploaded under a fresh name.
  const clean = (await processImage(file)).blob
  const path = `${phone}/${kind}-${Date.now()}.jpg`
  const { error } = await supabase.storage.from('partner-shops').upload(path, clean, { contentType: 'image/jpeg', upsert: false })
  return error ? null : path
}

/** Sends (or re-sends after a rejection) the registration. Returns an error message, or null on success. */
export async function submitApplication(phone: string, form: ApplicationForm, front: Blob, inside: Blob | null): Promise<string | null> {
  const frontPath = await upload(phone, 'front', front)
  if (!frontPath) return 'ارسال عکس سردر ممکن نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.'
  const insidePath = inside ? await upload(phone, 'inside', inside) : null
  const { error } = await supabase.rpc('submit_application', {
    p_full_name: form.fullName, p_shop_name: form.shopName, p_city: form.city, p_address: form.address,
    p_landline: normalizeLandline(form.landline), p_instagram: form.instagram.trim(), p_photo_front: frontPath, p_photo_inside: insidePath,
  })
  if (error) return error.message.includes('already approved') ? 'ثبت‌نام شما قبلاً تأیید شده است.' : 'ثبت درخواست ممکن نشد. دوباره تلاش کنید.'
  invalidate('application')
  return null
}

export async function reviewApplication(phone: string, status: 'approved' | 'rejected', note: string): Promise<string | null> {
  const { error } = await supabase.rpc('review_application', { p_phone: phone, p_status: status, p_note: note })
  if (error) return 'ثبت تصمیم ممکن نشد. دوباره تلاش کنید.'
  invalidate('applications')
  invalidate('partners')
  return null
}

export interface ApplicationPhotos {
  front: string | null
  inside: string | null
}

/** Short-lived links to the shop photos (private bucket; only the owner and staff may open them). */
export function useApplicationPhotos(app: Application | null) {
  const { data } = useRemote<ApplicationPhotos>(`appdocs:${app?.phone}:${app?.submittedAt}`, async () => {
    if (!app) return { front: null, inside: null }
    const paths = [app.photoFront, ...(app.photoInside ? [app.photoInside] : [])]
    const { data: signed, error } = await supabase.storage.from('partner-shops').createSignedUrls(paths, 3600)
    if (error) throw error
    const urlOf = (path: string | null) => (path ? signed.find((s) => s.path === path)?.signedUrl ?? null : null)
    return { front: urlOf(app.photoFront), inside: urlOf(app.photoInside) }
  }, { front: null, inside: null }, { enabled: app !== null, poll: false })
  return data
}

/** Admin: is partner verification switched on? (null for everyone else) */
export function useVerificationRequired(enabled: boolean) {
  const { data } = useRemote<boolean | null>('verification-required', async () => {
    const { data: on, error } = await supabase.rpc('get_verification_required')
    if (error) throw error
    return on as boolean | null
  }, null, { enabled, poll: false })
  return data
}

export async function setVerificationRequired(on: boolean): Promise<boolean> {
  const { error } = await supabase.rpc('set_verification_required', { p_on: on })
  invalidate('verification-required')
  return !error
}
