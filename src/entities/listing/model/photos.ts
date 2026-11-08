import { supabase } from '@/shared/api/supabase'
import { useRemote } from '@/shared/lib/remote'

export interface ListingPhoto {
  name: string
  label: string
  url: string
}

/** A device's photos as short-lived signed links (the bucket is private). `null` while loading. */
export function usePhotos(listingId: string): ListingPhoto[] | null {
  const { data, loading } = useRemote<ListingPhoto[]>(`photos:${listingId}`, async () => {
    const { data: rows, error } = await supabase.from('listing_photos').select('slot, label, path').eq('listing_id', listingId).order('slot')
    if (error) throw error
    if (!rows.length) return []
    const { data: signed, error: signErr } = await supabase.storage.from('listing-photos').createSignedUrls(rows.map((r) => r.path), 3600)
    if (signErr) throw signErr
    return rows.flatMap((r, i) => {
      const url = signed[i]?.signedUrl
      return url ? [{ name: r.slot as string, label: r.label as string, url }] : []
    })
  }, [], { poll: false })
  return loading ? null : data
}
