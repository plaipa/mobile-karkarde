import { useSyncExternalStore } from 'react'

export type TextSize = 'normal' | 'large'

const KEY = 'mk_text_size'
const listeners = new Set<() => void>()

function load(): TextSize {
  try { return localStorage.getItem(KEY) === 'large' ? 'large' : 'normal' } catch { return 'normal' }
}

let current = load()
/** Applied at import time so the page never flashes at the wrong size (see `[data-text-size]` in base.css). */
document.documentElement.dataset.textSize = current

function set(next: TextSize) {
  current = next
  document.documentElement.dataset.textSize = next
  try { localStorage.setItem(KEY, next) } catch { /* private mode: keep the choice in memory only */ }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }

/** The reader's "larger text" choice, shared by every component and remembered between visits. */
export function useTextSize() {
  const size = useSyncExternalStore(subscribe, () => current)
  return { size, toggle: () => set(size === 'large' ? 'normal' : 'large') }
}
