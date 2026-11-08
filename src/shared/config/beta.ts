import { APP_VERSION } from './version'

/** Test-flight mode. Set `enabled` to false when the site goes live: the beta strip and the test guide disappear. */
export const beta = {
  enabled: true,
  label: 'نسخهٔ آزمایشی',
  /** Shown to testers (from package.json): every release has a new number, see CHANGELOG.md. */
  build: `نسخهٔ ${APP_VERSION}`,
} as const
