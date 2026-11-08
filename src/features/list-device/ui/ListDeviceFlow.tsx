import { useMemo, useState, type FormEvent } from 'react'
import { categories, findCategory, type CategoryId } from '@/entities/category'
import { submitListing } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { Tabs } from '@/shared/ui/tabs/Tabs'
import { photoTemplates } from '../model/photo-templates'
import { emptyListingForm, type ListingForm, type PhotoSlot } from '../model/types'
import { photoKey, usePhotoSet } from '../model/usePhotoSet'
import { validateDeviceInfo, validateListing } from '../model/validate-listing'
import { CameraCapture } from './CameraCapture'
import { DeviceInfoFields } from './DeviceInfoFields'
import { ListingSidebar } from './ListingSidebar'
import { ListingSuccess } from './ListingSuccess'
import { PhotoSlotsPanel } from './PhotoSlotsPanel'
import { StepBar, type ListingStep } from './StepBar'
import './list-device.css'

const tabs = categories.map((c) => ({ id: c.id, label: c.title }))

/**
 * "List a device for sale" in two short steps (details, then photos): category tabs, device form, photo template with camera, validation.
 * Prototype: on success nothing is sent anywhere (no backend yet) — see ListingSuccess.
 */
export function ListDeviceFlow() {
  const { phone, city } = useSession()
  const [categoryId, setCategoryId] = useState<CategoryId>('phone')
  const [form, setForm] = useState<ListingForm>(() => ({ ...emptyListingForm, city }))
  const [errors, setErrors] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [photosSaved, setPhotosSaved] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<ListingStep>('info')
  const [cameraSlot, setCameraSlot] = useState<PhotoSlot | null>(null)
  const { photos, busyKey, attach, remove, clear } = usePhotoSet((message) => setErrors([message]))

  const category = findCategory(categoryId)
  const slots = photoTemplates[categoryId]
  const canUseCamera = useMemo(() => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia, [])
  const patchForm = (patch: Partial<ListingForm>) => setForm((f) => ({ ...f, ...patch }))

  const selectCategory = (id: CategoryId) => {
    setCategoryId(id)
    setErrors([])
    patchForm({ brand: '', model: '', storage: '', color: '' })
  }

  const goTo = (next: ListingStep) => {
    setStep(next)
    setErrors([])
    window.scrollTo(0, 0)
  }

  const nextStep = () => {
    const found = validateDeviceInfo(categoryId, form)
    if (found.length) setErrors(found)
    else goTo('photos')
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const found = validateListing({ category: categoryId, form, slots, hasPhoto: (slotId) => Boolean(photos[photoKey(categoryId, slotId)]) })
    setErrors(found)
    if (found.length || !phone || submitting) return
    setSubmitting(true)
    const shots = slots.flatMap((slot) => {
      const photo = photos[photoKey(categoryId, slot.id)]
      return photo ? [{ name: slot.id, label: slot.label, blob: photo.blob, thumb: photo.thumb }] : []
    })
    const result = await submitListing(
      { phone, category: categoryId, brand: form.brand, model: form.model.trim(), storage: form.storage, battery: form.battery, color: form.color, city: form.city, notes: form.notes.trim() },
      shots,
    )
    setSubmitting(false)
    if (!result.listing) {
      setErrors([result.error ?? 'ثبت دستگاه ممکن نشد. دوباره تلاش کنید.'])
      return
    }
    setPhotosSaved(result.photosSaved)
    setDone(true)
    window.scrollTo(0, 0)
  }

  const startAnother = () => {
    setDone(false)
    setStep('info')
    setPhotosSaved(null)
    clear()
    setForm({ ...emptyListingForm, city })
  }

  if (done) return <ListingSuccess photosSaved={photosSaved} onAnother={startAnother} />

  return (
    <div className="container page">
      <h1 className="page__title">ثبت دستگاه برای فروش</h1>
      <Tabs items={tabs} value={categoryId} onChange={selectCategory} />

      <StepBar step={step} />

      <form onSubmit={(e) => void submit(e)} className={step === 'photos' ? 'upload' : 'upload upload--single'} noValidate>
        {step === 'info' ? (
          <div className="upload__main">
            <DeviceInfoFields key={category.id} category={category} form={form} onChange={patchForm} />
            {errors.length > 0 && <ul className="error-list" role="alert">{errors.map((e) => <li key={e}>{e}</li>)}</ul>}
            <button type="button" className="btn btn--primary btn--lg btn--block" onClick={nextStep}>بعدی: عکس‌های دستگاه</button>
          </div>
        ) : (
          <>
            <div className="upload__main">
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
            <ListingSidebar category={categoryId} unlocked={form.unlocked} errors={errors} submitting={submitting} onUnlockedChange={(unlocked) => patchForm({ unlocked })} onBack={() => goTo('info')} />
          </>
        )}
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
