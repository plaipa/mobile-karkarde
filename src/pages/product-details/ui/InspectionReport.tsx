import { buildInspectionReport, type Product } from '@/entities/product'
import './product-details.css'

export function InspectionReport({ product }: { product: Product }) {
  return (
    <section className="section">
      <h2>گزارش بازرسی</h2>
      <div className="report">
        {buildInspectionReport(product).map(([label, value, status]) => (
          <div key={label} className="report__item">
            <span>{label}</span>
            <span className={`chip chip--${status === 'ok' ? 'A' : 'B'}`}>{value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
