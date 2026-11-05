import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { PRODUCT_ROUTE, paths } from '@/shared/config/routes'
import { AppShell } from '@/widgets/app-shell'

// One chunk per page: the first visit downloads only what it needs. Add a page = add a line here.
const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })))
const CatalogPage = lazy(() => import('@/pages/catalog').then((m) => ({ default: m.CatalogPage })))
const ProductDetailsPage = lazy(() => import('@/pages/product-details').then((m) => ({ default: m.ProductDetailsPage })))
const AboutPage = lazy(() => import('@/pages/about').then((m) => ({ default: m.AboutPage })))
const SellPage = lazy(() => import('@/pages/sell').then((m) => ({ default: m.SellPage })))
const LoginPage = lazy(() => import('@/pages/login').then((m) => ({ default: m.LoginPage })))
const InstallPage = lazy(() => import('@/pages/install').then((m) => ({ default: m.InstallPage })))
const CartPage = lazy(() => import('@/pages/cart').then((m) => ({ default: m.CartPage })))
const NotFoundPage = lazy(() => import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })))

/** Partners who are signed in go straight to the price list; visitors get the introduction page. */
function Landing() {
  const { phone } = useSession()
  return phone ? <CatalogPage /> : <HomePage />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path={paths.home} element={<Landing />} />
        <Route path={paths.catalog} element={<CatalogPage />} />
        <Route path={PRODUCT_ROUTE} element={<ProductDetailsPage />} />
        <Route path={paths.about} element={<AboutPage />} />
        <Route path={paths.sell} element={<SellPage />} />
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.cart} element={<CartPage />} />
        <Route path={paths.install} element={<InstallPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
