import { toFa } from '@/shared/lib/format'
import type { Product } from '../model/types'

export type SpecRow = readonly [label: string, value: string]
export type ReportStatus = 'ok' | 'warn'
export type ReportRow = readonly [label: string, value: string, status: ReportStatus]

/** One-line summary under the product name on cards. */
export function summarizeSpecs(p: Product): string {
  const parts = [p.storage, p.battery ? `باتری ${toFa(p.battery)}٪` : null, p.registered ? 'رجیستر شده' : p.warranty ? 'گارانتی دارد' : null]
  return parts.filter(Boolean).join(' · ')
}

/** The "specs" table on the product details page. */
export function buildSpecRows(p: Product): SpecRow[] {
  const rows: SpecRow[] = [
    ['برند', p.brand],
    ['رنگ', p.color],
  ]
  if (p.storage) rows.push([p.category === 'watch' ? 'اندازه' : 'حافظه', p.storage])
  if (p.battery) rows.push(['سلامت باتری', `${toFa(p.battery)}٪`])
  rows.push(['رجیستری', p.category === 'phone' ? (p.registered ? 'انجام شده' : 'انجام نشده') : 'ندارد'])
  rows.push(['گارانتی', p.warranty ? '۳ ماه گارانتی موبایل کارکرده' : 'ندارد'])
  if (p.category !== 'speaker') rows.push(['قفل حساب', 'خاموش (تأیید شده)'])
  return rows
}

/** The inspection report cards. Demo values until real inspection results are stored per device. */
export function buildInspectionReport(p: Product): ReportRow[] {
  return [
    ['نمایشگر و لمس', 'سالم', 'ok'],
    ['باتری', p.battery ? `${toFa(p.battery)}٪ · قابل قبول` : 'سالم', 'ok'],
    ['عملکرد', 'سالم', 'ok'],
    ['بدنه', p.grade === 'A' ? 'بدون عیب قابل توجه' : p.notes, p.grade === 'A' ? 'ok' : 'warn'],
  ]
}
