import { describe, expect, it } from 'vitest'
import { containsContact } from './contact-guard'

describe('containsContact', () => {
  it.each([
    ['09123456789', 'plain mobile number'],
    ['۰۹۱۲۳۴۵۶۷۸۹', 'Persian digits'],
    ['0912 345 67 89', 'spaced number'],
    ['زنگ بزن 0912-345-6789', 'number with dashes inside a sentence'],
    ['@seller_shop', 'handle'],
    ['t.me/seller', 'telegram link'],
    ['https://example.com', 'url'],
    ['پیام بده تلگرام', 'persian "telegram"'],
    ['واتساپ دارم', 'persian "whatsapp"'],
  ])('blocks %s (%s)', (text) => {
    expect(containsContact(text)).toBe(true)
  })

  it.each([
    ['گوشی تمیز، بدون خط‌وخش'],
    ['باتری ۹۱ درصد، ۲۵۶ گیگ'],
    ['خرید ۲۰۲۴ با گارانتی ۱۲ ماهه'],
    [''],
  ])('allows %s', (text) => {
    expect(containsContact(text)).toBe(false)
  })
})
