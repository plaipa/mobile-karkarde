declare const __APP_VERSION__: string | undefined

/** The site's version (from package.json, injected at build time). See CHANGELOG.md. */
export const APP_VERSION: string = typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev'
