import { Link, useNavigate } from 'react-router-dom'
import { useAllListings, useMyListings, statusOf } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { useRole } from '@/entities/staff'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { PanelMenu } from './PanelMenu'

/** The panel hub when signed in: who you are, then the places a partner needs. */
export function PartnerPanel() {
  const { phone, signOut } = useSession()
  const navigate = useNavigate()
  const devices = useMyListings(phone)
  const role = useRole(phone)
  const waiting = useAllListings().filter((l) => statusOf(l) === 'pending').length
  return (
    <>
      <h1 className="page__title">{role === 'admin' ? 'پنل مدیر' : role === 'inspector' ? 'پنل کارشناس' : 'پنل همکار'}</h1>
      <p className="muted">وارد شده‌اید با شمارهٔ <b dir="ltr">{toFa(phone ?? '')}</b></p>
      {role && role !== 'partner' && <p><span className="chip chip--soft">{role === 'admin' ? 'مدیر سایت' : 'کارشناس'}</span></p>}
      <PanelMenu
        items={[
          ...(role === 'admin' ? [{ to: paths.admin, label: 'پنل ادمین', hint: 'تعیین کارشناس و نمای کلی دستگاه‌ها' }] : []),
          ...(role === 'admin' || role === 'inspector' ? [{ to: paths.inspector, label: 'پنل کارشناس', hint: 'تأیید یا رد دستگاه‌های ثبت‌شده', badge: waiting || undefined }] : []),
          { to: paths.devices, label: 'دستگاه‌های من', hint: 'دستگاه‌هایی که ثبت کرده‌اید', badge: devices.length || undefined },
          { to: paths.sell, label: 'ثبت دستگاه برای فروش' },
          { to: paths.account, label: 'تنظیمات حساب', hint: 'شهر پیش‌فرض، اندازهٔ نوشته، خروج' },
          { to: paths.about, label: 'دربارهٔ ما' },
          { to: paths.install, label: 'نصب برنامه روی گوشی' },
        ]}
      />
      <div className="btn-row">
        <button className="btn btn--outline" onClick={() => { signOut(); navigate(paths.home) }}>خروج</button>
        <Link to={paths.catalog} className="btn btn--primary">لیست قیمت</Link>
      </div>
    </>
  )
}
