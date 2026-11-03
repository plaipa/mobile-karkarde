export type CategoryId = 'phone' | 'watch' | 'speaker'
export type Grade = 'A' | 'B' | 'C'

export interface Category {
  id: CategoryId
  title: string
  count: number
  brands: string[]
  tone: string
}

export const categories: Category[] = [
  { id: 'phone', title: 'موبایل', count: 1100, brands: ['اپل', 'سامسونگ', 'شیائومی', 'هواوی', 'آنر', 'گوگل'], tone: '#2F5BFF' },
  { id: 'watch', title: 'ساعت هوشمند', count: 60, brands: ['اپل', 'سامسونگ', 'هواوی', 'شیائومی', 'گارمین'], tone: '#B8F23A' },
  { id: 'speaker', title: 'اسپیکر', count: 40, brands: ['جی‌بی‌ال', 'سونی', 'بوز', 'مارشال', 'هارمن', 'انکر'], tone: '#7C93FF' },
]

export interface Product {
  code: string
  category: CategoryId
  brand: string
  name: string
  storage?: string
  battery?: number
  grade: Grade
  price: number
  registered: boolean
  warranty: boolean
  color: string
  addedDays: number
  notes: string
}

export const products: Product[] = [
  { code: 'MK-2041', category: 'phone', brand: 'اپل', name: 'آیفون ۱۳ پرو مکس', storage: '۲۵۶ گیگابایت', battery: 89, grade: 'A', price: 42500000, registered: true, warranty: false, color: 'سیرا بلو', addedDays: 1, notes: 'بدون خط‌وخش جدی' },
  { code: 'MK-2042', category: 'phone', brand: 'سامسونگ', name: 'سامسونگ S23 اولترا', storage: '۲۵۶ گیگابایت', battery: 94, grade: 'A', price: 38200000, registered: true, warranty: true, color: 'مشکی', addedDays: 2, notes: 'تمیز و بدون تعویض قطعه' },
  { code: 'MK-2043', category: 'phone', brand: 'شیائومی', name: 'شیائومی ۱۳ تی پرو', storage: '۵۱۲ گیگابایت', battery: 90, grade: 'B', price: 19800000, registered: true, warranty: false, color: 'آبی', addedDays: 3, notes: 'خط‌وخش جزئی روی قاب' },
  { code: 'MK-2046', category: 'phone', brand: 'اپل', name: 'آیفون ۱۴', storage: '۱۲۸ گیگابایت', battery: 91, grade: 'A', price: 33900000, registered: true, warranty: false, color: 'بنفش', addedDays: 4, notes: 'بدون عیب' },
  { code: 'MK-2047', category: 'phone', brand: 'گوگل', name: 'گوگل پیکسل ۸', storage: '۱۲۸ گیگابایت', battery: 87, grade: 'B', price: 24600000, registered: true, warranty: false, color: 'خاکستری', addedDays: 5, notes: 'ضربهٔ کوچک گوشهٔ بدنه' },
  { code: 'MK-2048', category: 'phone', brand: 'آنر', name: 'آنر ماجیک ۶', storage: '۵۱۲ گیگابایت', battery: 92, grade: 'A', price: 27100000, registered: true, warranty: true, color: 'سبز', addedDays: 6, notes: 'بدون عیب' },
  { code: 'MK-2049', category: 'phone', brand: 'هواوی', name: 'هواوی پی ۶۰', storage: '۲۵۶ گیگابایت', battery: 88, grade: 'B', price: 22400000, registered: true, warranty: false, color: 'سفید', addedDays: 7, notes: 'خط‌وخش جزئی' },
  { code: 'MK-2050', category: 'phone', brand: 'اپل', name: 'آیفون ۱۲', storage: '۱۲۸ گیگابایت', battery: 85, grade: 'C', price: 24800000, registered: true, warranty: false, color: 'مشکی', addedDays: 8, notes: 'خط‌وخش و ضربه روی قاب' },
  { code: 'MK-2051', category: 'phone', brand: 'سامسونگ', name: 'سامسونگ A54', storage: '۲۵۶ گیگابایت', battery: 90, grade: 'A', price: 13200000, registered: true, warranty: true, color: 'سبز', addedDays: 9, notes: 'بدون عیب' },
  { code: 'MK-2060', category: 'watch', brand: 'اپل', name: 'اپل واچ سری ۸', storage: '۴۵ میلی‌متر', battery: 92, grade: 'A', price: 11900000, registered: false, warranty: false, color: 'نقره‌ای', addedDays: 2, notes: 'GPS · بند اصلی' },
  { code: 'MK-2061', category: 'watch', brand: 'سامسونگ', name: 'گلکسی واچ ۶', storage: '۴۴ میلی‌متر', battery: 90, grade: 'A', price: 8600000, registered: false, warranty: true, color: 'مشکی', addedDays: 4, notes: 'بلوتوث · بند اصلی' },
  { code: 'MK-2062', category: 'watch', brand: 'گارمین', name: 'گارمین فنیکس ۶', storage: '۴۷ میلی‌متر', battery: 86, grade: 'B', price: 14900000, registered: false, warranty: false, color: 'خاکستری', addedDays: 6, notes: 'GPS · خط‌وخش روی شیشه' },
  { code: 'MK-2070', category: 'speaker', brand: 'جی‌بی‌ال', name: 'جی‌بی‌ال Charge 5', battery: 93, grade: 'A', price: 6200000, registered: false, warranty: false, color: 'مشکی', addedDays: 1, notes: 'ضدآب · با کابل' },
  { code: 'MK-2071', category: 'speaker', brand: 'سونی', name: 'سونی SRS-XB43', battery: 88, grade: 'B', price: 5400000, registered: false, warranty: false, color: 'آبی', addedDays: 3, notes: 'خط‌وخش جزئی' },
  { code: 'MK-2072', category: 'speaker', brand: 'مارشال', name: 'مارشال Emberton II', battery: 91, grade: 'A', price: 7800000, registered: false, warranty: true, color: 'کرم', addedDays: 5, notes: 'بدون عیب' },
]

export const gradeInfo: Record<Grade, string> = {
  A: 'سالم و تمیز، بدون خط‌وخش قابل توجه',
  B: 'خط‌وخش جزئی یا ضربهٔ کوچک روی بدنه',
  C: 'علائم استفادهٔ بیشتر، کاملاً سالم از نظر عملکرد',
}

export const photoAngles = [
  { id: 'front', label: 'روبه‌رو' },
  { id: 'back', label: 'پشت' },
  { id: 'top', label: 'بالا' },
  { id: 'bottom', label: 'پایین' },
  { id: 'left', label: 'چپ' },
  { id: 'right', label: 'راست' },
  { id: 'camera', label: 'دوربین' },
]

export type GuideShape = 'tall' | 'wide' | 'edgeH' | 'edgeV' | 'square' | 'watch' | 'speaker' | 'free'

export interface PhotoSlot {
  id: string
  label: string
  hint: string
  required: boolean
  shape: GuideShape
  screenshot?: boolean
}

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
