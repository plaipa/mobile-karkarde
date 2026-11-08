import { useEffect, useState } from 'react'
import { deleteGroup, getGroup, putGroup } from '@/shared/lib/blob-store'

export interface ListingPhoto {
  name: string
  label: string
  url: string
}

export interface PhotoInput {
  name: string
  label: string
  blob: Blob
}

/**
 * Prototype only: a device's photos live in this browser's IndexedDB, keyed by the listing id.
 * With the backend, upload them instead and keep these three names.
 */
export const savePhotos = (listingId: string, photos: readonly PhotoInput[]) => putGroup(listingId, photos)
export const deletePhotos = (listingId: string) => deleteGroup(listingId)

/** The device's photos as object URLs (revoked on unmount). `null` while loading. */
export function usePhotos(listingId: string): ListingPhoto[] | null {
  const [photos, setPhotos] = useState<ListingPhoto[] | null>(null)
  useEffect(() => {
    let cancelled = false
    const urls: string[] = []
    void getGroup(listingId).then((rows) => {
      if (cancelled) return
      const list = rows.map((r) => {
        const url = URL.createObjectURL(r.blob)
        urls.push(url)
        return { name: r.name, label: r.label, url }
      })
      setPhotos(list)
    })
    return () => {
      cancelled = true
      urls.forEach((u) => URL.revokeObjectURL(u))
    }
  }, [listingId])
  return photos
}
