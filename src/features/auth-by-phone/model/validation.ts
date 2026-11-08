import { toEn } from '@/shared/lib/format'

/** Strips spaces and converts Persian digits: "۰۹۱۲ ۳۴۵ ۶۷۸۹" -> "09123456789". */
export const normalizeMobile = (input: string) => toEn(input).replace(/\s/g, '')

export const isValidMobile = (normalized: string) => /^09\d{9}$/.test(normalized)

/** SMS-style code (4–6 digits) or a staff login code (letters and digits, up to 32). */
export const isValidOtp = (input: string) => /^[A-Za-z0-9]{4,32}$/.test(toEn(input).trim())

export const isValidEmail = (input: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.trim())
