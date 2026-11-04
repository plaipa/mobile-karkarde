import { describe, expect, it } from 'vitest'
import { isValidMobile, isValidOtp, normalizeMobile } from './validation'

describe('mobile number', () => {
  it('normalizes Persian digits and whitespace', () => {
    expect(normalizeMobile('۰۹۱۲ ۳۴۵ ۶۷۸۹')).toBe('09123456789')
  })

  it.each([['09123456789', true], ['9123456789', false], ['0912345678', false], ['08123456789', false], ['0912345678a', false]])(
    '%s -> %s',
    (value, expected) => expect(isValidMobile(value)).toBe(expected),
  )
})

describe('otp', () => {
  it.each([['1234', true], ['۱۲۳۴۵۶', true], ['123', false], ['1234567', false], ['12a45', false]])('%s -> %s', (value, expected) =>
    expect(isValidOtp(value)).toBe(expected),
  )
})
