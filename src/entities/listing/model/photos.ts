import { supabase } from '@/shared/api/supabase'
import { useRemote } from '@/shared/lib/remote'

export type PhotoState = 'pending' | 'processing' | 'done' | 'failed' | 'skipped'

export interface ListingPhoto {
  name: string
  label: string
  /** The photo as the partner took it. */
  url: string
  /** Small copy of it for grids (falls back to the full photo for older uploads). */
  thumbUrl: string
  /** Where the background-removal worker is with this photo. */
  state: PhotoState
  /** The same photo on the standard background; only when `state` is `done`. */
  processed?: { url: string; thumbUrl: string }
}

/** A device's photos as short-lived signed links (the bucket is private). `null` while loading. */
export function usePhotos(listingId: string): ListingPhoto[] | null {
  const { data, loading } = useRemote<ListingPhoto[]>(`photos:${listingId}`, async () => {
    const { data: rows, error } = await supabase
      .from('listing_photos')
      .select('slot, label, path, process_status, processed_path')
      .eq('listing_id', listingId)
      .order('slot')
    if (error) throw error
    if (!rows.length) return []
    const thumbOf = (path: string) => path.replace(/\/([^/]+)$/, '/thumb-$1')
    const paths = rows.flatMap((r) => {
      const own = [r.path as string, thumbOf(r.path as string)]
      return r.process_status === 'done' && r.processed_path ? [...own, r.processed_path as string, thumbOf(r.processed_path as string)] : own
    })
    const { data: signed, error: signErr } = await supabase.storage.from('listing-photos').createSignedUrls(paths, 3600)
    if (signErr) throw signErr
    const urlOf = (path: string) => signed.find((s) => s.path === path)?.signedUrl ?? null
    return rows.flatMap((r) => {
      const url = urlOf(r.path as string)
      if (!url) return []
      const done = r.process_status === 'done' && r.processed_path
      const processedUrl = done ? urlOf(r.processed_path as string) : null
      return [{
        name: r.slot as string,
        label: r.label as string,
        url,
        thumbUrl: urlOf(thumbOf(r.path as string)) ?? url,
        state: r.process_status as PhotoState,
        processed: processedUrl ? { url: processedUrl, thumbUrl: urlOf(thumbOf(r.processed_path as string)) ?? processedUrl } : undefined,
      }]
    })
  }, [], { poll: false })
  return loading ? null : data
}
