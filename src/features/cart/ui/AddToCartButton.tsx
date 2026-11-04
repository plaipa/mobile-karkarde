import { useCart } from '../model/useCart'

interface Props {
  code: string
  /** Button look, e.g. `btn btn--dark btn--block`. */
  className: string
}

export function AddToCartButton({ code, className }: Props) {
  const cart = useCart()
  const inCart = cart.has(code)
  return (
    <button className={className} onClick={() => cart.add(code)} disabled={inCart}>
      {inCart ? 'در سبد' : 'افزودن'}
    </button>
  )
}
