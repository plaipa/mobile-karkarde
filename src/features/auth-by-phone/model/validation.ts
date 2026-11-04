import { toEn } from '@/shared/lib/format'

/** Strips spaces and converts Persian digits: "۰۹۱۲ ۳۴۵ ۶۷۸۹" -> "09123456789". */
export const normalizeMobile = (input: string) => toEn(input).replace(/\s/g, '')

export const isValidMobile = (normalized: string) => /^09\d{9}$/.test(normalized)

export const isValidOtp = (input: string) => /^\d{4,6}$/.test(toEn(input))
