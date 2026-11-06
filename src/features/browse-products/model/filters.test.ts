import { describe, expect, it } from 'vitest'
import { productRepository } from '@/entities/product'
import { activeFilterCount, applyFilters, buildFacets, defaultFilters, toggle } from './filters'

const phones = productRepository.listByCategory('phone')
const codes = (list: readonly { code: string }[]) => list.map((p) => p.code)

describe('applyFilters', () => {
  it('returns everything, most expensive first, with default filters', () => {
    const out = applyFilters(phones, defaultFilters)
    expect(out).toHaveLength(phones.length)
    const prices = out.map((p) => p.price)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  it('does not mutate its input', () => {
    const before = codes(phones)
    applyFilters(phones, { ...defaultFilters, sort: 'asc' })
    expect(codes(phones)).toEqual(before)
  })

  it('filters by model, e.g. only iPhone 17 Pro Max', () => {
    const out = applyFilters(phones, { ...defaultFilters, models: ['آیفون ۱۷ پرو مکس'] })
    expect(out.length).toBeGreaterThan(1)
    expect(out.every((p) => p.name === 'آیفون ۱۷ پرو مکس')).toBe(true)
  })

  it('combines several models of the same family', () => {
    const models = ['آیفون ۱۷ پرو', 'آیفون ۱۶ پرو']
    const out = applyFilters(phones, { ...defaultFilters, models })
    expect(out.every((p) => models.includes(p.name))).toBe(true)
    expect(new Set(out.map((p) => p.name))).toEqual(new Set(models))
  })

  it('filters by region code, storage and sim together', () => {
    const out = applyFilters(phones, { ...defaultFilters, regions: ['ZA', 'CH'], storages: [256], sims: ['dual'] })
    expect(out.length).toBeGreaterThan(0)
    expect(out.every((p) => (p.region === 'ZA' || p.region === 'CH') && p.storageGb === 256 && p.sim === 'dual')).toBe(true)
  })

  it('leaves out devices without a region when a region is selected', () => {
    const out = applyFilters(phones, { ...defaultFilters, regions: ['CH'] })
    expect(out.every((p) => p.region === 'CH')).toBe(true)
  })

  it('filters by brand and grade together', () => {
    const out = applyFilters(phones, { ...defaultFilters, brands: ['اپل'], grades: ['A'] })
    expect(out.length).toBeGreaterThan(0)
    expect(out.every((p) => p.brand === 'اپل' && p.grade === 'A')).toBe(true)
  })

  it('applies the minimum battery health', () => {
    const out = applyFilters(phones, { ...defaultFilters, minBattery: 92 })
    expect(out.every((p) => (p.battery ?? 100) >= 92)).toBe(true)
  })

  it('applies price bounds inclusively', () => {
    const out = applyFilters(phones, { ...defaultFilters, minPrice: 40_000_000, maxPrice: 60_000_000 })
    expect(out.length).toBeGreaterThan(0)
    expect(out.every((p) => p.price >= 40_000_000 && p.price <= 60_000_000)).toBe(true)
  })

  it('sorts by price in both directions', () => {
    const asc = applyFilters(phones, { ...defaultFilters, sort: 'asc' }).map((p) => p.price)
    const desc = applyFilters(phones, { ...defaultFilters, sort: 'desc' }).map((p) => p.price)
    expect(asc).toEqual([...asc].sort((a, b) => a - b))
    expect(desc).toEqual([...asc].reverse())
  })

  it('searches model name and listing code (case-insensitive)', () => {
    expect(codes(applyFilters(phones, { ...defaultFilters, query: 'mk-2126' }))).toEqual(['MK-2126'])
    expect(applyFilters(phones, { ...defaultFilters, query: 'پیکسل ۸' })).toHaveLength(1)
    expect(applyFilters(phones, { ...defaultFilters, query: 'nothing-matches' })).toEqual([])
  })
})

describe('buildFacets', () => {
  it('counts devices per option and orders models by their best price', () => {
    const { models } = buildFacets(phones, [])
    expect(models[0].value).toBe('آیفون ۱۷ پرو مکس')
    expect(models.reduce((sum, m) => sum + m.count, 0)).toBe(phones.length)
  })

  it('limits models to the selected brands', () => {
    const { models } = buildFacets(phones, ['گوگل'])
    expect(models.map((m) => m.value).sort()).toEqual(['گوگل پیکسل ۸', 'گوگل پیکسل ۹ پرو'])
  })

  it('lists storages ascending and only the regions that exist', () => {
    const { storages, regions } = buildFacets(phones, [])
    expect(storages.map((s) => s.value)).toEqual([...storages.map((s) => s.value)].sort((a, b) => a - b))
    expect(regions.map((r) => r.value)).toContain('ZA')
    expect(regions.map((r) => r.value)).not.toContain('TU')
  })
})

describe('activeFilterCount', () => {
  it('counts narrowing groups, not the sort or the search text', () => {
    expect(activeFilterCount(defaultFilters)).toBe(0)
    expect(activeFilterCount({ ...defaultFilters, query: 'x', sort: 'asc', regions: ['ZA'], minPrice: 1, registered: true })).toBe(3)
  })
})

describe('toggle', () => {
  it('adds a missing value and removes a present one without mutating', () => {
    const list = ['a']
    expect(toggle(list, 'b')).toEqual(['a', 'b'])
    expect(toggle(list, 'a')).toEqual([])
    expect(list).toEqual(['a'])
  })
})

describe('city filter', () => {
  it('keeps only devices in the chosen city', () => {
    const city = phones[0].city
    expect(applyFilters(phones, { ...defaultFilters, cities: [city] })).toHaveLength(phones.length)
    expect(applyFilters(phones, { ...defaultFilters, cities: ['شهر دیگر'] })).toHaveLength(0)
  })
})
