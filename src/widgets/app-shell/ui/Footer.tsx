import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__row">
        <span>© ۱۴۰۵ موبایل کارکرده — همهٔ حقوق محفوظ است</span>
        <span><Link to={paths.about}>دربارهٔ ما</Link> · شرایط استفاده · حریم خصوصی</span>
      </div>
    </footer>
  )
}
