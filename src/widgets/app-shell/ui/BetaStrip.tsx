import { Link } from 'react-router-dom'
import { beta } from '@/shared/config/beta'
import { paths } from '@/shared/config/routes'

/** A thin strip on every page while the site is in test-flight mode. */
export function BetaStrip() {
  if (!beta.enabled) return null
  return (
    <div className="betastrip" role="note">
      <span>{beta.label} · {beta.build}</span>
      <Link to={paths.beta}>راهنمای تست و ارسال بازخورد</Link>
    </div>
  )
}
