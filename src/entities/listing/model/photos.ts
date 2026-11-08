import { supabase } from '@/shared/api/supabase'
import { useRemote } from '@/shared/lib/remote'

export interface ListingPhoto {
  name: string
  label: string
  /** Full-size photo. */
  url: string
  /** Small copy for grids (falls back to the full photo for older uploads). */
  thumbUrl: string
}

/** A device's photos as short-lived signed links (the bucket is private). `null` while loading. */
export function usePhotos(listingId: string): ListingPhoto[] | null {
  const { data, loading } = useRemote<ListingPhoto[]>(`photos:${listingId}`, async () => {
    const { data: rows, error } = await supabase.from('listing_photos').select('slot, label, path').eq('listing_id', listingId).order('slot')
    if (error) throw error
    if (!rows.length) return []
    const thumbPath = (path: string) => path.replace(/\/([^/]+)$/, '/thumb-$1')
    const paths = rows.flatMap((r) => [r.path as string, thumbPath(r.path as string)])
    const { data: signed, error: signErr } = await supabase.storage.from('listing-photos').createSignedUrls(paths, 3600)
    if (signErr) throw signErr
    const urlOf = (path: string) => signed.find((s) => s.path === path)?.signedUrl ?? null
    return rows.flatMap((r) => {
      const url = urlOf(r.path as string)
      return url ? [{ name: r.slot as string, label: r.label as string, url, thumbUrl: urlOf(thumbPath(r.path as string)) ?? url }] : []
    })
  }, [], { poll: false })
  return loading ? null : data
}
