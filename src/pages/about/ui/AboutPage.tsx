import { AboutHero } from './AboutHero'
import { AnonymityDiagram, CounterStrip, InspectionChecklist, JoinCta, Journey } from './Sections'

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <CounterStrip />
      <Journey />
      <InspectionChecklist />
      <AnonymityDiagram />
      <JoinCta />
    </>
  )
}
