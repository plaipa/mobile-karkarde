import { supabase } from '@/shared/api/supabase'
import { invalidate, useRemote } from '@/shared/lib/remote'

export interface Inspector {
  phone: string
  name: string
  addedAt: number
}

interface StaffRow { phone: string; role: string; name: string; created_at: string }

/** The «کارشناس» list. Only an admin can read it (the database refuses everyone else). */
export function useInspectors(enabled: boolean): Inspector[] {
  const { data } = useRemote<Inspector[]>('staff', async () => {
    const { data: rows, error } = await supabase.rpc('list_staff')
    if (error) throw error
    return (rows as StaffRow[]).filter((r) => r.role === 'inspector').map((r) => ({ phone: r.phone, name: r.name, addedAt: Date.parse(r.created_at) }))
  }, [], { enabled })
  return data
}

/** Appoints a کارشناس with a login code only they know. Returns an error message, or null on success. */
export async function addInspector(phone: string, name: string, code: string): Promise<string | null> {
  const { error } = await supabase.rpc('add_staff', { p_phone: phone, p_name: name, p_code: code })
  if (error) {
    if (error.message.includes('is admin')) return 'این شماره مدیر سایت است و خودش دسترسی دارد.'
    if (error.message.includes('bad code')) return 'کد ورود باید ۶ تا ۳۲ حرف انگلیسی یا عدد باشد.'
    return 'ذخیره نشد. دوباره تلاش کنید.'
  }
  invalidate('staff')
  return null
}

export async function removeInspector(phone: string) {
  await supabase.rpc('remove_staff', { p_phone: phone })
  invalidate('staff')
}

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
