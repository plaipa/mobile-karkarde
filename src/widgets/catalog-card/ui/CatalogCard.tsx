import { ProductCard, type Product } from '@/entities/product'
import { AddToCartButton } from '@/features/cart'
import { PriceTag } from '@/features/price-visibility'

/** A product card wired with the partner price and the add-to-cart action. */
export function CatalogCard({ product }: { product: Product }) {
  return (
    <ProductCard
      product={product}
      price={<PriceTag price={product.price} />}
      action={<AddToCartButton code={product.code} className="btn btn--dark btn--block" />}
    />
  )
}
