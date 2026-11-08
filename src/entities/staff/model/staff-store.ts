import { useSyncExternalStore } from 'react'
import { adminPhones } from '@/shared/config/staff'
import { roleOf, type Inspector, type Role } from './roles'

/**
 * Prototype only: the inspector list lives in this browser's localStorage. When the backend arrives, keep these
 * function names and replace the bodies with requests; callers do not change.
 */
const KEY = 'mk_inspectors'
const listeners = new Set<() => void>()
let cache: { raw: string | null; list: Inspector[] } = { raw: null, list: [] }

function load(): Inspector[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return cache.list
  }
  if (raw === cache.raw) return cache.list
  let list: Inspector[] = []
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    list = Array.isArray(parsed) ? (parsed as Inspector[]) : []
  } catch {
    list = []
  }
  cache = { raw, list }
  return list
}

function save(list: Inspector[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    cache = { raw: null, list } // storage unavailable: keep it in memory for this visit
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

/** Appoints (or renames) an inspector. Returns false when the number is an admin's. */
export function addInspector(phone: string, name: string): boolean {
  if (adminPhones.includes(phone)) return false
  const rest = load().filter((i) => i.phone !== phone)
  save([{ phone, name: name.trim(), addedAt: Date.now() }, ...rest])
  return true
}

export function removeInspector(phone: string) {
  save(load().filter((i) => i.phone !== phone))
}

export function useInspectors(): Inspector[] {
  return useSyncExternalStore(subscribe, load, () => [])
}

/** The signed-in user's role; null when signed out. */
export function useRole(phone: string | null): Role | null {
  return roleOf(phone, adminPhones, useInspectors())
}
