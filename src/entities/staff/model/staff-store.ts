import { supabase } from '@/shared/api/supabase'
import { invalidate, useRemote } from '@/shared/lib/remote'

export type StaffRole = 'admin' | 'inspector'

export interface StaffMember {
  phone: string
  name: string
  role: StaffRole
  addedAt: number
}

/** Kept for the reviewer list. */
export type Inspector = StaffMember

interface StaffRow { phone: string; role: StaffRole; name: string; created_at: string }

/** Every active admin and کارشناس. Only an admin can read it (the database refuses everyone else). */
export function useStaff(enabled: boolean): StaffMember[] {
  const { data } = useRemote<StaffMember[]>('staff', async () => {
    const { data: rows, error } = await supabase.rpc('list_staff')
    if (error) throw error
    return (rows as StaffRow[]).map((r) => ({ phone: r.phone, name: r.name, role: r.role, addedAt: Date.parse(r.created_at) }))
  }, [], { enabled })
  return data
}

export function useInspectors(enabled: boolean): StaffMember[] {
  return useStaff(enabled).filter((m) => m.role === 'inspector')
}

const staffErrors: [string, string][] = [
  ['is yourself', 'روی حساب خودتان نمی‌توانید این کار را بکنید.'],
  ['last admin', 'آخرین ادمین را نمی‌شود برداشت یا کارشناس کرد؛ اول ادمین دیگری اضافه کنید.'],
  ['bad code', 'کد ورود باید ۶ تا ۳۲ حرف انگلیسی یا عدد باشد.'],
  ['bad phone', 'شمارهٔ موبایل درست نیست.'],
]

/** Appoints (or changes) an admin or a کارشناس with a login code only they know. Returns an error message, or null on success. */
export async function addStaffMember(phone: string, name: string, code: string, role: StaffRole): Promise<string | null> {
  const { error } = await supabase.rpc('add_staff_member', { p_phone: phone, p_name: name, p_code: code, p_role: role })
  if (error) return staffErrors.find(([key]) => error.message.includes(key))?.[1] ?? 'ذخیره نشد. دوباره تلاش کنید.'
  invalidate('staff')
  return null
}

export const addInspector = (phone: string, name: string, code: string) => addStaffMember(phone, name, code, 'inspector')

/** Removes an admin or a کارشناس (never yourself, never the last admin). Returns an error message, or null. */
export async function removeStaffMember(phone: string): Promise<string | null> {
  const { error } = await supabase.rpc('remove_staff', { p_phone: phone })
  if (error) return staffErrors.find(([key]) => error.message.includes(key))?.[1] ?? 'حذف نشد. دوباره تلاش کنید.'
  invalidate('staff')
  return null
}

export const removeInspector = removeStaffMember

export interface Partner {
  phone: string
  name: string
  joinedAt: number
  devices: number
  published: number
  blocked: boolean
}

interface PartnerRow { phone: string; name: string; joined_at: string; devices: number; published: number; blocked: boolean }

/** Every partner who has signed in (admin only). */
export function usePartners(enabled: boolean): Partner[] {
  const { data } = useRemote<Partner[]>('partners', async () => {
    const { data: rows, error } = await supabase.rpc('list_partners')
    if (error) throw error
    return (rows as PartnerRow[]).map((r) => ({ phone: r.phone, name: r.name, joinedAt: Date.parse(r.joined_at), devices: Number(r.devices), published: Number(r.published), blocked: r.blocked }))
  }, [], { enabled })
  return data
}

/** Blocks or unblocks a partner. A blocked number is signed out and cannot sign in again. */
export async function setPartnerBlocked(phone: string, blocked: boolean, reason = ''): Promise<boolean> {
  const { error } = await supabase.rpc('set_partner_blocked', { p_phone: phone, p_blocked: blocked, p_reason: reason })
  invalidate('partners')
  return !error
}
