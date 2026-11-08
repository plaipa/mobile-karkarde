import { useEffect, useSyncExternalStore } from 'react'
import { supabase } from '@/shared/api/supabase'
import { toEn } from '@/shared/lib/format'
import { onInvalidate } from '@/shared/lib/remote'
import type { Product } from '../model/types'

interface Row {
  listing_id: string; code: string; category: Product['category']; brand: string; name: string; storage: string
  region: string | null; sim: Product['sim'] | null; battery: string; grade: Product['grade']; price: number | null
  registered: boolean; warranty: boolean; color: string; notes: string; city: string; published_at: string; battery_cycles: number | null
}

/** "۲۵۶ گیگابایت" -> 256, "۱ ترابایت" -> 1024. */
export function parseStorageGb(text: string): number | undefined {
  const n = Number(toEn(text).replace(/[^\d.]/g, ''))
  if (!n) return undefined
  return /ترا|TB/i.test(text) ? n * 1024 : n
}

function toProduct(r: Row): Product {
  const battery = Number(toEn(r.battery))
  return {
    code: r.code, category: r.category, brand: r.brand, name: r.name, storage: r.storage || undefined,
    storageGb: r.category === 'phone' ? parseStorageGb(r.storage) : undefined,
    region: r.region ?? undefined, sim: r.sim ?? undefined, battery: battery > 0 ? battery : undefined, batteryCycles: r.battery_cycles ?? undefined,
    grade: r.grade, price: r.price ?? 0, registered: r.registered, warranty: r.warranty, color: r.color,
    addedDays: Math.max(0, Math.floor((Date.now() - Date.parse(r.published_at)) / 86_400_000)),
    notes: r.notes, city: r.city, listingId: r.listing_id,
  }
}

let published: readonly Product[] = []
let version = 0
const listeners = new Set<() => void>()

export const getPublished = () => published

/** Reloads the approved devices (the price is empty for visitors who are not signed in). */
export async function refreshPublished() {
  const { data, error } = await supabase.from('published_products').select('*').order('published_at', { ascending: false })
  if (error) return
  published = (data as Row[]).map(toProduct)
  version++
  listeners.forEach((l) => l())
}

let wired = false
/** Sign-in or sign-out changes whether prices come back; a کارشناس's decision changes what is published. Started on first use in the browser. */
function wire() {
  if (wired) return
  wired = true
  supabase.auth.onAuthStateChange(() => { window.setTimeout(() => void refreshPublished(), 0) })
  onInvalidate('catalog', () => void refreshPublished())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => { listeners.delete(l) }
}

/** Re-renders when the published list changes, and keeps it fresh while the app is open. Returns a version number for memo deps. */
export function useCatalogVersion(): number {
  useEffect(() => {
    wire()
    void refreshPublished()
    const onFocus = () => void refreshPublished()
    window.addEventListener('focus', onFocus)
    const timer = window.setInterval(() => void refreshPublished(), 60_000)
    return () => { window.removeEventListener('focus', onFocus); window.clearInterval(timer) }
  }, [])
  return useSyncExternalStore(subscribe, () => version, () => 0)
}
