import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

/** How a value is turned into a localStorage string. `encode` returning null removes the key. */
export interface StorageCodec<T> {
  decode: (raw: string) => T
  encode: (value: T) => string | null
}

/** Create once at module level (`const codec = jsonCodec<string[]>()`) so the identity stays stable. */
export const jsonCodec = <T>(): StorageCodec<T> => ({ decode: JSON.parse, encode: JSON.stringify })
export const nullableStringCodec: StorageCodec<string | null> = { decode: (raw) => raw, encode: (value) => value }

function read<T>(key: string, fallback: T, codec: StorageCodec<T>): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : codec.decode(raw)
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T, codec: StorageCodec<T>) {
  try {
    const raw = codec.encode(value)
    if (raw === null) localStorage.removeItem(key)
    else localStorage.setItem(key, raw)
  } catch {
    /* storage unavailable (private mode, quota) — the app keeps working in memory */
  }
}

/** `useState` that survives reloads. Pass a module-level codec so its identity is stable. */
export function usePersistentState<T>(key: string, initial: T, codec: StorageCodec<T>): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => read(key, initial, codec))
  useEffect(() => write(key, value, codec), [key, value, codec])
  return [value, setValue]
}
