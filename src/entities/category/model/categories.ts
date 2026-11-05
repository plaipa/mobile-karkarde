import type { Category, CategoryId } from './types'

export const categories: readonly Category[] = [
  { id: 'phone', title: 'موبایل', count: 1100, brands: ['اپل', 'سامسونگ', 'شیائومی', 'هواوی', 'آنر', 'گوگل'], tone: 'var(--primary)' },
  { id: 'watch', title: 'ساعت هوشمند', count: 60, brands: ['اپل', 'سامسونگ', 'هواوی', 'شیائومی', 'گارمین'], tone: 'var(--ink-3)' },
  { id: 'speaker', title: 'اسپیکر', count: 40, brands: ['جی‌بی‌ال', 'سونی', 'بوز', 'مارشال', 'هارمن', 'انکر'], tone: '#FFA37A' },
]

export const defaultCategory = categories[0]

/** Looks a category up; unknown ids (e.g. from a hand-edited URL) fall back to `fallback`. */
export function findCategory(id: string | null | undefined, fallback: Category = defaultCategory): Category {
  return categories.find((c) => c.id === id) ?? fallback
}

export const isCategoryId = (id: string): id is CategoryId => categories.some((c) => c.id === id)
