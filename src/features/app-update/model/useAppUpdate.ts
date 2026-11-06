import { useRegisterSW } from 'virtual:pwa-register/react'

/** How often an app that stays open checks for a new deploy. */
const CHECK_EVERY_MS = 30 * 60 * 1000

/**
 * Registers the service worker and reports when a new version has been downloaded.
 * Installed apps often stay open for days, so we also check on an interval and whenever
 * the app comes back to the foreground.
 */
export function useAppUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      if (!registration) return
      const check = () => {
        if (navigator.onLine && document.visibilityState === 'visible') registration.update().catch(() => {})
      }
      setInterval(check, CHECK_EVERY_MS)
      document.addEventListener('visibilitychange', check)
    },
  })

  return {
    available: needRefresh,
    /** Activates the new version and reloads the app. */
    apply: () => {
      void updateServiceWorker(true)
      // Safety net: if the switch-over signal never arrives, reload anyway (the new worker serves it).
      setTimeout(() => window.location.reload(), 3000)
    },
    dismiss: () => setNeedRefresh(false),
  }
}
