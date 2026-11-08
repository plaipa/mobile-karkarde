import type { CategoryId } from '@/entities/category'
import { activeCities } from '@/shared/config/cities'
import { toEn } from '@/shared/lib/format'
import { containsContact } from '../lib/contact-guard'
import type { ListingForm, PhotoSlot } from './types'

interface Input {
  category: CategoryId
  form: ListingForm
  /** Slots of the chosen category. */
  slots: readonly PhotoSlot[]
  hasPhoto: (slotId: string) => boolean
}

/** A phone at 100% battery health is asked for its cycle count too (how worn the battery really is). */
export const asksBatteryCycles = (category: CategoryId, battery: string) => category === 'phone' && toEn(battery).trim() === '100'

/** Pure: the device-details step only (brand, model, battery, no contact info in the text). */
export function validateDeviceInfo(category: CategoryId, form: ListingForm): string[] {
  const errors: string[] = []
  const needsBattery = category !== 'speaker'

  if (!activeCities.includes(form.city)) errors.push('شهر دستگاه را انتخاب کنید.')
  if (!form.brand) errors.push('برند را انتخاب کنید.')
  if (!form.model.trim()) errors.push('مدل دستگاه را وارد کنید.')
  if (needsBattery && !/^\d{1,3}$/.test(toEn(form.battery))) errors.push('سلامت باتری را به‌صورت عدد (۰ تا ۱۰۰) وارد کنید.')
  if (asksBatteryCycles(category, form.battery) && !/^\d{1,4}$/.test(toEn(form.batteryCycles).trim())) errors.push('سایکل باتری را به‌صورت عدد وارد کنید.')
  if (containsContact(form.notes) || containsContact(form.model)) {
    errors.push('در توضیحات، شماره تلفن یا آیدی شبکه‌های اجتماعی مجاز نیست. ارتباط فقط از طریق موبایل کارکرده انجام می‌شود.')
  }
  return errors
}

/** Pure: returns the user-facing error messages for the whole listing (empty = valid). */
export function validateListing({ category, form, slots, hasPhoto }: Input): string[] {
  const errors = validateDeviceInfo(category, form)
  const needsBattery = category !== 'speaker'
  const missing = slots.filter((s) => s.required && !hasPhoto(s.id))
  if (missing.length) errors.push(`عکس‌های اجباری باقی‌مانده: ${missing.map((s) => s.label).join('، ')}`)
  if (needsBattery && !form.unlocked) errors.push('باید تأیید کنید که قفل حساب (iCloud / Google / Samsung) دستگاه خاموش است.')

  return errors
}
