import '@fontsource-variable/kufam'
import { AboutHero } from './AboutHero'
import { Cities, CounterStrip, Grades, Inspection, JoinCta, Journey, Knots, Manifesto, Privacy } from './Sections'

export function AboutPage() {
  return (
    <div className="ab">
      <AboutHero />
      <CounterStrip />
      <Knots />
      <Journey />
      <Inspection />
      <Grades />
      <Privacy />
      <Cities />
      <Manifesto />
      <JoinCta />
    </div>
  )
}
