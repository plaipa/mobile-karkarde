import { useTextSize } from '../model/useTextSize'
import './text-size.css'

/** One big switch: "make everything larger". Meant for readers who struggle with small print. */
export function TextSizeToggle() {
  const { size, toggle } = useTextSize()
  const large = size === 'large'
  return (
    <button type="button" className="textsize" role="switch" aria-checked={large} onClick={toggle}>
      <span className="textsize__icon" aria-hidden="true">آ<small>آ</small></span>
      <span className="textsize__label">
        <b>درشت‌تر کردن نوشته‌ها</b>
        <small>{large ? 'روشن است' : 'خاموش است'}</small>
      </span>
      <span className={`textsize__switch${large ? ' is-on' : ''}`} aria-hidden="true"><i /></span>
    </button>
  )
}
