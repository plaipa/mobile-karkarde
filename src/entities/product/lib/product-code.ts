import { toFa } from '@/shared/lib/format'

/** `MK-2041` -> `MK-۲۰۴۱` (digits localized for display; the stored code stays ASCII). */
export const formatProductCode = (code: string) => `MK-${toFa(code.slice(3))}`
