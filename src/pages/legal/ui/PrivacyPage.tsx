import { paths } from '@/shared/config/routes'
import { privacy } from '../model/content'
import { LegalPage } from './LegalPage'

export function PrivacyPage() {
  return <LegalPage doc={privacy} other={{ to: paths.terms, label: 'شرایط استفاده' }} />
}
