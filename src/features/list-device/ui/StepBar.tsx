import './list-device.css'

export type ListingStep = 'info' | 'photos'

const steps: readonly { id: ListingStep; label: string }[] = [
  { id: 'info', label: 'مشخصات دستگاه' },
  { id: 'photos', label: 'عکس‌ها' },
]

/** "Step 1 of 2" strip so the partner always knows how much is left. */
export function StepBar({ step }: { step: ListingStep }) {
  const current = steps.findIndex((s) => s.id === step)
  return (
    <ol className="steps2" aria-label="مراحل ثبت">
      {steps.map((s, i) => (
        <li key={s.id} className={i === current ? 'is-on' : i < current ? 'is-done' : ''} aria-current={i === current ? 'step' : undefined}>
          <span>{i < current ? '✓' : ['۱', '۲'][i]}</span>
          {s.label}
        </li>
      ))}
    </ol>
  )
}
