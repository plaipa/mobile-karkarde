import { useEffect, useRef, useState } from 'react'
import type { GuideShape, PhotoSlot } from '../data'

const guide: Record<GuideShape, { w: number; h: number; r: number }> = {
  tall: { w: 46, h: 76, r: 12 },
  wide: { w: 80, h: 38, r: 8 },
  edgeH: { w: 82, h: 9, r: 4 },
  edgeV: { w: 10, h: 78, r: 4 },
  square: { w: 58, h: 42, r: 10 },
  watch: { w: 52, h: 56, r: 24 },
  speaker: { w: 50, h: 60, r: 28 },
  free: { w: 80, h: 60, r: 6 },
}

interface Props {
  slot: PhotoSlot
  step: number
  total: number
  onCapture: (blob: Blob) => void
  onClose: () => void
}

export function CameraCapture({ slot, step, total, onCapture, onClose }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    let cancelled = false
    if (!navigator.mediaDevices?.getUserMedia) { setError('دوربین در این مرورگر در دسترس نیست. از گزینهٔ «گالری» استفاده کنید.'); return }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } }, audio: false })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return }
        stream = s
        const v = video.current
        if (v) { v.srcObject = s; void v.play().then(() => setReady(true)).catch(() => setReady(true)) }
      })
      .catch(() => setError('اجازهٔ دسترسی به دوربین داده نشد. می‌توانید از گزینهٔ «گالری» استفاده کنید.'))
    return () => { cancelled = true; stream?.getTracks().forEach((t) => t.stop()) }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const shoot = () => {
    const v = video.current
    if (!v || !v.videoWidth) return
    const c = document.createElement('canvas')
    c.width = v.videoWidth; c.height = v.videoHeight
    c.getContext('2d')?.drawImage(v, 0, 0)
    c.toBlob((b) => { if (b) onCapture(b) }, 'image/jpeg', 0.92)
  }

  const g = guide[slot.shape]
  return (
    <div className="cam" role="dialog" aria-modal="true" aria-label={`گرفتن عکس: ${slot.label}`}>
      <video ref={video} className="cam__video" playsInline muted />
      {!error && (
        <div className="cam__guide" style={{ width: `${g.w}%`, height: `${g.h}%`, borderRadius: g.r * 2 }} aria-hidden="true" />
      )}
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
