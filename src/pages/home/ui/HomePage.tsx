import { CategoryList } from './CategoryList'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { LatestProducts } from './LatestProducts'

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryList />
      <LatestProducts />
      <HowItWorks />
    </>
  )
}
