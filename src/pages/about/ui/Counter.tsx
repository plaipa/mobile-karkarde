import { useEffect, useState } from 'react'
import { count } from '@/shared/lib/format'
import { useInView } from '@/shared/lib/use-in-view'
import './about.css'

const DURATION_MS = 1200

/** Counts up from 0 the first time it scrolls into view (instantly if the user prefers reduced motion). */
export function Counter({ to, suffix = '', label }: { to: number; suffix?: string; label: string }) {
  const [ref, seen] = useInView<HTMLDivElement>()
  const [animated, setAnimated] = useState(0)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!seen || reduceMotion) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / DURATION_MS, 1)
      setAnimated(Math.round(to * (1 - (1 - progress) ** 3))) // ease-out cubic
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, reduceMotion, to])
  const value = reduceMotion ? (seen ? to : 0) : animated

  return (
    <div ref={ref} className="counter">
      <b>{count(value)}{suffix}</b>
      <span>{label}</span>
    </div>
  )
}
