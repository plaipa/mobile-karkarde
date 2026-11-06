import { describe, expect, it } from 'vitest'
import { photoTemplates } from './photo-templates'
import { emptyListingForm, type ListingForm } from './types'
import { validateDeviceInfo, validateListing } from './validate-listing'

const validPhone: ListingForm = { ...emptyListingForm, brand: 'اپل', model: 'آیفون ۱۳', battery: '۹۰', unlocked: true }
const slots = photoTemplates.phone
const allPhotos = () => true

const run = (form: ListingForm, hasPhoto: (id: string) => boolean = allPhotos, category: 'phone' | 'speaker' = 'phone') =>
  validateListing({ category, form, slots: photoTemplates[category], hasPhoto })

describe('validateListing', () => {
  it('accepts a complete phone listing', () => {
    expect(run(validPhone)).toEqual([])
  })

  it('reports every missing basic field at once', () => {
    expect(run(emptyListingForm, allPhotos)).toHaveLength(4) // brand, model, battery, account lock
  })

  it('lists the required photos that are missing, by label', () => {
    const errors = run(validPhone, (id) => id !== 'back')
    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('پشت گوشی')
  })

  it('does not require optional photos', () => {
    const optional = new Set(slots.filter((s) => !s.required).map((s) => s.id))
    expect(run(validPhone, (id) => !optional.has(id))).toEqual([])
  })

  it('blocks contact details in notes and model', () => {
    expect(run({ ...validPhone, notes: 'زنگ بزن 09123456789' })).toHaveLength(1)
    expect(run({ ...validPhone, model: 'آیفون @shop' })).toHaveLength(1)
  })

  it('speakers need neither battery nor account-lock confirmation', () => {
    const speaker = { ...emptyListingForm, brand: 'سونی', model: 'SRS-XB43' }
    expect(run(speaker, allPhotos, 'speaker')).toEqual([])
  })
})

describe('validateDeviceInfo (step 1)', () => {
  it('only checks the details, not photos or the account-lock confirmation', () => {
    expect(validateDeviceInfo('phone', { ...validPhone, unlocked: false })).toEqual([])
  })

  it('reports missing brand, model and battery', () => {
    expect(validateDeviceInfo('phone', emptyListingForm)).toHaveLength(3)
  })

  it('does not ask a speaker for battery health', () => {
    expect(validateDeviceInfo('speaker', { ...emptyListingForm, brand: 'جی‌بی‌ال', model: 'Flip 6' })).toEqual([])
  })
})

describe('listing city', () => {
  it('starts on an active city and rejects one the service does not cover', () => {
    expect(validateDeviceInfo('phone', validPhone)).toEqual([])
    expect(validateDeviceInfo('phone', { ...validPhone, city: 'شهر ناشناس' })).toEqual(['شهر دستگاه را انتخاب کنید.'])
  })
})
