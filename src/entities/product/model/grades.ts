import type { Grade } from './types'

export const grades: readonly Grade[] = ['A', 'B', 'C']

export const gradeInfo: Record<Grade, string> = {
  A: 'سالم و تمیز، بدون خط‌وخش قابل توجه',
  B: 'خط‌وخش جزئی یا ضربهٔ کوچک روی بدنه',
  C: 'علائم استفادهٔ بیشتر، کاملاً سالم از نظر عملکرد',
}
