import { toEn } from '@/shared/lib/format'

export interface ApplicationForm {
  fullName: string
  shopName: string
  city: string
  address: string
  landline: string
  instagram: string
}

export const emptyApplication: ApplicationForm = { fullName: '', shopName: '', city: '', address: '', landline: '', instagram: '' }

/** "۰۴۱-۳۳۴۴ ۵۵۶۶" -> "04133445566". */
export const normalizeLandline = (input: string) => toEn(input).replace(/[\s\-()]/g, '')

/** A landline in Iran: area code + number, 10 or 11 digits starting with 0 (not a mobile number). */
export const isValidLandline = (input: string) => {
  const n = normalizeLandline(input)
  return /^0[0-9]{9,10}$/.test(n) && !/^09/.test(n)
}

/** Pure: the messages to show for a registration form (empty = valid). */
export function validateApplication(form: ApplicationForm, hasFrontPhoto: boolean): string[] {
  const errors: string[] = []
  if (form.fullName.trim().length < 3) errors.push('نام و نام خانوادگی را کامل بنویسید.')
  if (form.shopName.trim().length < 2) errors.push('نام مغازه یا کسب‌وکار را بنویسید.')
  if (!form.city) errors.push('شهر را انتخاب کنید.')
  if (form.address.trim().length < 10) errors.push('نشانی مغازه را کامل بنویسید (خیابان، کوچه، پلاک).')
  if (!isValidLandline(form.landline)) errors.push('شمارهٔ تلفن ثابت مغازه را با کد شهر بنویسید، مثلاً ۰۴۱۳۳۴۴۵۵۶۶.')
  if (!hasFrontPhoto) errors.push('عکس سردر مغازه (تابلو و نمای بیرون) لازم است.')
  return errors
}
