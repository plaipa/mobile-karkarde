import { useSession } from '@/entities/session'
import { PartnerPanel, PhoneLoginForm } from '@/features/auth-by-phone'

export function LoginPage() {
  const { phone } = useSession()
  return (
    <div className="container page narrow">
      <div className="panel">{phone ? <PartnerPanel /> : <PhoneLoginForm />}</div>
    </div>
  )
}
