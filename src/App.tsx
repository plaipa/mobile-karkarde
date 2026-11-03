import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { CartProvider } from './lib/cart'
import { Layout } from './components/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductPage from './pages/Product'
import About from './pages/About'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Cart from './pages/Cart'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="product/:code" element={<ProductPage />} />
              <Route path="about" element={<About />} />
              <Route path="upload" element={<Upload />} />
              <Route path="login" element={<Login />} />
              <Route path="cart" element={<Cart />} />
              <Route path="*" element={<div className="container page"><p className="empty">صفحه پیدا نشد.</p></div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
