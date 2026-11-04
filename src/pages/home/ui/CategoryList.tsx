import { Link } from 'react-router-dom'
import { categories, DeviceArt } from '@/entities/category'
import { paths } from '@/shared/config/routes'
import { count } from '@/shared/lib/format'
import './home.css'

export function CategoryList() {
  return (
    <section className="section container">
      <h2>دسته‌بندی‌ها</h2>
      <div className="cats">
        {categories.map((c) => (
          <Link key={c.id} to={paths.catalogOf(c.id)} className="cat">
            <DeviceArt kind={c.id} tone={c.tone} w={c.id === 'phone' ? 46 : 54} h={c.id === 'phone' ? 90 : 86} />
            <div>
              <strong>{c.title}</strong>
              <span className="cat__count">{count(c.count)} دستگاه</span>
              <small>{c.brands.join(' · ')}</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
