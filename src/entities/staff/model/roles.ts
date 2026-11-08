export type Role = 'admin' | 'inspector' | 'partner'

export interface Inspector {
  phone: string
  name: string
  addedAt: number
}

/** Pure: admins come from config, inspectors from the list an admin maintains, everyone else is a partner. */
export function roleOf(phone: string | null, adminPhones: readonly string[], inspectors: readonly Inspector[]): Role | null {
  if (!phone) return null
  if (adminPhones.includes(phone)) return 'admin'
  if (inspectors.some((i) => i.phone === phone)) return 'inspector'
  return 'partner'
}
