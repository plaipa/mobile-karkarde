export interface Processed {
  blob: Blob
  url: string
  width: number
  height: number
  warnings: string[]
}

const MAX_SIDE = 1600

async function decode(src: Blob): Promise<{ draw: CanvasImageSource; w: number; h: number; close: () => void }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(src, { imageOrientation: 'from-image' })
      return { draw: bmp, w: bmp.width, h: bmp.height, close: () => bmp.close() }
    } catch { /* fall back to <img> */ }
  }
  const url = URL.createObjectURL(src)
  const img = new Image()
  img.src = url
  await img.decode()
  return { draw: img, w: img.naturalWidth, h: img.naturalHeight, close: () => URL.revokeObjectURL(url) }
}

/**
 * Re-encodes the photo through a canvas (which drops EXIF/GPS/device-name metadata)
 * and runs cheap quality checks (resolution, brightness, blur) so bad shots are caught on the spot.
 */
export async function processImage(src: Blob): Promise<Processed> {
  const d = await decode(src)
  try {
    const k = Math.min(1, MAX_SIDE / Math.max(d.w, d.h))
    const w = Math.round(d.w * k)
    const h = Math.round(d.h * k)
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    const ctx = c.getContext('2d')
    if (!ctx) throw new Error('canvas unavailable')
    ctx.drawImage(d.draw, 0, 0, w, h)

    const warnings: string[] = []
    if (Math.max(d.w, d.h) < 900) warnings.push('وضوح عکس کم است؛ نزدیک‌تر یا با کیفیت بالاتر بگیرید.')

    const sw = 200
    const sh = Math.max(1, Math.round((h / w) * sw))
    const s = document.createElement('canvas')
    s.width = sw; s.height = sh
    const sctx = s.getContext('2d', { willReadFrequently: true })
    if (sctx) {
      sctx.drawImage(c, 0, 0, sw, sh)
      const { data } = sctx.getImageData(0, 0, sw, sh)
      const g = new Float32Array(sw * sh)
      let sum = 0
      for (let i = 0; i < g.length; i++) {
        g[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
        sum += g[i]
      }
      const mean = sum / g.length
      let lap = 0, n = 0
      for (let y = 1; y < sh - 1; y++) {
        for (let x = 1; x < sw - 1; x++) {
          const i = y * sw + x
          const v = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - sw] - g[i + sw]
          lap += v * v; n++
        }
      }
      const variance = lap / Math.max(1, n)
      if (mean < 55) warnings.push('عکس تاریک است؛ نور بیشتری بدهید.')
      else if (mean > 225) warnings.push('عکس بیش‌ازحد روشن است؛ از نور مستقیم دوری کنید.')
      if (variance < 25) warnings.push('عکس تار به نظر می‌رسد؛ دوباره بگیرید.')
    }

    const blob: Blob = await new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/jpeg', 0.88))
    return { blob, url: URL.createObjectURL(blob), width: w, height: h, warnings }
  } finally {
    d.close()
  }
}

// Listings are written for other partners to read, so contact details must never leak through free text.
export function containsContact(text: string): boolean {
  const t = text
    .replace(/[۰-۹]/g, (x) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(x)))
    .replace(/[٠-٩]/g, (x) => String(x.charCodeAt(0) - 0x0660))
  const digits = t.replace(/[\s\-.()+]/g, '')
  return (
    /\d{8,}/.test(digits) ||
    /@|https?:|www\.|t\.me|instagram|telegram|whatsapp|واتساپ|واتس‌اپ|تلگرام|اینستا|ایتا|روبیکا/i.test(t)
  )
}
