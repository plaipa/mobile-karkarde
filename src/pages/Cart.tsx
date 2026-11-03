import { Link } from 'react-router-dom'
import { products } from '../data'
import { useAuth } from '../lib/auth'
import { useCart } from '../lib/cart'
import { money, toFa } from '../lib/format'

export default function Cart() {
  const cart = useCart()
  const { phone } = useAuth()
  const items = cart.codes.map((c) => products.find((p) => p.code === c)).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const total = items.reduce((s, p) => s + p.price, 0)
  return (
    <div className="container page">
      <h1 className="page__title">سبد خرید</h1>
      {items.length === 0 ? (
        <p className="empty">سبد شما خالی است. <Link to="/products">مشاهدهٔ محصولات</Link></p>
      ) : (
        <div className="cart">
          <ul className="cart__list">
            {items.map((p) => (
              <li key={p.code}>
                <div><Link to={`/product/${p.code}`}><strong>{p.name}</strong></Link><small>کد MK-{toFa(p.code.slice(3))} · گرید {p.grade}</small></div>
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
              <button className="btn btn--primary btn--lg btn--block" onClick={() => { alert('نمونهٔ نمایشی: سفارش ثبت نشد چون هنوز سروری متصل نیست.') }}>ثبت سفارش</button>
            ) : (
              <Link to="/login" className="btn btn--primary btn--lg btn--block">ورود برای ثبت سفارش</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
