import type { Grade } from './types'

/** Best condition first. */
export const grades: readonly Grade[] = ['A', 'B', 'C', 'D']

/** The name people see. The letters are only internal codes. */
export const gradeLabel: Record<Grade, string> = {
  A: 'درحد',
  B: 'تمیز',
  C: 'معمولی',
  D: 'پرکار',
}

export const gradeInfo: Record<Grade, string> = {
  A: 'در حد نو؛ بدون خط‌وخش قابل دید',
  B: 'خط‌وخش بسیار جزئی، فقط از نزدیک دیده می‌شود',
  C: 'خط‌وخش و آثار استفادهٔ معمول روی بدنه',
  D: 'آثار استفادهٔ زیاد یا ضربه روی بدنه؛ عملکرد سالم',
}
