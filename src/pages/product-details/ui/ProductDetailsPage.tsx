import { Link, useParams } from 'react-router-dom'
import { findCategory } from '@/entities/category'
import { productRepository, useCatalogVersion } from '@/entities/product'
import { paths } from '@/shared/config/routes'
import { CatalogCard } from '@/widgets/catalog-card'
import { Gallery } from './Gallery'
import { InspectionReport } from './InspectionReport'
import { ProductInfo } from './ProductInfo'

export function ProductDetailsPage() {
  const { code } = useParams()
  useCatalogVersion()
  const product = productRepository.findByCode(code)

  if (!product) {
    return <div className="container page"><p className="empty">این دستگاه پیدا نشد. <Link to={paths.catalog}>بازگشت به لیست قیمت</Link></p></div>
  }

  const category = findCategory(product.category)
  return (
    <div className="container page">
      <p className="crumbs"><Link to={paths.home}>خانه</Link> / <Link to={paths.catalogOf(product.category)}>{category.title}</Link> / {product.name}</p>
      <div className="pdp">
        <Gallery product={product} />
        <ProductInfo product={product} />
      </div>
      <InspectionReport product={product} />
      <section className="section">
        <h2>دستگاه‌های مشابه</h2>
        <div className="grid">{productRepository.listSimilar(product).map((p) => <CatalogCard key={p.code} product={p} />)}</div>
      </section>
    </div>
  )
}
