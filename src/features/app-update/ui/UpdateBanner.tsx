import { useAppUpdate } from '../model/useAppUpdate'
import './app-update.css'

/** Tells people a new version is ready and lets them switch to it in one tap. */
export function UpdateBanner() {
  const { available, apply, dismiss } = useAppUpdate()
  if (!available) return null

  return (
    <div className="update" role="status" aria-live="polite">
      <div className="update__text">
        <strong>نسخهٔ جدید آماده است</strong>
        <small>برای دیدن آخرین تغییرات، اپ را به‌روز کنید.</small>
      </div>
      <div className="update__actions">
        <button type="button" className="btn btn--primary" onClick={apply}>به‌روزرسانی</button>
        <button type="button" className="update__later" onClick={dismiss}>بعداً</button>
      </div>
    </div>
  )
}
