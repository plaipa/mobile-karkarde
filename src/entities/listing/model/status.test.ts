import { describe, expect, it } from 'vitest'
import { statusOf } from './status'
import type { MyListing } from './types'

const base: MyListing = { id: '1', code: 'MK-5001', phone: '09', category: 'phone', brand: '', model: 'x', storage: '', battery: '', color: '', city: '', notes: '', createdAt: 1 }

describe('statusOf', () => {
  it('is pending without a review', () => expect(statusOf(base)).toBe('pending'))
  it('follows the کارشناس decision', () => {
    expect(statusOf({ ...base, review: { status: 'approved', note: '', by: '09', at: 2 } })).toBe('approved')
    expect(statusOf({ ...base, review: { status: 'rejected', note: 'عکس تار', by: '09', at: 2 } })).toBe('rejected')
  })
})
