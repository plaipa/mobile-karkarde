import { Link } from 'react-router-dom'
import { paths, SITE_NAME } from '@/shared/config/routes'

export function Logo({ dark }: { dark?: boolean }) {
  return (
    <Link to={paths.home} className={`logo${dark ? ' logo--dark' : ''}`} aria-label={SITE_NAME}>
      <span className="logo__mark"><i /></span>
      <span className="logo__text">{SITE_NAME}</span>
    </Link>
  )
}
