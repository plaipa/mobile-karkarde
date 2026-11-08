import { useState } from 'react'
import { Link } from 'react-router-dom'
import { gradeLabel } from '@/entities/product'
import { useSession } from '@/entities/session'
import { useCart, useCartItems } from '@/features/cart'
import { paths } from '@/shared/config/routes'
import { telegramLink, whatsappLink } from '@/shared/config/support'
import { money, toFa } from '@/shared/lib/format'
import './cart.css'

export function CartPage() {
  const cart = useCart()
  const { items, total } = useCartItems()
  const { phone, verified } = useSession()
  const [submitted, setSubmitted] = useState(0)

  if (submitted > 0) {
    return (
      <div className="container page narrow">
        <div className="panel done">
          <span className="done__tick" aria-hidden="true">✓</span>
          <h1 className="page__title">خرید شما ثبت شد</h1>
          <p>{toFa(submitted)} دستگاه برای شما رزرو شد. کارشناس ما برای هماهنگی نهایی (موجودی، پرداخت و ارسال) به‌زودی تماس می‌گیرد.</p>
          <p className="notice">نسخهٔ نمایشی: هنوز سروری متصل نیست و سفارش واقعی ثبت نشده است.</p>
          <div className="btn-row">
            <Link to={paths.catalog} className="btn btn--primary btn--lg">بازگشت به لیست قیمت</Link>
            <a href={whatsappLink('سلام، خریدی ثبت کرده‌ام و می‌خواهم پیگیری کنم.')} className="btn btn--outline btn--lg" target="_blank" rel="noopener noreferrer">پیگیری در واتساپ</a>
            <a href={telegramLink()} className="btn btn--outline btn--lg" target="_blank" rel="noopener noreferrer">پیگیری در تلگرام</a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container page">
      <h1 className="page__title">سبد خرید</h1>
      {items.length === 0 ? (
        <div className="panel empty-cart">
          <p>سبد خرید شما خالی است.</p>
          <p className="muted">در لیست قیمت، کنار هر دستگاه روی «خرید» بزنید تا اینجا بیاید.</p>
          <Link to={paths.catalog} className="btn btn--primary btn--lg">رفتن به لیست قیمت</Link>
        </div>
      ) : (
        <div className="cart">
          <ul className="cart__list">
            {items.map((p) => (
              <li key={p.code}>
                <div>
                  <Link to={paths.product(p.code)}><strong>{p.name}</strong></Link>
                  <small>{[p.storage, p.region && `${p.region}/A`, gradeLabel[p.grade]].filter(Boolean).join(' · ')}</small>
                </div>
                <span className="cart__price">{verified ? money(p.price) : '—'}</span>
                <button className="btn btn--outline btn--sm" onClick={() => cart.remove(p.code)} aria-label={`حذف ${p.name}`}>حذف</button>
              </li>
            ))}
          </ul>
          <div className="panel cart__sum">
            <p>تعداد: <b>{toFa(items.length)}</b></p>
            <p className="cart__total">جمع کل: <b>{verified ? money(total) : phone ? 'بعد از تأیید ثبت‌نام' : 'بعد از ورود'}</b></p>
            <p className="muted small">بعد از ثبت خرید، کارشناس ما برای هماهنگی نهایی (موجودی، پرداخت و ارسال) با شما تماس می‌گیرد. مشخصات فروشنده نمایش داده نمی‌شود.</p>
            {verified ? (
              // TODO(backend): send the purchase to the server instead of only clearing the basket.
              <button className="btn btn--primary btn--lg btn--block" onClick={() => { setSubmitted(items.length); cart.clear() }}>ثبت خرید</button>
            ) : (
              <Link to={phone ? paths.apply : paths.login} className="btn btn--primary btn--lg btn--block">{phone ? 'تکمیل ثبت‌نام برای خرید' : 'ورود برای ثبت خرید'}</Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
