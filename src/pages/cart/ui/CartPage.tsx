import { Link } from 'react-router-dom'
import { formatProductCode } from '@/entities/product'
import { useSession } from '@/entities/session'
import { useCart, useCartItems } from '@/features/cart'
import { paths } from '@/shared/config/routes'
import { money, toFa } from '@/shared/lib/format'
import './cart.css'

export function CartPage() {
  const cart = useCart()
  const { items, total } = useCartItems()
  const { phone } = useSession()
  return (
    <div className="container page">
      <h1 className="page__title">سبد خرید</h1>
      {items.length === 0 ? (
        <p className="empty">سبد شما خالی است. <Link to={paths.catalog}>مشاهدهٔ لیست قیمت</Link></p>
      ) : (
        <div className="cart">
          <ul className="cart__list">
            {items.map((p) => (
              <li key={p.code}>
                <div>
                  <Link to={paths.product(p.code)}><strong>{p.name}</strong></Link>
                  <small>کد {formatProductCode(p.code)} · گرید {p.grade}</small>
                </div>
                <span>{phone ? money(p.price) : '—'}</span>
                <button className="btn btn--outline btn--sm" onClick={() => cart.remove(p.code)}>حذف</button>
              </li>
            ))}
          </ul>
          <div className="panel cart__sum">
            <p>تعداد: <b>{toFa(items.length)}</b></p>
            <p>جمع کل: <b>{phone ? money(total) : 'بعد از ورود'}</b></p>
            <p className="muted small">سفارش شما برای هماهنگی نهایی (موجودی، پرداخت و ارسال) به کارشناس ما ارسال می‌شود. مشخصات فروشنده نمایش داده نمی‌شود.</p>
            {phone ? (
              // TODO(backend): replace with a real order request.
              <button className="btn btn--primary btn--lg btn--block" onClick={() => { alert('نمونهٔ نمایشی: سفارش ثبت نشد چون هنوز سروری متصل نیست.') }}>ثبت سفارش</button>
            ) : (
              <Link to={paths.login} className="btn btn--primary btn--lg btn--block">ورود برای ثبت سفارش</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
