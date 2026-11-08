/**
 * Support channels shown in the floating help button.
 * WhatsApp number is real (international format, no "+"); TODO(config): replace the Telegram placeholder
 * with the real Telegram username (no "@").
 */
export const support = {
  whatsappNumber: '989374273008',
  telegramUsername: 'mobilekarkarde_support',
  greeting: 'سلام، از سایت موبایل کارکرده پیام می‌دهم. به راهنمایی نیاز دارم.',
} as const

export const whatsappLink = (text: string = support.greeting) =>
  `https://wa.me/${support.whatsappNumber}?text=${encodeURIComponent(text)}`

export const telegramLink = () => `https://t.me/${support.telegramUsername}`
