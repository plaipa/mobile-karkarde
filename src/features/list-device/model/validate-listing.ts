import type { CategoryId } from '@/entities/category'
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

/** Pure: returns the user-facing error messages (empty = valid). */
export function validateListing({ category, form, slots, hasPhoto }: Input): string[] {
  const errors: string[] = []
  const needsBattery = category !== 'speaker'

  if (!form.brand) errors.push('برند را انتخاب کنید.')
  if (!form.model.trim()) errors.push('مدل دستگاه را وارد کنید.')
  if (needsBattery && !/^\d{1,3}$/.test(toEn(form.battery))) errors.push('سلامت باتری را به‌صورت عدد (۰ تا ۱۰۰) وارد کنید.')
  if (containsContact(form.notes) || containsContact(form.model)) {
    errors.push('در توضیحات، شماره تلفن یا آیدی شبکه‌های اجتماعی مجاز نیست. ارتباط فقط از طریق موبایل کارکرده انجام می‌شود.')
  }
  const missing = slots.filter((s) => s.required && !hasPhoto(s.id))
  if (missing.length) errors.push(`عکس‌های اجباری باقی‌مانده: ${missing.map((s) => s.label).join('، ')}`)
  if (needsBattery && !form.unlocked) errors.push('باید تأیید کنید که قفل حساب (iCloud / Google / Samsung) دستگاه خاموش است.')

  return errors
}
