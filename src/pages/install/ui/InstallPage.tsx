import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'
import './install.css'

type Platform = 'ios' | 'android'

/** `beforeinstallprompt` is not in lib.dom yet; this is the part we use. */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

const steps: Record<Platform, { title: string; browser: string; items: string[] }> = {
  ios: {
    title: 'آیفون',
    browser: 'حتماً با مرورگر «سافاری» (Safari) باز کنید',
    items: [
      'پایین صفحه، دکمهٔ «اشتراک‌گذاری» را بزنید (مربعی که یک فلش به بالا دارد).',
      'در لیست، کمی بالا بیایید و «افزودن به صفحهٔ اصلی» (Add to Home Screen) را بزنید.',
      'در بالای صفحه «افزودن» (Add) را بزنید. تمام! آیکن «موبایل کارکرده» روی صفحهٔ گوشی شما می‌آید.',
    ],
  },
  android: {
    title: 'اندروید',
    browser: 'با مرورگر «کروم» (Chrome) باز کنید',
    items: [
      'بالای صفحه، منوی سه‌نقطه (⋮) را بزنید.',
      'گزینهٔ «نصب برنامه» (Install app) یا «افزودن به صفحهٔ اصلی» را بزنید.',
      'در پنجره‌ای که باز می‌شود «نصب» را بزنید. آیکن برنامه روی صفحهٔ گوشی شما می‌آید.',
    ],
  },
}

const detectPlatform = (): Platform => (/iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ios' : 'android')
const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches

/** A picture-free, three-step guide to putting the app on the phone's home screen. */
export function InstallPage() {
  const [platform, setPlatform] = useState<Platform>(detectPlatform)
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
  const installed = isInstalled()

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setPrompt(e as InstallPromptEvent) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const guide = steps[platform]
  return (
    <div className="container page narrow">
      <h1 className="page__title">نصب برنامه روی گوشی</h1>
      <p className="muted">با نصب، «موبایل کارکرده» مثل یک برنامهٔ معمولی روی صفحهٔ گوشی شما می‌نشیند و هر وقت خواستید با یک لمس باز می‌شود. نیازی به فروشگاه برنامه (مثل بازار یا اپ‌استور) نیست.</p>

      {installed ? (
        <p className="notice">برنامه روی همین گوشی نصب است. <Link to={paths.catalog}>رفتن به لیست قیمت</Link></p>
      ) : (
        <>
          {prompt && (
            <button className="btn btn--primary btn--lg btn--block install__now" onClick={() => { void prompt.prompt() }}>همین الان نصب کن</button>
          )}
          <div className="install__tabs" role="tablist" aria-label="نوع گوشی">
            {(Object.keys(steps) as Platform[]).map((id) => (
              <button key={id} role="tab" aria-selected={platform === id} className={platform === id ? 'is-on' : ''} onClick={() => setPlatform(id)}>
                {steps[id].title}
              </button>
            ))}
          </div>
          <p className="install__browser">{guide.browser}</p>
          <ol className="install__steps">
            {guide.items.map((text, i) => (
              <li key={text}><span>{['۱', '۲', '۳'][i]}</span><p>{text}</p></li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}
