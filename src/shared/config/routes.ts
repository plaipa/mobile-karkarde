/** Single source of truth for URLs. Never hard-code a path string in a component. */
export const paths = {
  home: '/',
  catalog: '/products',
  about: '/about',
  sell: '/upload',
  login: '/login',
  cart: '/cart',
  product: (code: string) => `/product/${code}`,
  catalogOf: (category: string) => `/products?cat=${category}`,
} as const

/** react-router pattern for the product details route (see `paths.product`). */
export const PRODUCT_ROUTE = '/product/:code'

export const SITE_NAME = 'موبایل کارکرده'
