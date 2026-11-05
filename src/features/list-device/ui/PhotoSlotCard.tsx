import type { CategoryId } from '@/entities/category'
import type { Processed } from '@/shared/lib/image/process-image'
import type { PhotoSlot } from '../model/types'
import { SlotArt } from './SlotArt'
import './list-device.css'

interface Props {
  slot: PhotoSlot
  category: CategoryId
  photo: Processed | undefined
  busy: boolean
  canUseCamera: boolean
  onOpenCamera: () => void
  onFile: (file: File) => void
  onRemove: () => void
}

export function PhotoSlotCard({ slot, category, photo, busy, canUseCamera, onOpenCamera, onFile, onRemove }: Props) {
  return (
    <div className={`slot${photo ? ' is-done' : ''}`}>
      <div className="slot__box">
        {photo
          ? <img src={photo.url} alt={slot.label} />
          : <SlotArt category={category} slotId={slot.id} />}
        {busy && <span className="slot__busy">در حال پردازش…</span>}
        {photo && <span className="slot__ok">✓</span>}
      </div>
      <div className="slot__meta">
        <span className={`chip ${slot.required ? 'chip--req' : 'chip--muted'}`}>{slot.required ? 'اجباری' : 'اختیاری'}</span>
        <strong>{slot.label}</strong>
      </div>
      <small className="muted">{slot.hint}</small>
      {photo?.warnings.map((w) => <small key={w} className="warn">⚠ {w}</small>)}
      <div className="slot__actions">
        {canUseCamera && !slot.screenshot && (
          <button type="button" className="btn btn--primary btn--sm" onClick={onOpenCamera}>{photo ? 'گرفتن مجدد' : 'گرفتن عکس'}</button>
        )}
        <label className="btn btn--outline btn--sm">
          {slot.screenshot ? 'انتخاب اسکرین‌شات' : 'گالری'}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFile(file)
              e.target.value = ''
            }}
          />
        </label>
        {photo && <button type="button" className="btn btn--outline btn--sm" onClick={onRemove}>حذف</button>}
      </div>
    </div>
  )
}
