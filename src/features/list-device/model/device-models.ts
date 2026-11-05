import type { CategoryId } from '@/entities/category'

/**
 * Catalog behind the listing form's dropdowns: models per brand (newest first), and for models whose official
 * finishes we know, the exact colors. A model without `colors` falls back to the category's general color list,
 * and «سایر» always lets the seller type anything not listed.
 *
 * Apple, Samsung and Pixel entries were checked against the vendors' sites (Nov 2026); other brands come from
 * memory up to 2025 and carry no per-model colors unless we are sure of them.
 * TODO(content): replace with the real catalog from the backend once it exists.
 */
interface DeviceModel {
  name: string
  colors?: readonly string[]
}

const m = (name: string, colors?: readonly string[]): DeviceModel => ({ name, colors })

// Apple finishes, named the way the Persian market calls them.
const A = {
  duo: ['سفید ستاره‌ای', 'آسمان شب'],
  p18: ['مشکی', 'نقره‌ای', 'یخی (Glacier)', 'زرشکی (Burgundy)'],
  p17: ['نارنجی کیهانی', 'آبی عمیق', 'نقره‌ای'],
  air: ['آبی آسمانی', 'طلایی روشن', 'سفید ابری', 'مشکی فضایی'],
  i17: ['بنفش لوندر', 'سبز مریم‌گلی', 'آبی مه‌آلود', 'سفید', 'مشکی'],
  e17: ['صورتی ملایم', 'سفید', 'مشکی'],
  p16: ['تیتانیوم صحرایی', 'تیتانیوم طبیعی', 'تیتانیوم سفید', 'تیتانیوم مشکی'],
  i16: ['آبی اولترامارین', 'سبزآبی', 'صورتی', 'سفید', 'مشکی'],
  e16: ['سفید', 'مشکی'],
  p15: ['تیتانیوم طبیعی', 'تیتانیوم آبی', 'تیتانیوم سفید', 'تیتانیوم مشکی'],
  i15: ['صورتی', 'زرد', 'سبز', 'آبی', 'مشکی'],
  p14: ['بنفش تیره', 'طلایی', 'نقره‌ای', 'مشکی فضایی'],
  i14: ['آبی', 'بنفش', 'زرد', 'نیمه‌شب', 'ستاره‌ای', 'قرمز'],
  p13: ['سبز آلپی', 'نقره‌ای', 'طلایی', 'گرافیتی', 'آبی سیرا'],
  i13: ['سبز', 'صورتی', 'آبی', 'نیمه‌شب', 'ستاره‌ای', 'قرمز'],
  p12: ['آبی اقیانوسی', 'طلایی', 'گرافیتی', 'نقره‌ای'],
  i12: ['بنفش', 'آبی', 'سبز', 'قرمز', 'سفید', 'مشکی'],
  p11: ['سبز نیمه‌شب', 'نقره‌ای', 'خاکستری فضایی', 'طلایی'],
  i11: ['بنفش', 'زرد', 'سبز', 'مشکی', 'سفید', 'قرمز'],
  se3: ['نیمه‌شب', 'ستاره‌ای', 'قرمز'],
  se2: ['مشکی', 'سفید', 'قرمز'],
  xr: ['آبی', 'سفید', 'مشکی', 'زرد', 'مرجانی', 'قرمز'],
  xs: ['نقره‌ای', 'خاکستری فضایی', 'طلایی'],
  x: ['نقره‌ای', 'خاکستری فضایی'],
  i8: ['نقره‌ای', 'خاکستری فضایی', 'طلایی', 'قرمز'],
  i7: ['مشکی', 'مشکی براق', 'نقره‌ای', 'طلایی', 'رزگلد', 'قرمز'],
}

// Samsung finishes with the marketing name in brackets, so sellers can match the box label.
const S = {
  s26: ['مشکی (Black)', 'سفید (White)', 'آبی آسمانی (Sky Blue)', 'بنفش کبالتی (Cobalt Violet)', 'نقره‌ای سایه (Silver Shadow)', 'طلایی صورتی (Pink Gold)'],
  s26fe: ['گرافیتی (Graphite)', 'آبی بلوبری (Blueberry)', 'پسته‌ای (Pistachio)'],
  s25u: ['تیتانیوم مشکی', 'تیتانیوم خاکستری', 'تیتانیوم آبی‌نقره‌ای (Silverblue)', 'تیتانیوم سفید‌نقره‌ای (Whitesilver)', 'تیتانیوم سبز یشمی (Jadegreen)', 'تیتانیوم طلایی صورتی (Pinkgold)', 'تیتانیوم مشکی براق (Jetblack)'],
  s25: ['نقره‌ای سایه (Silver Shadow)', 'سرمه‌ای (Navy)', 'آبی یخی (Icyblue)', 'نعنایی (Mint)', 'مشکی آبی (Blueblack)', 'قرمز مرجانی (Coralred)', 'طلایی صورتی (Pinkgold)'],
  s25edge: ['تیتانیوم نقره‌ای', 'تیتانیوم مشکی براق (Jetblack)', 'تیتانیوم آبی یخی (Icyblue)'],
  s25fe: ['سفید (White)', 'سرمه‌ای (Navy)', 'مشکی براق (Jetblack)', 'آبی یخی (Icyblue)'],
  s24u: ['تیتانیوم مشکی', 'تیتانیوم خاکستری', 'تیتانیوم بنفش', 'تیتانیوم زرد', 'تیتانیوم آبی', 'تیتانیوم سبز', 'تیتانیوم نارنجی'],
  s24: ['مشکی (Onyx Black)', 'خاکستری مرمری (Marble Gray)', 'بنفش کبالتی (Cobalt Violet)', 'زرد کهربایی (Amber Yellow)', 'سبز یشمی (Jade Green)', 'آبی یاقوتی (Sapphire Blue)', 'نارنجی ماسه‌ای (Sandstone Orange)'],
  s23: ['مشکی (Phantom Black)', 'کرم (Cream)', 'سبز (Green)', 'اسطوخودوسی (Lavender)', 'گرافیتی (Graphite)', 'آبی آسمانی (Sky Blue)', 'لیمویی (Lime)'],
  s22u: ['مشکی (Phantom Black)', 'سفید (Phantom White)', 'زرشکی (Burgundy)', 'سبز (Green)', 'گرافیتی (Graphite)', 'آبی آسمانی (Sky Blue)', 'قرمز (Red)'],
  s22: ['مشکی (Phantom Black)', 'سفید (Phantom White)', 'سبز (Green)', 'طلایی صورتی (Pink Gold)', 'گرافیتی (Graphite)', 'آبی آسمانی (Sky Blue)', 'بنفش (Violet)', 'کرم (Cream)'],
  fold8u: ['گرافیتی (Graphite)', 'کرم (Cream)', 'بنفش سایه (Violet Shadow)', 'سبز سایه (Green Shadow)'],
  fold8: ['گرافیتی (Graphite)', 'کرم (Cream)', 'اسطوخودوسی (Lavender)', 'پسته‌ای (Pistachio)'],
  flip8: ['گرافیتی (Graphite)', 'کرم (Cream)', 'صورتی (Pink)', 'نعنایی (Mint)'],
  fold7: ['مشکی براق (Jetblack)', 'نقره‌ای سایه (Silver Shadow)', 'نعنایی (Mint)', 'آبی سایه (Blue Shadow)'],
  flip7: ['قرمز مرجانی (Coralred)', 'آبی سایه (Blue Shadow)', 'نعنایی (Mint)', 'مشکی براق (Jetblack)'],
  fold6: ['نقره‌ای سایه (Silver Shadow)', 'سرمه‌ای (Navy)', 'صورتی (Pink)', 'سفید (White)', 'مشکی (Crafted Black)', 'هلویی (Peach)'],
  flip6: ['نقره‌ای سایه (Silver Shadow)', 'زرد (Yellow)', 'آبی (Blue)', 'نعنایی (Mint)', 'هلویی (Peach)', 'مشکی (Crafted Black)', 'سفید (White)'],
  fold5: ['آبی یخی (Icy Blue)', 'مشکی (Phantom Black)', 'کرم (Cream)', 'خاکستری (Gray)', 'آبی (Blue)'],
  flip5: ['نعنایی (Mint)', 'گرافیتی (Graphite)', 'کرم (Cream)', 'اسطوخودوسی (Lavender)', 'خاکستری (Gray)', 'سبز (Green)', 'آبی (Blue)', 'زرد (Yellow)'],
  a55: ['آبی یخی (Awesome Iceblue)', 'یاسی (Awesome Lilac)', 'سرمه‌ای (Awesome Navy)', 'لیمویی (Awesome Lemon)'],
  a56: ['گرافیتی (Awesome Graphite)', 'خاکستری روشن (Awesome Lightgray)', 'زیتونی (Awesome Olive)', 'صورتی (Awesome Pink)'],
  a54: ['گرافیتی (Awesome Graphite)', 'سفید (Awesome White)', 'بنفش (Awesome Violet)', 'لیمویی (Awesome Lime)'],
  a34: ['گرافیتی (Awesome Graphite)', 'لیمویی (Awesome Lime)', 'نقره‌ای (Awesome Silver)', 'بنفش (Awesome Violet)'],
}

// Google Pixel finishes (Pixel 11 colors are not listed on the store page yet, so those models have none).
const G = {
  p10: ['مشکی (Obsidian)', 'آبی یخی (Frost)', 'نیلی (Indigo)', 'سبز لیمویی (Lemongrass)'],
  p10pro: ['مشکی (Obsidian)', 'سفید چینی (Porcelain)', 'سنگ ماه (Moonstone)', 'یشمی (Jade)'],
  p10fold: ['سنگ ماه (Moonstone)', 'یشمی (Jade)'],
  p10a: ['مشکی (Obsidian)', 'توت‌فرنگی (Berry)', 'مه (Fog)', 'اسطوخودوسی (Lavender)'],
  p9: ['مشکی (Obsidian)', 'سفید چینی (Porcelain)', 'سبز زمستانی (Wintergreen)', 'صورتی (Peony)'],
  p9pro: ['مشکی (Obsidian)', 'سفید چینی (Porcelain)', 'فندقی (Hazel)', 'صورتی کوارتز (Rose Quartz)'],
  p9fold: ['مشکی (Obsidian)', 'سفید چینی (Porcelain)'],
  p8: ['مشکی (Obsidian)', 'فندقی (Hazel)', 'صورتی (Rose)'],
  p8pro: ['مشکی (Obsidian)', 'سفید چینی (Porcelain)', 'آبی خلیجی (Bay)'],
  p8a: ['مشکی (Obsidian)', 'سفید چینی (Porcelain)', 'آبی خلیجی (Bay)', 'سبز آلوئه (Aloe)'],
  p7: ['مشکی (Obsidian)', 'سفید برفی (Snow)', 'سبز لیمویی (Lemongrass)'],
  p7pro: ['مشکی (Obsidian)', 'سفید برفی (Snow)', 'فندقی (Hazel)'],
}

export const deviceModels: Record<CategoryId, Record<string, readonly DeviceModel[]>> = {
  phone: {
    'اپل': [
      m('آیفون ۱۸ پرو مکس', A.p18), m('آیفون ۱۸ پرو', A.p18), m('آیفون دو (Duo)', A.duo),
      m('آیفون ۱۷ پرو مکس', A.p17), m('آیفون ۱۷ پرو', A.p17), m('آیفون ایر', A.air), m('آیفون ۱۷', A.i17), m('آیفون ۱۷e', A.e17),
      m('آیفون ۱۶ پرو مکس', A.p16), m('آیفون ۱۶ پرو', A.p16), m('آیفون ۱۶ پلاس', A.i16), m('آیفون ۱۶', A.i16), m('آیفون ۱۶e', A.e16),
      m('آیفون ۱۵ پرو مکس', A.p15), m('آیفون ۱۵ پرو', A.p15), m('آیفون ۱۵ پلاس', A.i15), m('آیفون ۱۵', A.i15),
      m('آیفون ۱۴ پرو مکس', A.p14), m('آیفون ۱۴ پرو', A.p14), m('آیفون ۱۴ پلاس', A.i14), m('آیفون ۱۴', A.i14),
      m('آیفون ۱۳ پرو مکس', A.p13), m('آیفون ۱۳ پرو', A.p13), m('آیفون ۱۳', A.i13), m('آیفون ۱۳ مینی', A.i13),
      m('آیفون ۱۲ پرو مکس', A.p12), m('آیفون ۱۲ پرو', A.p12), m('آیفون ۱۲', A.i12), m('آیفون ۱۲ مینی', A.i12),
      m('آیفون ۱۱ پرو مکس', A.p11), m('آیفون ۱۱ پرو', A.p11), m('آیفون ۱۱', A.i11),
      m('آیفون SE نسل ۳', A.se3), m('آیفون SE نسل ۲', A.se2),
      m('آیفون ایکس‌آر', A.xr), m('آیفون ایکس‌اس مکس', A.xs), m('آیفون ایکس‌اس', A.xs), m('آیفون ایکس', A.x),
      m('آیفون ۸ پلاس', A.i8), m('آیفون ۸', A.i8), m('آیفون ۷ پلاس', A.i7), m('آیفون ۷', A.i7),
    ],
    'سامسونگ': [
      m('گلکسی Z Fold8 اولترا', S.fold8u), m('گلکسی Z Fold8', S.fold8), m('گلکسی Z Flip8', S.flip8),
      m('گلکسی S26 اولترا', S.s26), m('گلکسی S26 پلاس', S.s26), m('گلکسی S26', S.s26), m('گلکسی S26 FE', S.s26fe),
      m('گلکسی Z Fold7', S.fold7), m('گلکسی Z Flip7', S.flip7),
      m('گلکسی S25 اولترا', S.s25u), m('گلکسی S25 Edge', S.s25edge), m('گلکسی S25 پلاس', S.s25), m('گلکسی S25', S.s25), m('گلکسی S25 FE', S.s25fe),
      m('گلکسی Z Fold6', S.fold6), m('گلکسی Z Flip6', S.flip6),
      m('گلکسی S24 اولترا', S.s24u), m('گلکسی S24 پلاس', S.s24), m('گلکسی S24', S.s24), m('گلکسی S24 FE'),
      m('گلکسی Z Fold5', S.fold5), m('گلکسی Z Flip5', S.flip5), m('گلکسی Z Fold4'), m('گلکسی Z Flip4'),
      m('گلکسی S23 اولترا', S.s23), m('گلکسی S23 پلاس', S.s23), m('گلکسی S23', S.s23), m('گلکسی S23 FE'),
      m('گلکسی S22 اولترا', S.s22u), m('گلکسی S22 پلاس', S.s22), m('گلکسی S22', S.s22),
      m('گلکسی A57'), m('گلکسی A56', S.a56), m('گلکسی A55', S.a55), m('گلکسی A54', S.a54), m('گلکسی A36'), m('گلکسی A35', S.a55), m('گلکسی A34', S.a34),
      m('گلکسی A27'), m('گلکسی A26'), m('گلکسی A25'), m('گلکسی A16'), m('گلکسی A15'),
      m('گلکسی نوت ۲۰ اولترا'), m('گلکسی نوت ۲۰'), m('گلکسی نوت ۱۰ پلاس'),
    ],
    'شیائومی': [
      m('شیائومی 15 اولترا', ['مشکی', 'سفید', 'نقره‌ای کرومی']), m('شیائومی 15', ['مشکی', 'سفید', 'سبز', 'نقره‌ای مایع']),
      m('شیائومی 14T پرو'), m('شیائومی 14T'), m('شیائومی 14 اولترا', ['مشکی', 'سفید']), m('شیائومی 14', ['مشکی', 'سفید', 'سبز یشمی', 'صورتی']),
      m('شیائومی 13T پرو'), m('شیائومی 13T'), m('شیائومی 13'),
      m('ردمی نوت ۱۴ پرو پلاس'), m('ردمی نوت ۱۴ پرو'), m('ردمی نوت ۱۴'),
      m('ردمی نوت ۱۳ پرو پلاس'), m('ردمی نوت ۱۳ پرو'), m('ردمی نوت ۱۳'), m('ردمی نوت ۱۲ پرو'), m('ردمی نوت ۱۲'),
      m('ردمی ۱۴C'), m('ردمی ۱۳C'), m('ردمی ۱۲'),
      m('پوکو F7'), m('پوکو X7 پرو'), m('پوکو X7'), m('پوکو F6 پرو'), m('پوکو F6'), m('پوکو X6 پرو'), m('پوکو X6'), m('پوکو M6 پرو'),
    ],
    'هواوی': [
      m('هواوی میت ۷۰ پرو'), m('هواوی پورا ۷۰ اولترا'), m('هواوی پورا ۷۰ پرو'), m('هواوی میت ۶۰ پرو'),
      m('هواوی نوا ۱۳'), m('هواوی نوا ۱۲'), m('هواوی نوا ۱۱'), m('هواوی نوا ۹'),
      m('هواوی P60 پرو'), m('هواوی میت ۵۰ پرو'), m('هواوی Y9a'),
    ],
    'آنر': [
      m('آنر Magic7 پرو'), m('آنر Magic6 پرو'), m('آنر Magic5 پرو'),
      m('آنر 400 پرو'), m('آنر 400'), m('آنر 200 پرو'), m('آنر 200'), m('آنر 90'), m('آنر 70'),
      m('آنر X9c'), m('آنر X9b'), m('آنر X8b'), m('آنر X8'),
    ],
    'گوگل': [
      m('پیکسل ۱۱ پرو فولد'), m('پیکسل ۱۱ پرو XL'), m('پیکسل ۱۱ پرو'), m('پیکسل ۱۱'),
      m('پیکسل ۱۰a', G.p10a), m('پیکسل ۱۰ پرو فولد', G.p10fold), m('پیکسل ۱۰ پرو XL', G.p10pro), m('پیکسل ۱۰ پرو', G.p10pro), m('پیکسل ۱۰', G.p10),
      m('پیکسل ۹a'), m('پیکسل ۹ پرو فولد', G.p9fold), m('پیکسل ۹ پرو XL', G.p9pro), m('پیکسل ۹ پرو', G.p9pro), m('پیکسل ۹', G.p9),
      m('پیکسل ۸a', G.p8a), m('پیکسل ۸ پرو', G.p8pro), m('پیکسل ۸', G.p8),
      m('پیکسل ۷a'), m('پیکسل ۷ پرو', G.p7pro), m('پیکسل ۷', G.p7), m('پیکسل ۶ پرو'), m('پیکسل ۶'),
    ],
  },
  watch: {
    'اپل': [
      m('اپل واچ اولترا ۳', ['تیتانیوم طبیعی', 'تیتانیوم مشکی']), m('اپل واچ سری ۱۱', ['مشکی براق', 'رزگلد', 'طلایی', 'نقره‌ای', 'خاکستری فضایی', 'تیتانیوم طبیعی', 'تیتانیوم طلایی', 'تیتانیوم اسلیت']),
      m('اپل واچ SE نسل ۳', ['نیمه‌شب', 'ستاره‌ای']),
      m('اپل واچ اولترا ۲', ['تیتانیوم طبیعی', 'تیتانیوم مشکی']), m('اپل واچ اولترا', ['تیتانیوم طبیعی']),
      m('اپل واچ سری ۱۰', ['مشکی براق', 'رزگلد', 'نقره‌ای', 'تیتانیوم طبیعی', 'تیتانیوم طلایی', 'تیتانیوم اسلیت']),
      m('اپل واچ سری ۹', ['نیمه‌شب', 'ستاره‌ای', 'نقره‌ای', 'صورتی', 'قرمز', 'استیل گرافیتی', 'استیل نقره‌ای', 'استیل طلایی']),
      m('اپل واچ سری ۸', ['نیمه‌شب', 'ستاره‌ای', 'نقره‌ای', 'قرمز', 'استیل گرافیتی', 'استیل نقره‌ای', 'استیل طلایی']),
      m('اپل واچ سری ۷'), m('اپل واچ سری ۶'), m('اپل واچ SE نسل ۲', ['نیمه‌شب', 'ستاره‌ای', 'نقره‌ای']), m('اپل واچ SE'),
    ],
    'سامسونگ': [m('گلکسی واچ ۸'), m('گلکسی واچ ۷'), m('گلکسی واچ اولترا'), m('گلکسی واچ ۶ کلاسیک'), m('گلکسی واچ ۶'), m('گلکسی واچ ۵ پرو'), m('گلکسی واچ ۵'), m('گلکسی واچ ۴')],
    'هواوی': [m('واچ GT 5 پرو'), m('واچ GT 5'), m('واچ GT 4'), m('واچ GT 3 پرو'), m('واچ GT 3'), m('واچ فیت ۳')],
    'شیائومی': [m('واچ S4'), m('واچ S3'), m('واچ S1 پرو'), m('ردمی واچ ۵'), m('ردمی واچ ۴'), m('اسمارت بند ۱۰'), m('اسمارت بند ۹'), m('اسمارت بند ۸')],
    'گارمین': [m('فنیکس ۸'), m('فنیکس ۷'), m('فنیکس ۶'), m('فورراَنر ۹۷۰'), m('فورراَنر ۹۵۵'), m('ونو ۳')],
  },
  speaker: {
    'جی‌بی‌ال': [m('Charge 6'), m('Charge 5'), m('Flip 7'), m('Flip 6'), m('Flip 5'), m('Go 4'), m('Go 3'), m('Xtreme 4'), m('Xtreme 3'), m('Boombox 3'), m('Clip 5'), m('Clip 4')],
    'سونی': [m('SRS-XB43'), m('SRS-XB33'), m('SRS-XG300'), m('SRS-XE200'), m('SRS-XV800')],
    'بوز': [m('SoundLink Flex'), m('SoundLink Revolve+ II'), m('SoundLink Micro'), m('SoundLink Max')],
    'مارشال': [m('Emberton III'), m('Emberton II'), m('Kilburn II'), m('Stanmore III'), m('Acton III'), m('Woburn III')],
    'هارمن': [m('Onyx Studio 8'), m('Go + Play 3'), m('Aura Studio 4')],
    'انکر': [m('ساندکور ۳'), m('ساندکور موشن بوم'), m('ساندکور فلر ۲')],
  },
}

/** Storage / case size per category. Phones start at 16 GB so older models can be listed too. */
export const storageOptions: Record<CategoryId, readonly string[]> = {
  phone: ['۱۶ گیگابایت', '۳۲ گیگابایت', '۶۴ گیگابایت', '۱۲۸ گیگابایت', '۲۵۶ گیگابایت', '۵۱۲ گیگابایت', '۱ ترابایت', '۲ ترابایت'],
  watch: ['۳۸ میلی‌متر', '۴۰ میلی‌متر', '۴۱ میلی‌متر', '۴۲ میلی‌متر', '۴۴ میلی‌متر', '۴۵ میلی‌متر', '۴۶ میلی‌متر', '۴۹ میلی‌متر'],
  speaker: [],
}

/** General colors, used when the chosen model has no official list. */
const fallbackColors: Record<CategoryId, readonly string[]> = {
  phone: ['مشکی', 'سفید', 'خاکستری', 'نقره‌ای', 'طلایی', 'آبی', 'سبز', 'بنفش', 'قرمز', 'صورتی', 'نارنجی', 'زرد'],
  watch: ['مشکی', 'سفید', 'نقره‌ای', 'طلایی', 'خاکستری', 'آبی', 'صورتی', 'نارنجی'],
  speaker: ['مشکی', 'سفید', 'آبی', 'قرمز', 'سبز', 'خاکستری', 'صورتی'],
}

const find = (category: CategoryId, brand: string, model: string) => deviceModels[category][brand]?.find((d) => d.name === model)

export const modelsFor = (category: CategoryId, brand: string): readonly string[] => (deviceModels[category][brand] ?? []).map((d) => d.name)

/** The chosen model's official colors when known, otherwise the category's general list. */
export const colorsFor = (category: CategoryId, brand: string, model: string): readonly string[] =>
  find(category, brand, model)?.colors ?? fallbackColors[category]

/** True when `colorsFor` returns the model's own list rather than the general fallback. */
export const hasOfficialColors = (category: CategoryId, brand: string, model: string): boolean => Boolean(find(category, brand, model)?.colors)
