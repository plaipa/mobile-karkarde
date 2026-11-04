import { howItWorks } from '../model/content'
import './home.css'

export function HowItWorks() {
  return (
    <section className="section container">
      <div className="band">
        <h2>چطور کار می‌کند؟</h2>
        <div className="steps">
          {howItWorks.map((s) => (
            <div key={s.n} className="step"><b>{s.n}</b><h3>{s.title}</h3><p>{s.text}</p></div>
          ))}
        </div>
      </div>
    </section>
  )
}
