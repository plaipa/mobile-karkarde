import { supabase } from '@/shared/api/supabase'
import { invalidate, useRemote } from '@/shared/lib/remote'
import type { MyListing, NewListing, Publication, Review, ReviewInput } from './types'

const COLUMNS =
  'id, code, owner_phone, category, brand, model, storage, battery, battery_cycles, color, city, notes, status, review_note, reviewed_by, reviewed_at, grade, price, region, sim, registered, warranty, created_at'

interface Row {
  id: string; code: string; owner_phone: string; category: MyListing['category']; brand: string; model: string
  storage: string; battery: string; battery_cycles: number | null; color: string; city: string; notes: string
  status: 'pending' | 'approved' | 'rejected'; review_note: string; reviewed_by: string | null; reviewed_at: string | null
  grade: Publication['grade'] | null; price: number | null; region: string | null; sim: Publication['sim'] | null
  registered: boolean; warranty: boolean; created_at: string
}

function toListing(r: Row): MyListing {
  const review: Review | undefined = r.status === 'pending'
    ? undefined
    : { status: r.status, note: r.review_note, by: r.reviewed_by ?? '', at: r.reviewed_at ? Date.parse(r.reviewed_at) : 0 }
  const publication: Publication | undefined = r.status === 'approved' && r.grade && r.price
    ? { grade: r.grade, price: r.price, region: r.region ?? undefined, sim: r.sim ?? undefined, registered: r.registered, warranty: r.warranty }
    : undefined
  return {
    id: r.id, code: r.code, phone: r.owner_phone, category: r.category, brand: r.brand, model: r.model, storage: r.storage,
    battery: r.battery, batteryCycles: r.battery_cycles ?? undefined, color: r.color, city: r.city, notes: r.notes, createdAt: Date.parse(r.created_at), review, publication,
  }
}

async function fetchListings(ownerPhone?: string): Promise<MyListing[]> {
  let q = supabase.from('listings').select(COLUMNS).is('deleted_at', null).order('created_at', { ascending: false })
  if (ownerPhone) q = q.eq('owner_phone', ownerPhone)
  const { data, error } = await q
  if (error) throw error
  return (data as Row[]).map(toListing)
}

export interface PhotoInput {
  name: string
  label: string
  blob: Blob
  /** Small copy shown in grids; stored next to the photo as `thumb-<name>.jpg`. */
  thumb: Blob
}

export interface SubmitResult {
  listing: MyListing | null
  photosSaved: boolean
  error?: string
}

/** Saves the device, then uploads its photos. The device is kept even if some photos fail. */
export async function submitListing(input: NewListing, photos: readonly PhotoInput[]): Promise<SubmitResult> {
  const { data, error } = await supabase
    .from('listings')
    .insert({
      owner_phone: input.phone, category: input.category, brand: input.brand, model: input.model, storage: input.storage,
      battery: input.battery, battery_cycles: input.batteryCycles ?? null, color: input.color, city: input.city, notes: input.notes,
    })
    .select(COLUMNS)
    .single()
  if (error || !data) return { listing: null, photosSaved: false, error: 'ثبت دستگاه ممکن نشد. اتصال اینترنت را بررسی کنید و دوباره تلاش کنید.' }
  const listing = toListing(data as Row)

  let photosSaved = true
  const upload = async (path: string, blob: Blob) => {
    const { error: upErr } = await supabase.storage.from('listing-photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    return !upErr
  }
  const uploaded = await Promise.all(photos.map(async (p) => {
    const path = `${listing.id}/${p.name}.jpg`
    const [full, thumb] = await Promise.all([upload(path, p.blob), upload(`${listing.id}/thumb-${p.name}.jpg`, p.thumb)])
    if (!full) { photosSaved = false; return null }
    if (!thumb) photosSaved = false
    return { listing_id: listing.id, slot: p.name, label: p.label, path }
  }))
  const rows = uploaded.filter((r): r is NonNullable<typeof r> => r !== null)
  if (rows.length) {
    const { error: insErr } = await supabase.from('listing_photos').insert(rows)
    if (insErr) photosSaved = false
  }
  invalidate('mine:')
  invalidate('all:')
  return { listing, photosSaved }
}

/** The signed-in partner's devices, newest first. */
export function useMyListings(phone: string | null): MyListing[] {
  const { data } = useRemote<MyListing[]>(`mine:${phone}`, () => fetchListings(phone ?? undefined), [], { enabled: phone !== null })
  return data
}

/** Every partner's devices — for کارشناس and admin. Pass `null` to skip loading (anyone else). */
export function useAllListings(scope: string | null): MyListing[] {
  const { data } = useRemote<MyListing[]>(`all:${scope}`, () => fetchListings(), [], { enabled: scope !== null })
  return data
}

export async function removeListing(id: string) {
  await supabase.rpc('remove_listing', { p_id: id })
  invalidate('mine:')
  invalidate('all:')
}

/** Puts a removed device back (undo). */
export async function restoreListing(id: string) {
  await supabase.rpc('restore_listing', { p_id: id })
  invalidate('mine:')
  invalidate('all:')
}

/** Approve (with grade and price — this publishes the device) or reject (with a reason). Returns an error message or null. */
export async function reviewListing(id: string, input: ReviewInput): Promise<string | null> {
  const approved = input.status === 'approved'
  const { error } = await supabase.rpc('review_listing', {
    p_id: id,
    p_status: input.status,
    p_note: input.note,
    p_grade: approved ? input.grade : null,
    p_price: approved ? input.price : null,
    p_region: approved ? (input.region ?? null) : null,
    p_sim: approved ? (input.sim ?? null) : null,
    p_registered: approved ? input.registered : false,
    p_warranty: approved ? input.warranty : false,
  })
  if (error) return 'ثبت تصمیم ممکن نشد. دوباره تلاش کنید.'
  invalidate('mine:')
  invalidate('all:')
  invalidate('catalog')
  return null
}

/** Back to the queue (also takes the device off the price list). */
export async function reopenListing(id: string) {
  await supabase.rpc('reopen_listing', { p_id: id })
  invalidate('mine:')
  invalidate('all:')
  invalidate('catalog')
}

/** Admin only: takes any device off the site (also off the price list). */
export async function adminRemoveListing(id: string) {
  await supabase.rpc('admin_remove_listing', { p_id: id })
  invalidate('mine:')
  invalidate('all:')
  invalidate('catalog')
}
