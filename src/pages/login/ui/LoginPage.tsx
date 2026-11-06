import { useSession } from '@/entities/session'
import { PartnerPanel, PhoneLoginForm, PanelMenu } from '@/features/auth-by-phone'
import { paths } from '@/shared/config/routes'

/** The «پنل» tab: the partner hub when signed in, the sign-in form otherwise (with «دربارهٔ ما» always one tap away). */
export function LoginPage() {
  const { phone } = useSession()
  return (
    <div className="container page narrow">
      <div className="panel">{phone ? <PartnerPanel /> : <PhoneLoginForm />}</div>
      {!phone && (
        <PanelMenu
          items={[
            { to: paths.about, label: 'دربارهٔ ما' },
            { to: paths.install, label: 'نصب برنامه روی گوشی' },
          ]}
        />
      )}
    </div>
  )
}
