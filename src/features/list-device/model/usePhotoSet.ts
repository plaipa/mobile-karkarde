import { useEffect, useRef, useState } from 'react'
import { processImage, type Processed } from '@/shared/lib/image/process-image'

type Photos = Record<string, Processed>

/** Photos are keyed by `<category>:<slotId>` so switching category never mixes shots. */
export const photoKey = (category: string, slotId: string) => `${category}:${slotId}`

const READ_ERROR = 'خواندن عکس ممکن نشد. فایل دیگری انتخاب کنید.'

/** Holds the processed photos and owns their object URLs (revoked on replace / remove / unmount). */
export function usePhotoSet(onError: (message: string) => void) {
  const [photos, setPhotos] = useState<Photos>({})
  const [busyKey, setBusyKey] = useState<string | null>(null)

  const latest = useRef(photos)
  useEffect(() => { latest.current = photos })
  useEffect(() => () => Object.values(latest.current).forEach((p) => URL.revokeObjectURL(p.url)), [])

  const attach = async (key: string, file: Blob) => {
    setBusyKey(key)
    try {
      const processed = await processImage(file)
      setPhotos((prev) => {
        if (prev[key]) URL.revokeObjectURL(prev[key].url)
        return { ...prev, [key]: processed }
      })
    } catch {
      onError(READ_ERROR)
    } finally {
      setBusyKey(null)
    }
  }

  const remove = (key: string) =>
    setPhotos((prev) => {
      const next = { ...prev }
      if (next[key]) URL.revokeObjectURL(next[key].url)
      delete next[key]
      return next
    })

  const clear = () =>
    setPhotos((prev) => {
      Object.values(prev).forEach((p) => URL.revokeObjectURL(p.url))
      return {}
    })

  return { photos, busyKey, attach, remove, clear }
}
