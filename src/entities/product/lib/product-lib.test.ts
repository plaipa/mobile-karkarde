import { describe, expect, it } from 'vitest'
import { productRepository } from '../api/product-repository'
import { buildInspectionReport, buildSpecRows, summarizeSpecs } from './describe'
import { formatProductCode } from './product-code'

const iphone = productRepository.findByCode('MK-2126')!
const speaker = productRepository.findByCode('MK-2070')!

describe('formatProductCode', () => {
  it('localizes digits but keeps the prefix', () => {
    expect(formatProductCode('MK-2041')).toBe('MK-۲۰۴۱')
  })
})

describe('buildSpecRows', () => {
  it('shows storage, battery, registry and account lock for phones', () => {
    const labels = buildSpecRows(iphone).map(([label]) => label)
    expect(labels).toEqual(['برند', 'رنگ', 'حافظه', 'سلامت باتری', 'رجیستری', 'گارانتی', 'قفل حساب'])
  })

  it('has no account-lock row for speakers', () => {
    expect(buildSpecRows(speaker).map(([label]) => label)).not.toContain('قفل حساب')
  })
})

describe('buildInspectionReport', () => {
  it('flags the body as a warning for non-A grades', () => {
    const grades = new Map(productRepository.list().map((p) => [p.grade, p]))
    const body = (p: typeof iphone) => buildInspectionReport(p).find(([label]) => label === 'بدنه')!
    expect(body(grades.get('A')!)[2]).toBe('ok')
    expect(body(grades.get('B')!)[2]).toBe('warn')
  })
})

describe('summarizeSpecs', () => {
  it('joins the available facts', () => {
    expect(summarizeSpecs(iphone)).toContain('باتری ۸۹٪')
  })
})
