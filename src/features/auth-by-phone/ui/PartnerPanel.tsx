import { useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'

/** Shown instead of the form when the partner is already signed in. */
export function PartnerPanel() {
  const { phone, signOut } = useSession()
  const navigate = useNavigate()
  return (
    <>
      <h1 className="page__title">پنل همکار</h1>
      <p>وارد شده‌اید با شمارهٔ <b dir="ltr">{toFa(phone ?? '')}</b></p>
      <div className="btn-row">
        <button className="btn btn--primary" onClick={() => navigate(paths.sell)}>ثبت دستگاه برای فروش</button>
        <button className="btn btn--outline" onClick={() => { signOut(); navigate(paths.home) }}>خروج</button>
      </div>
    </>
  )
}
