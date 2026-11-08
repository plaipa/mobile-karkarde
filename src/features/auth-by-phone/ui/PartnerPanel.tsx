import { Link, useNavigate } from 'react-router-dom'
import { useApplications } from '@/entities/application'
import { statusOf, useAllListings, useMyListings } from '@/entities/listing'
import { useProfileName } from '@/entities/account'
import { useSession } from '@/entities/session'
import { paths } from '@/shared/config/routes'
import { toFa } from '@/shared/lib/format'
import { PanelMenu } from './PanelMenu'

/** The panel hub when signed in: who you are, then the places a partner needs. */
export function PartnerPanel() {
  const { phone, role, verified, verification, signOut } = useSession()
  const navigate = useNavigate()
  const devices = useMyListings(phone)
  const name = useProfileName(phone)
  const count = (s: 'pending' | 'approved' | 'rejected') => devices.filter((d) => statusOf(d) === s).length
  const isStaff = role === 'admin' || role === 'inspector'
  const pendingApps = useApplications(role === 'admin').filter((a) => a.status === 'pending').length
  const waiting = useAllListings(isStaff ? phone : null).filter((l) => statusOf(l) === 'pending').length
  return (
    <>
      <h1 className="page__title">{role === 'admin' ? 'پنل مدیر' : role === 'inspector' ? 'پنل کارشناس' : 'پنل همکار'}</h1>
      <p className="muted">{name ? <>{name}، </> : null}وارد شده‌اید با شمارهٔ <b dir="ltr">{toFa(phone ?? '')}</b></p>
      {role && role !== 'partner' && <p><span className="chip chip--soft">{role === 'admin' ? 'مدیر سایت' : 'کارشناس'}</span></p>}
      {role === 'partner' && !verified && (
        <p className="notice" role="status">
          {verification === 'pending' ? 'درخواست ثبت‌نام شما در انتظار تأیید ادمین است.' : verification === 'rejected' ? 'درخواست ثبت‌نام شما رد شد؛ دلیل را ببینید و دوباره بفرستید.' : 'برای دیدن قیمت‌ها و ثبت دستگاه، مشخصات مغازه‌تان را ثبت کنید.'}{' '}
          <Link to={paths.apply}>{verification === 'pending' ? 'وضعیت درخواست' : 'ثبت‌نام همکار'}</Link>
        </p>
      )}
      {devices.length > 0 && (
        <p className="panel__summary" aria-label="وضعیت دستگاه‌های من">
          <span className="chip chip--status-pending">{toFa(count('pending'))} در انتظار بازرسی</span>
          <span className="chip chip--status-approved">{toFa(count('approved'))} منتشر شده</span>
          {count('rejected') > 0 && <span className="chip chip--status-rejected">{toFa(count('rejected'))} رد شده</span>}
        </p>
      )}
      <PanelMenu
        items={[
          ...(role === 'admin' ? [{ to: paths.admin, label: 'پنل ادمین', hint: 'آمار، ادمین‌ها، کارشناس‌ها و همکاران' }, { to: paths.applications, label: 'درخواست‌های ثبت‌نام', hint: 'تأیید یا رد همکاران تازه', badge: pendingApps || undefined }] : []),
          ...(role === 'admin' || role === 'inspector' ? [{ to: paths.inspector, label: 'پنل کارشناس', hint: 'بازرسی، قیمت‌گذاری و انتشار دستگاه‌ها', badge: waiting || undefined }] : []),
          ...(verified ? [
          { to: paths.devices, label: 'دستگاه‌های من', hint: 'وضعیت، قیمت منتشرشده و دلیل رد', badge: devices.length || undefined },
          { to: paths.sell, label: 'ثبت دستگاه برای فروش' }] : [{ to: paths.apply, label: 'ثبت‌نام همکار', hint: 'مشخصات مغازه برای تأیید' }]),
          { to: paths.account, label: 'تنظیمات حساب', hint: 'نام، شهر، ایمیل و رمز، تأیید دو مرحله‌ای، خروج' },
          { to: paths.about, label: 'دربارهٔ ما' },
          { to: paths.install, label: 'نصب برنامه روی گوشی' },
        ]}
      />
      <div className="btn-row">
        <button className="btn btn--outline" onClick={() => { void signOut().then(() => navigate(paths.home)) }}>خروج</button>
        <Link to={paths.catalog} className="btn btn--primary">لیست قیمت</Link>
      </div>
    </>
  )
}
