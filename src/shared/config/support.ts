/**
 * Support channels shown in the floating help button.
 * TODO(config): replace the placeholders with the real WhatsApp number (international format, no "+")
 * and the real Telegram username (no "@").
 */
export const support = {
  whatsappNumber: '989000000000',
  telegramUsername: 'mobilekarkarde_support',
  greeting: 'سلام، از سایت موبایل کارکرده پیام می‌دهم. به راهنمایی نیاز دارم.',
} as const

export const whatsappLink = (text: string = support.greeting) =>
  `https://wa.me/${support.whatsappNumber}?text=${encodeURIComponent(text)}`

export const telegramLink = () => `https://t.me/${support.telegramUsername}`
