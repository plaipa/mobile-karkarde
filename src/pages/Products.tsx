import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, products, type CategoryId, type Grade } from '../data'
import { count, money, toFa } from '../lib/format'
import { useAuth } from '../lib/auth'
import { ProductCard, PriceTag } from '../components/ProductCard'
import { Link } from 'react-router-dom'

type Sort = 'new' | 'asc' | 'desc'

function toggle<T>(list: T[], v: T) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v]
}

export default function Products() {
  const [params, setParams] = useSearchParams()
  const { phone } = useAuth()
  const cat = (params.get('cat') as CategoryId | null) ?? 'phone'
  const category = categories.find((c) => c.id === cat) ?? categories[0]
  const [brands, setBrands] = useState<string[]>([])
  const [grades, setGrades] = useState<Grade[]>([])
  const [minBattery, setMinBattery] = useState(0)
  const [registered, setRegistered] = useState(false)
  const [warranty, setWarranty] = useState(false)
  const [sort, setSort] = useState<Sort>('new')
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const list = useMemo(() => {
    const out = products.filter(
      (p) =>
        p.category === category.id &&
        (!brands.length || brands.includes(p.brand)) &&
        (!grades.length || grades.includes(p.grade)) &&
        (p.battery ?? 100) >= minBattery &&
        (!registered || p.registered) &&
        (!warranty || p.warranty) &&
        (!q || p.name.includes(q) || p.code.toLowerCase().includes(q.toLowerCase())),
    )
    return out.sort((a, b) => (sort === 'new' ? a.addedDays - b.addedDays : sort === 'asc' ? a.price - b.price : b.price - a.price))
  }, [category.id, brands, grades, minBattery, registered, warranty, sort, q])

  const reset = () => { setBrands([]); setGrades([]); setMinBattery(0); setRegistered(false); setWarranty(false); setQ('') }

  const filters = (
    <aside className={`filters${open ? ' is-open' : ''}`}>
      <div className="filters__head">
        <strong>فیلترها</strong>
        <button className="btn btn--outline btn--sm filters__close" onClick={() => setOpen(false)}>بستن</button>
      </div>
      <div className="fgroup">
        <h4>برند</h4>
        {category.brands.map((b) => (
          <label key={b} className="check"><input type="checkbox" checked={brands.includes(b)} onChange={() => setBrands(toggle(brands, b))} />{b}</label>
        ))}
      </div>
      <div className="fgroup">
        <h4>گرید ظاهری</h4>
        <div className="chips">
          {(['A', 'B', 'C'] as Grade[]).map((g) => (
            <button key={g} className={`pick${grades.includes(g) ? ' is-on' : ''}`} onClick={() => setGrades(toggle(grades, g))}>گرید {g}</button>
          ))}
        </div>
      </div>
      <div className="fgroup">
        <h4>سلامت باتری (حداقل): <b>{toFa(minBattery)}٪</b></h4>
        <input type="range" min={0} max={95} step={5} value={minBattery} onChange={(e) => setMinBattery(+e.target.value)} />
      </div>
      <div className="fgroup">
        <label className="switch"><input type="checkbox" checked={registered} onChange={(e) => setRegistered(e.target.checked)} /><i />رجیستر شده</label>
        <label className="switch"><input type="checkbox" checked={warranty} onChange={(e) => setWarranty(e.target.checked)} /><i />دارای گارانتی</label>
      </div>
      <div className="filters__foot">
        <button className="btn btn--outline" onClick={reset}>پاک کردن</button>
        <button className="btn btn--primary" onClick={() => setOpen(false)}>نمایش {toFa(list.length)} مورد</button>
      </div>
    </aside>
  )

  return (
    <div className="container page">
      <p className="crumbs">خانه / محصولات / {category.title}</p>
      <div className="tabs" role="tablist">
        {categories.map((c) => (
          <button key={c.id} role="tab" aria-selected={c.id === cat} className={`tab${c.id === cat ? ' is-on' : ''}`} onClick={() => { setParams({ cat: c.id }); reset() }}>{c.title}</button>
        ))}
      </div>
      <div className="toolbar">
        <div>
          <h1 className="page__title">{category.title}</h1>
          <span className="muted">{count(category.count)} دستگاه · نمایش {toFa(list.length)} نمونه</span>
        </div>
        <div className="toolbar__ctl">
          <input className="input" placeholder="جستجوی مدل یا کد آگهی…" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="مرتب‌سازی">
            <option value="new">جدیدترین</option>
            <option value="asc">ارزان‌ترین</option>
            <option value="desc">گران‌ترین</option>
          </select>
          <div className="seg" role="group" aria-label="نوع نمایش">
            <button className={view === 'cards' ? 'is-on' : ''} onClick={() => setView('cards')}>کارت</button>
            <button className={view === 'table' ? 'is-on' : ''} onClick={() => setView('table')}>جدول</button>
          </div>
          <button className="btn btn--dark filters__open" onClick={() => setOpen(true)}>فیلتر</button>
        </div>
      </div>
      {!phone && <p className="notice">قیمت عمده فقط برای همکاران تأییدشده نمایش داده می‌شود. <Link to="/login">ورود یا ثبت‌نام</Link></p>}
      <div className="layout">
        <div className="layout__main">
          {list.length === 0 ? (
            <p className="empty">دستگاهی با این فیلترها پیدا نشد.</p>
          ) : view === 'cards' ? (
            <div className="grid grid--3">{list.map((p) => <ProductCard key={p.code} p={p} />)}</div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>کد</th><th>مدل</th><th>مشخصات</th><th>باتری</th><th>گرید</th><th>قیمت همکار</th></tr></thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.code}>
                      <td>{`MK-${toFa(p.code.slice(3))}`}</td>
                      <td><Link to={`/product/${p.code}`}>{p.name}</Link></td>
                      <td>{p.storage ?? '—'}</td>
                      <td>{p.battery ? `${toFa(p.battery)}٪` : '—'}</td>
                      <td><span className={`chip chip--${p.grade}`}>{p.grade}</span></td>
                      <td>{phone ? money(p.price) : <PriceTag price={p.price} />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {filters}
      </div>
    </div>
  )
}
