/** Where the service runs. Add a city here when it launches; every page reads this list. */
export interface ServiceCity {
  name: string
  active: boolean
}

export const serviceCities: readonly ServiceCity[] = [{ name: 'تبریز', active: true }]

export const activeCities = serviceCities.filter((c) => c.active).map((c) => c.name)

/** Short line for chips and footers, e.g. «فعال در تبریز». */
export const serviceAreaLabel = `فعال در ${activeCities.join('، ')}`
