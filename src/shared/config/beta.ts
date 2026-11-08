/** Test-flight mode. Set `enabled` to false when the site goes live: the beta strip and the test guide disappear. */
export const beta = {
  enabled: true,
  label: 'نسخهٔ آزمایشی',
  /** Shown to testers; bump it when you ask them to re-test. */
  build: 'آزمایشی ۱',
} as const
