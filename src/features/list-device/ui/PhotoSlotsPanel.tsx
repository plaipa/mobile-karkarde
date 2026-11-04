import type { CategoryId } from '@/entities/category'
import { toFa } from '@/shared/lib/format'
import type { Processed } from '@/shared/lib/image/process-image'
import { photoKey } from '../model/usePhotoSet'
import type { PhotoSlot } from '../model/types'
import { PhotoSlotCard } from './PhotoSlotCard'
import './list-device.css'

interface Props {
  category: CategoryId
  slots: readonly PhotoSlot[]
  photos: Record<string, Processed>
  busyKey: string | null
  canUseCamera: boolean
  onOpenCamera: (slot: PhotoSlot) => void
  onFile: (slot: PhotoSlot, file: File) => void
  onRemove: (slot: PhotoSlot) => void
}

export function PhotoSlotsPanel({ category, slots, photos, busyKey, canUseCamera, onOpenCamera, onFile, onRemove }: Props) {
  const required = slots.filter((s) => s.required)
  const doneRequired = required.filter((s) => photos[photoKey(category, s.id)]).length
  return (
    <section className="panel">
      <div className="upload__head">
        <h2>عکس‌های دستگاه</h2>
        <span className="chip chip--soft">{toFa(doneRequired)} از {toFa(required.length)} عکس اجباری</span>
      </div>
      <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={required.length} aria-valuenow={doneRequired}>
        <i style={{ width: `${(doneRequired / required.length) * 100}%` }} />
      </div>
      <div className="slots">
        {slots.map((slot) => {
          const key = photoKey(category, slot.id)
          return (
            <PhotoSlotCard
              key={slot.id}
              slot={slot}
              category={category}
              photo={photos[key]}
              busy={busyKey === key}
              canUseCamera={canUseCamera}
              onOpenCamera={() => onOpenCamera(slot)}
              onFile={(file) => onFile(slot, file)}
              onRemove={() => onRemove(slot)}
            />
          )
        })}
      </div>
    </section>
  )
}
