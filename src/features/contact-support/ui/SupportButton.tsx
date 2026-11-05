import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { paths } from '@/shared/config/routes'
import { telegramLink, whatsappLink } from '@/shared/config/support'
import './contact-support.css'

/**
 * A "help" button for the top bar. Opens a sheet with one-tap WhatsApp and Telegram chats.
 * `extras` lets the page shell add more help (e.g. the text-size switch) without this feature knowing about it.
 */
export function SupportButton({ extras }: { extras?: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button type="button" className="help-btn" onClick={() => setOpen(true)} aria-haspopup="dialog">
        <span className="help-btn__icon" aria-hidden="true">؟</span>
        <span>راهنما</span>
      </button>
      {open && createPortal(
        <div className="help-overlay" onClick={() => setOpen(false)}>
          <div className="help-sheet" role="dialog" aria-modal="true" aria-labelledby="help-title" onClick={(e) => e.stopPropagation()}>
            <div className="help-sheet__head">
              <div>
                <h2 id="help-title">کمک می‌خواهید؟</h2>
                <p className="muted">با یک لمس به کارشناس ما پیام بدهید. معمولاً سریع جواب می‌دهیم.</p>
              </div>
              <button type="button" className="help-sheet__close" onClick={() => setOpen(false)} aria-label="بستن">✕</button>
            </div>
            <a className="help-link help-link--wa" href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <span className="help-link__icon" aria-hidden="true">W</span>
              <span><b>پیام در واتساپ</b><small>گفتگو با کارشناس</small></span>
            </a>
            <a className="help-link help-link--tg" href={telegramLink()} target="_blank" rel="noopener noreferrer">
              <span className="help-link__icon" aria-hidden="true">T</span>
              <span><b>پیام در تلگرام</b><small>گفتگو با کارشناس</small></span>
            </a>
            {extras}
            <Link className="help-install" to={paths.install} onClick={() => setOpen(false)}>
              <span aria-hidden="true">⬇</span> چطور برنامه را روی گوشی نصب کنم؟
            </Link>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
