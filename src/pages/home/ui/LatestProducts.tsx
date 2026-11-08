import { Link } from 'react-router-dom'
import { productRepository, useCatalogVersion } from '@/entities/product'
import { CatalogCard } from '@/widgets/catalog-card'
import { paths } from '@/shared/config/routes'
import './home.css'

export function LatestProducts() {
  useCatalogVersion()
  const latest = productRepository.listLatest(['phone', 'watch'], 4)
  return (
    <section className="section container">
      <div className="section__head">
        <h2>تازه‌ترین دستگاه‌ها</h2>
        <Link to={paths.catalog} className="link">مشاهدهٔ همه ←</Link>
      </div>
      <div className="grid">{latest.map((p) => <CatalogCard key={p.code} product={p} />)}</div>
    </section>
  )
}
