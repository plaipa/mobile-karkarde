import type { CategoryId } from '@/entities/category'
import type { PhotoSlot } from './types'

/**
 * The photo checklist shown to sellers, per category. Edit here to add / remove / reorder shots:
 * the form, progress bar, camera guide and validation all read from this list.
 * `shape` picks the dashed guide drawn over the camera preview (see ui/CameraCapture.tsx).
 */
const screenshotHint = 'قبل از اسکرین‌شات، نام اپل‌آیدی، شماره و نام دستگاه را از صفحه پاک کنید.'

export const photoTemplates: Record<CategoryId, PhotoSlot[]> = {
  phone: [
    { id: 'front-on', label: 'روبه‌رو · صفحه روشن', hint: 'صفحه روشن با نور متوسط. کل بدنه داخل کادر باشد.', required: true, shape: 'tall' },
    { id: 'front-off', label: 'روبه‌رو · صفحه خاموش', hint: 'صفحه خاموش تا خط‌وخش و ضربه روی شیشه دیده شود.', required: true, shape: 'tall' },
    { id: 'back', label: 'پشت گوشی', hint: 'قاب و محافظ برداشته شود.', required: true, shape: 'tall' },
    { id: 'top', label: 'لبهٔ بالا', hint: 'گوشی را به‌صورت افقی نگه دارید و لبهٔ بالا را بگیرید.', required: true, shape: 'edgeH' },
    { id: 'bottom', label: 'لبهٔ پایین', hint: 'پورت شارژ و اسپیکر دیده شود.', required: true, shape: 'edgeH' },
    { id: 'left', label: 'لبهٔ چپ', hint: 'کل طول لبه داخل کادر باشد.', required: true, shape: 'edgeV' },
    { id: 'right', label: 'لبهٔ راست', hint: 'دکمه‌ها و ریل شارژ دیده شود.', required: true, shape: 'edgeV' },
    { id: 'camera', label: 'نمای نزدیک دوربین', hint: 'لنزها و قاب دوربین از نزدیک.', required: true, shape: 'square' },
    { id: 'battery', label: 'سلامت باتری', hint: screenshotHint, required: true, shape: 'free', screenshot: true },
    { id: 'storage', label: 'ظرفیت حافظه', hint: screenshotHint, required: true, shape: 'free', screenshot: true },
    { id: 'defects', label: 'نمای نزدیک عیب‌ها', hint: 'خط‌وخش یا ضربه را از نزدیک نشان دهید (اختیاری).', required: false, shape: 'square' },
    { id: 'box', label: 'جعبه و لوازم', hint: 'در صورت وجود جعبه و لوازم (اختیاری).', required: false, shape: 'wide' },
  ],
  watch: [
    { id: 'front-on', label: 'روبه‌رو · صفحه روشن', hint: 'صفحه روشن و ساعت داخل کادر.', required: true, shape: 'watch' },
    { id: 'front-off', label: 'روبه‌رو · صفحه خاموش', hint: 'برای دیدن خط‌وخش شیشه.', required: true, shape: 'watch' },
    { id: 'back', label: 'پشت (سنسورها)', hint: 'سنسورها و شیشهٔ پشت واضح باشد.', required: true, shape: 'watch' },
    { id: 'crown', label: 'تاج و دکمه‌ها', hint: 'لبه‌ای که تاج و دکمه دارد.', required: true, shape: 'edgeH' },
    { id: 'band', label: 'بند از دو طرف', hint: 'بند را کامل باز کنید.', required: true, shape: 'wide' },
    { id: 'clasp', label: 'قفل بند', hint: 'نمای نزدیک قفل بند.', required: true, shape: 'square' },
    { id: 'battery', label: 'سلامت باتری', hint: screenshotHint, required: true, shape: 'free', screenshot: true },
    { id: 'defects', label: 'نمای نزدیک عیب‌ها', hint: 'اختیاری.', required: false, shape: 'square' },
  ],
  speaker: [
    { id: 'front', label: 'روبه‌رو', hint: 'اسپیکر کامل داخل کادر.', required: true, shape: 'speaker' },
    { id: 'back', label: 'پشت (برچسب مدل)', hint: 'برچسب مدل و پورت‌ها دیده شود.', required: true, shape: 'speaker' },
    { id: 'top', label: 'بالا (دکمه‌ها)', hint: 'دکمه‌های کنترل.', required: true, shape: 'wide' },
    { id: 'bottom', label: 'پایین', hint: 'پایه و لاستیک کف.', required: true, shape: 'wide' },
    { id: 'side', label: 'کنار', hint: 'یکی از دو طرف.', required: true, shape: 'speaker' },
    { id: 'ports', label: 'پورت شارژ و ورودی‌ها', hint: 'نمای نزدیک.', required: true, shape: 'square' },
    { id: 'working', label: 'روشن و در حال کار', hint: 'چراغ‌ها و نشانگر باتری روشن باشد.', required: true, shape: 'speaker' },
    { id: 'accessories', label: 'لوازم و جعبه', hint: 'اختیاری.', required: false, shape: 'wide' },
  ],
}
