import { useEffect, useRef, useState } from 'react'
import type { GuideShape, PhotoSlot } from '../model/types'
import './list-device.css'

/** Size of the dashed framing guide, in % of the preview, and its corner radius. */
const guides: Record<GuideShape, { w: number; h: number; r: number }> = {
  tall: { w: 46, h: 76, r: 12 },
  wide: { w: 80, h: 38, r: 8 },
  edgeH: { w: 82, h: 9, r: 4 },
  edgeV: { w: 10, h: 78, r: 4 },
  square: { w: 58, h: 42, r: 10 },
  watch: { w: 52, h: 56, r: 24 },
  speaker: { w: 50, h: 60, r: 28 },
  free: { w: 80, h: 60, r: 6 },
}

const NO_CAMERA = 'دوربین در این مرورگر در دسترس نیست. از گزینهٔ «گالری» استفاده کنید.'
const PERMISSION_DENIED = 'اجازهٔ دسترسی به دوربین داده نشد. می‌توانید از گزینهٔ «گالری» استفاده کنید.'

interface Props {
  slot: PhotoSlot
  /** 1-based position of this shot in the template. */
  step: number
  total: number
  onCapture: (blob: Blob) => void
  onClose: () => void
}

/** Full-screen camera with a framing guide, so every seller shoots the same angles. */
export function CameraCapture({ slot, step, total, onCapture, onClose }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const hasCameraApi = Boolean(navigator.mediaDevices?.getUserMedia)
  const [error, setError] = useState(hasCameraApi ? '' : NO_CAMERA)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false
    if (!hasCameraApi) return
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop())
          return
        }
        stream = s
        const el = video.current
        if (el) {
          el.srcObject = s
          void el.play().then(() => setReady(true)).catch(() => setReady(true))
        }
      })
      .catch(() => setError(PERMISSION_DENIED))
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [hasCameraApi])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const shoot = () => {
    const el = video.current
    if (!el || !el.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = el.videoWidth
    canvas.height = el.videoHeight
    canvas.getContext('2d')?.drawImage(el, 0, 0)
    canvas.toBlob((b) => { if (b) onCapture(b) }, 'image/jpeg', 0.92)
  }

  const guide = guides[slot.shape]
  return (
    <div className="cam" role="dialog" aria-modal="true" aria-label={`گرفتن عکس: ${slot.label}`}>
      <video ref={video} className="cam__video" playsInline muted />
      {!error && <div className="cam__guide" style={{ width: `${guide.w}%`, height: `${guide.h}%`, borderRadius: guide.r * 2 }} aria-hidden="true" />}
      <div className="cam__top">
        <button className="cam__x" onClick={onClose} aria-label="بستن">✕</button>
        <div><strong>{slot.label}</strong><small>مرحله {step.toLocaleString('fa-IR')} از {total.toLocaleString('fa-IR')}</small></div>
      </div>
      <p className="cam__hint">{error || slot.hint}</p>
      <div className="cam__bar">
        <button className="cam__shutter" onClick={shoot} disabled={!ready || !!error} aria-label="گرفتن عکس" />
      </div>
    </div>
  )
}
