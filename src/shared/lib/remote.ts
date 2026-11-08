import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Tiny data-fetching helper (no library): loads on mount, reloads when a mutation calls `invalidate(prefix)`,
 * when the tab regains focus, and — unless `poll: false` — every 30 seconds.
 */
const listeners = new Map<string, Set<() => void>>()

/** Reload every mounted `useRemote` whose key starts with `prefix`. */
export function invalidate(prefix: string) {
  listeners.forEach((set, key) => {
    if (key.startsWith(prefix)) set.forEach((l) => l())
  })
}

/** Run `fn` whenever `invalidate(prefix)` matches `key`. Returns the unsubscribe function. */
export function onInvalidate(key: string, fn: () => void) {
  const set = listeners.get(key) ?? new Set<() => void>()
  set.add(fn)
  listeners.set(key, set)
  return () => { set.delete(fn) }
}

interface Options {
  /** false = don't fetch (e.g. signed out). */
  enabled?: boolean
  /** false = load once (use for signed photo URLs, which change on every load). */
  poll?: boolean
}

export function useRemote<T>(key: string, fetcher: () => Promise<T>, initial: T, { enabled = true, poll = true }: Options = {}) {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(enabled)
  const fetcherRef = useRef(fetcher)
  useEffect(() => { fetcherRef.current = fetcher })

  useEffect(() => {
    if (!enabled) { setData(initial); setLoading(false); return }
    let alive = true
    const load = async () => {
      try {
        const d = await fetcherRef.current()
        if (alive) { setData(d); setLoading(false) }
      } catch {
        if (alive) setLoading(false)
      }
    }
    void load()
    const set = listeners.get(key) ?? new Set<() => void>()
    set.add(load)
    listeners.set(key, set)
    const onFocus = () => void load()
    window.addEventListener('focus', onFocus)
    const timer = poll ? window.setInterval(load, 30000) : undefined
    return () => {
      alive = false
      set.delete(load)
      window.removeEventListener('focus', onFocus)
      if (timer) window.clearInterval(timer)
    }
    // `initial` is a constant per call site
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, poll])

  const reload = useCallback(() => invalidate(key), [key])
  return { data, loading, reload }
}
