import { Link } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { ListDeviceFlow } from '@/features/list-device'
import { paths } from '@/shared/config/routes'

/** Only signed-in partners can list devices. */
export function SellPage() {
  const { phone } = useSession()
  if (!phone) {
    return (
      <div className="container page narrow">
        <div className="panel">
          <h1 className="page__title">ثبت دستگاه برای فروش</h1>
          <p>برای ثبت دستگاه ابتدا به‌عنوان همکار وارد شوید.</p>
          <Link to={paths.login} className="btn btn--primary btn--lg">ورود همکار</Link>
        </div>
      </div>
    )
  }
  return <ListDeviceFlow />
}
