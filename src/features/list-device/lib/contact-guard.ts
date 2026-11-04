import { toEn } from '@/shared/lib/format'

/**
 * Listings are read by other partners, so contact details must never leak through free text —
 * the marketplace is the only channel between buyer and seller.
 */
export function containsContact(text: string): boolean {
  const t = toEn(text)
  const digits = t.replace(/[\s\-.()+]/g, '')
  return (
    /\d{8,}/.test(digits) ||
    /@|https?:|www\.|t\.me|instagram|telegram|whatsapp|واتساپ|واتس‌اپ|تلگرام|اینستا|ایتا|روبیکا/i.test(t)
  )
}
