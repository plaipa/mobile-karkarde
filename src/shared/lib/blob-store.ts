/**
 * Tiny IndexedDB wrapper for binary data (photos are far too big for localStorage).
 * Every call degrades quietly: if IndexedDB is unavailable (private mode, blocked), reads return [] and writes report false.
 */
const DB_NAME = 'mk_blobs'
const STORE = 'files'

export interface StoredBlob {
  /** Group key (e.g. a listing id) — records are written, read and deleted per group. */
  group: string
  /** Unique within the group. */
  name: string
  label: string
  blob: Blob
}

let dbPromise: Promise<IDBDatabase> | null = null

function open(): Promise<IDBDatabase> {
  const pending = (dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('indexedDB unavailable'))
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: ['group', 'name'] })
      store.createIndex('group', 'group')
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  }))
  pending.catch(() => { dbPromise = null })
  return pending
}

const done = (tx: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })

/** Replaces everything stored under `group`. Returns false when the browser refused (quota, private mode). */
export async function putGroup(group: string, items: readonly Omit<StoredBlob, 'group'>[]): Promise<boolean> {
  try {
    const db = await open()
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const existing = store.index('group').getAllKeys(IDBKeyRange.only(group))
    existing.onsuccess = () => existing.result.forEach((k) => store.delete(k))
    items.forEach((item) => store.put({ ...item, group }))
    await done(tx)
    return true
  } catch {
    return false
  }
}

export async function getGroup(group: string): Promise<StoredBlob[]> {
  try {
    const db = await open()
    const req = db.transaction(STORE).objectStore(STORE).index('group').getAll(IDBKeyRange.only(group))
    return await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result as StoredBlob[])
      req.onerror = () => reject(req.error)
    })
  } catch {
    return []
  }
}

export async function deleteGroup(group: string): Promise<void> {
  try {
    const db = await open()
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const keys = store.index('group').getAllKeys(IDBKeyRange.only(group))
    keys.onsuccess = () => keys.result.forEach((k) => store.delete(k))
    await done(tx)
  } catch {
    /* nothing to clean */
  }
}

export async function clearAll(): Promise<void> {
  try {
    const db = await open()
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).clear()
    await done(tx)
  } catch {
    /* nothing to clean */
  }
}
