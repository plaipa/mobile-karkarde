import { Link } from 'react-router-dom'
import { telegramLink, whatsappLink } from '@/shared/config/support'
import { paths } from '@/shared/config/routes'
import type { LegalDoc } from '../model/content'
import './legal.css'

interface Props {
  doc: LegalDoc
  /** The sibling document, offered at the end ("also read…"). */
  other: { to: string; label: string }
}

/** A readable long-form page: one column at reading width, numbered sections so people can quote them to support. */
export function LegalPage({ doc, other }: Props) {
  return (
    <div className="container page legal">
      <nav className="crumbs" aria-label="مسیر"><Link to={paths.home}>خانه</Link> / {doc.title}</nav>
      <h1 className="page__title">{doc.title}</h1>
      <p className="legal__lead">{doc.lead}</p>
      <p className="legal__date">آخرین به‌روزرسانی: {doc.updated}</p>

      {doc.sections.map((s, i) => (
        <section key={s.title} className="legal__section" aria-labelledby={`l${i}`}>
          <h2 id={`l${i}`}><span className="legal__n">{(i + 1).toLocaleString('fa-IR')}.</span> {s.title}</h2>
          {s.text?.map((p) => <p key={p}>{p}</p>)}
          {s.items && <ul>{s.items.map((it) => <li key={it}>{it}</li>)}</ul>}
        </section>
      ))}

      <aside className="legal__foot">
        <p>سؤالی دارید یا چیزی روشن نیست؟ همین‌جا با ما حرف بزنید.</p>
        <div className="btn-row">
          <a className="btn btn--outline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">واتساپ</a>
          <a className="btn btn--outline" href={telegramLink()} target="_blank" rel="noopener noreferrer">تلگرام</a>
          <Link className="btn btn--outline" to={other.to}>{other.label}</Link>
        </div>
      </aside>
    </div>
  )
}
