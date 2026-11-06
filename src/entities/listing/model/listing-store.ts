import { useSyncExternalStore } from 'react'
import type { MyListing, NewListing } from './types'

/**
 * Prototype only: submitted devices live in this browser's localStorage. When the backend arrives, keep these
 * function names and replace the body with requests; callers do not change.
 */
const KEY = 'mk_listings'
const listeners = new Set<() => void>()
let cache: { raw: string | null; list: MyListing[] } = { raw: null, list: [] }

function load(): MyListing[] {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(KEY)
  } catch {
    return cache.list
  }
  if (raw === cache.raw) return cache.list
  let list: MyListing[] = []
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    list = Array.isArray(parsed) ? (parsed as MyListing[]) : []
  } catch {
    list = []
  }
  cache = { raw, list }
  return list
}

function save(list: MyListing[]) {
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

export function addListing(input: NewListing): MyListing {
  const listing: MyListing = { ...input, id: crypto.randomUUID(), createdAt: Date.now() }
  save([listing, ...load()])
  return listing
}

/** Puts a removed device back exactly as it was (undo). */
export function restoreListing(listing: MyListing) {
  const rest = load().filter((l) => l.id !== listing.id)
  save([...rest, listing].sort((a, b) => b.createdAt - a.createdAt))
}

export function removeListing(id: string) {
  save(load().filter((l) => l.id !== id))
}

/** The signed-in partner's devices, newest first. */
export function useMyListings(phone: string | null): MyListing[] {
  const all = useSyncExternalStore(subscribe, load, () => [])
  return phone ? all.filter((l) => l.phone === phone) : []
}
