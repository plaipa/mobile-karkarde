import { Link } from 'react-router-dom'
import { serviceAreaLabel } from '@/shared/config/cities'
import { paths } from '@/shared/config/routes'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <span>© ۱۴۰۵ موبایل کارکرده — {serviceAreaLabel} — همهٔ حقوق محفوظ است</span>
        <span><Link to={paths.about}>دربارهٔ ما</Link> · <Link to={paths.terms}>شرایط استفاده</Link> · <Link to={paths.privacy}>حریم خصوصی</Link></span>
      </div>
    </footer>
  )
}
