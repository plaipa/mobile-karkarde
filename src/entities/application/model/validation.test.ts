import { describe, expect, it } from 'vitest'
import { emptyApplication, isValidLandline, normalizeLandline, validateApplication, type ApplicationForm } from './validation'

const ok: ApplicationForm = {
  fullName: 'علی رضایی', shopName: 'موبایل رضایی', city: 'تبریز', address: 'خیابان امام، کوچهٔ ۳، پلاک ۱۲', landline: '۰۴۱۳۳۴۴۵۵۶۶', instagram: '',
}

describe('landline', () => {
  it('normalizes Persian digits, spaces and dashes', () => expect(normalizeLandline('۰۴۱-۳۳۴۴ ۵۵۶۶')).toBe('04133445566'))
  it.each([['04133445566', true], ['۰۲۱۸۸۱۲۳۴۵۶', true], ['0413344556', true], ['09123456789', false], ['4133445566', false], ['041334', false]])(
    '%s -> %s', (value, expected) => expect(isValidLandline(value)).toBe(expected),
  )
})

describe('validateApplication', () => {
  it('accepts a complete form', () => expect(validateApplication(ok, true)).toEqual([]))
  it('reports every missing part', () => expect(validateApplication(emptyApplication, false)).toHaveLength(6))
  it('requires the shop front photo', () => expect(validateApplication(ok, false)).toEqual(['عکس سردر مغازه (تابلو و نمای بیرون) لازم است.']))
  it('refuses a mobile number as the landline', () => expect(validateApplication({ ...ok, landline: '09123456789' }, true)).toHaveLength(1))
  it('wants a real address, not a word', () => expect(validateApplication({ ...ok, address: 'تبریز' }, true)).toHaveLength(1))
})
