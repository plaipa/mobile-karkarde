import { useState } from 'react'
import { DeviceArt, findCategory } from '@/entities/category'
import { ListingPhotos } from '@/entities/listing'
import { useSession } from '@/entities/session'
import { galleryAngles, type Product } from '@/entities/product'
import './product-details.css'

export function Gallery({ product: p }: { product: Product }) {
  const { verified } = useSession()
  const [angle, setAngle] = useState<string>(galleryAngles[0].id)
  const category = findCategory(p.category)
  const isPhone = p.category === 'phone'
  if (p.listingId) {
    return (
      <div className="pdp__gallery">
        {verified
          ? <ListingPhotos listingId={p.listingId} audience="buyer" />
          : <p className="muted">عکس‌های این دستگاه فقط برای همکاران تأییدشده نمایش داده می‌شود.</p>}
        <p className="muted small">عکس‌ها را کارشناس ما بازبینی کرده است.</p>
      </div>
    )
  }
  return (
    <div className="pdp__gallery">
      <div className="pdp__main">
        <span className="chip chip--white">{galleryAngles.find((a) => a.id === angle)?.label}</span>
        <i className="halo" />
        <DeviceArt kind={p.category} tone={category.tone} w={isPhone ? 190 : 200} h={isPhone ? 380 : 320} />
      </div>
      <div className="thumbs">
        {galleryAngles.map((a) => (
          <button key={a.id} className={`thumb${a.id === angle ? ' is-on' : ''}`} onClick={() => setAngle(a.id)}>
            <DeviceArt kind={p.category} tone={category.tone} w={26} h={isPhone ? 52 : 40} />
            <span>{a.label}</span>
          </button>
        ))}
      </div>
      <p className="muted small">عکس‌ها پس از حذف پس‌زمینه و پاک‌سازی اطلاعات پنهان منتشر می‌شوند. (در این نمونه به‌جای عکس واقعی، تصویر نمادین نمایش داده می‌شود.)</p>
    </div>
  )
}
