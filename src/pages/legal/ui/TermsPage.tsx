import { paths } from '@/shared/config/routes'
import { terms } from '../model/content'
import { LegalPage } from './LegalPage'

export function TermsPage() {
  return <LegalPage doc={terms} other={{ to: paths.privacy, label: 'حریم خصوصی' }} />
}
