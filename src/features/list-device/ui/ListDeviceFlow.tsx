import { useMemo, useState, type FormEvent } from 'react'
import { categories, findCategory, type CategoryId } from '@/entities/category'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import { photoTemplates } from '../model/photo-templates'
import { emptyListingForm, type ListingForm, type PhotoSlot } from '../model/types'
import { photoKey, usePhotoSet } from '../model/usePhotoSet'
import { validateListing } from '../model/validate-listing'
import { CameraCapture } from './CameraCapture'
import { DeviceInfoFields } from './DeviceInfoFields'
import { ListingSidebar } from './ListingSidebar'
import { ListingSuccess } from './ListingSuccess'
import { PhotoSlotsPanel } from './PhotoSlotsPanel'
import './list-device.css'

const tabs = categories.map((c) => ({ id: c.id, label: c.title }))

/**
 * "List a device for sale": category tabs, device form, photo template with camera, validation.
 * Prototype: on success nothing is sent anywhere (no backend yet) — see ListingSuccess.
 */
export function ListDeviceFlow() {
  const [categoryId, setCategoryId] = useState<CategoryId>('phone')
  const [form, setForm] = useState<ListingForm>(emptyListingForm)
  const [errors, setErrors] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [cameraSlot, setCameraSlot] = useState<PhotoSlot | null>(null)
  const { photos, busyKey, attach, remove, clear } = usePhotoSet((message) => setErrors([message]))

  const category = findCategory(categoryId)
  const slots = photoTemplates[categoryId]
  const canUseCamera = useMemo(() => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia, [])
  const patchForm = (patch: Partial<ListingForm>) => setForm((f) => ({ ...f, ...patch }))

  const selectCategory = (id: CategoryId) => {
    setCategoryId(id)
    setErrors([])
    patchForm({ brand: '' })
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateListing({ category: categoryId, form, slots, hasPhoto: (slotId) => Boolean(photos[photoKey(categoryId, slotId)]) })
    setErrors(found)
    if (!found.length) {
      setDone(true)
      window.scrollTo(0, 0)
    }
  }

  const startAnother = () => {
    setDone(false)
    clear()
    setForm(emptyListingForm)
  }

  if (done) return <ListingSuccess onAnother={startAnother} />

  return (
    <div className="container page">
      <h1 className="page__title">ثبت دستگاه برای فروش</h1>
      <Tabs items={tabs} value={categoryId} onChange={selectCategory} />

      <form onSubmit={submit} className="upload" noValidate>
        <div className="upload__main">
          <DeviceInfoFields category={category} form={form} onChange={patchForm} />
          <PhotoSlotsPanel
            category={categoryId}
            slots={slots}
            photos={photos}
            busyKey={busyKey}
            canUseCamera={canUseCamera}
            onOpenCamera={setCameraSlot}
            onFile={(slot, file) => void attach(photoKey(categoryId, slot.id), file)}
            onRemove={(slot) => remove(photoKey(categoryId, slot.id))}
          />
        </div>
        <ListingSidebar category={categoryId} unlocked={form.unlocked} errors={errors} onUnlockedChange={(unlocked) => patchForm({ unlocked })} />
      </form>

      {cameraSlot && (
        <CameraCapture
          slot={cameraSlot}
          step={slots.findIndex((s) => s.id === cameraSlot.id) + 1}
          total={slots.length}
          onClose={() => setCameraSlot(null)}
          onCapture={(blob) => {
            const slot = cameraSlot
            setCameraSlot(null)
            void attach(photoKey(categoryId, slot.id), blob)
          }}
        />
      )}
    </div>
  )
}
