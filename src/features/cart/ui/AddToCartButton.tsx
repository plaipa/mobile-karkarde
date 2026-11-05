import { useCart } from '../model/useCart'

interface Props {
  code: string
  /** Button look, e.g. `btn btn--primary btn--sm`. */
  className: string
}

/** "خرید" puts the device in the purchase basket; once it is there the button turns into a green tick. */
export function AddToCartButton({ code, className }: Props) {
  const cart = useCart()
  const inCart = cart.has(code)
  return (
    <button className={`${className}${inCart ? ' is-added' : ''}`} onClick={() => cart.add(code)} disabled={inCart}>
      {inCart ? '✓ در سبد' : 'خرید'}
    </button>
  )
}
