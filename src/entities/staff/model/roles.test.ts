import { describe, expect, it } from 'vitest'
import { roleOf, type Inspector } from './roles'

const inspectors: Inspector[] = [{ phone: '09111111111', name: 'علی', addedAt: 1 }]
const admins = ['09120000000']

describe('roleOf', () => {
  it('is null when signed out', () => expect(roleOf(null, admins, inspectors)).toBeNull())
  it('recognises an admin', () => expect(roleOf('09120000000', admins, inspectors)).toBe('admin'))
  it('recognises an inspector appointed by an admin', () => expect(roleOf('09111111111', admins, inspectors)).toBe('inspector'))
  it('treats everyone else as a partner', () => expect(roleOf('09135555555', admins, inspectors)).toBe('partner'))
  it('keeps the admin role even if the number is also listed as inspector', () => {
    expect(roleOf('09120000000', admins, [{ phone: '09120000000', name: 'x', addedAt: 1 }])).toBe('admin')
  })
})
