# معماری پروژه

این پروژه از معماری **Feature-Sliced Design (FSD)** پیروی می‌کند؛ یک معماری لایه‌ای برای فرانت‌اند که کد را بر اساس «حوزهٔ کسب‌وکار» می‌چیند، نه بر اساس نوع فایل. نتیجه: هر تغییر معمولاً فقط در **یک پوشه** انجام می‌شود و پروژه با بزرگ‌شدن، درهم‌ریخته نمی‌شود.

## لایه‌ها (از بالا به پایین)

| لایه | نقش | در این پروژه |
|---|---|---|
| `app` | راه‌اندازی: Providerها، مسیریابی، استایل سراسری | `App`, `router.tsx`, `providers/` |
| `pages` | یک پوشه برای هر صفحه؛ فقط «چیدمان» بخش‌ها | `home`, `catalog`, `product-details`, `about`, `sell`, `login`, `cart`, `not-found` |
| `widgets` | بلوک‌های بزرگ و مستقل که چند ویژگی را کنار هم می‌گذارند | `app-shell` (هدر/فوتر/تب‌بار)، `catalog-card` |
| `features` | یک کار مشخص که کاربر انجام می‌دهد | `auth-by-phone`, `cart`, `browse-products`, `list-device`, `price-visibility` |
| `entities` | مفاهیم دامنه: داده + نمایش پایهٔ آن | `category`, `product`, `session` |
| `shared` | چیزهای عمومی بدون دانش کسب‌وکار | `config/routes`, `lib/` (قالب‌بندی، ذخیره‌سازی، پردازش عکس)، `ui/` (استایل‌های پایه، Tabs) |

### سه قانون (با `npm run check:arch` خودکار بررسی می‌شود)

1. **فقط به پایین import کن.** `pages` می‌تواند از `features` و `entities` استفاده کند، ولی هرگز برعکس.
2. **هم‌سطح‌ها همدیگر را نمی‌شناسند.** دو ویژگی (مثلاً `cart` و `browse-products`) مستقیم import نمی‌کنند؛ در لایهٔ بالاتر (page یا widget) کنار هم قرار می‌گیرند. (تنها استثنا: `product → category`.)
3. **فقط از دروازهٔ عمومی وارد شو.** از بیرون یک slice، فقط `@/features/cart` مجاز است، نه `@/features/cart/model/useCart`.

داخل هر slice پوشه‌ها بر اساس نقش هستند: `ui/` (کامپوننت و CSS)، `model/` (state، منطق خالص)، `lib/` (ابزار کمکی)، `api/` (دریافت داده). فایل `index.ts` فهرست چیزهایی است که بیرون می‌تواند ببیند.

## کجا را ویرایش کنم؟

| می‌خواهم… | فایل |
|---|---|
| متن/محتوای صفحهٔ «دربارهٔ ما» را عوض کنم | `src/pages/about/model/content.ts` |
| متن مراحل «چطور کار می‌کند؟» در خانه | `src/pages/home/model/content.ts` |
| دسته یا برند اضافه/حذف کنم | `src/entities/category/model/categories.ts` |
| محصولات نمونه را عوض کنم | `src/entities/product/api/mock-products.ts` |
| زاویه‌های عکس هر دسته را عوض کنم | `src/features/list-device/model/photo-templates.ts` |
| قوانین اعتبارسنجی «ثبت دستگاه» | `src/features/list-device/model/validate-listing.ts` |
| جلوگیری از شماره/آیدی در توضیحات | `src/features/list-device/lib/contact-guard.ts` |
| منطق فیلتر و مرتب‌سازی محصولات | `src/features/browse-products/model/filters.ts` |
| افزودن یک فیلتر جدید به لیست قیمت | فیلد در `entities/product/model/types.ts` ← شرط در `applyFilters` و گزینه‌ها در `buildFacets` (`filters.ts`) ← گروه جدید در `FilterPanel.tsx` |
| کدهای ریجن (ZA، CH، LL …) و برچسب سیم‌کارت | `src/entities/product/model/regions.ts` |
| شمارهٔ واتساپ و آیدی تلگرام پشتیبانی (**جایگزین مقادیر نمونه شود**) | `src/shared/config/support.ts` |
| دکمهٔ «راهنما» (واتساپ، تلگرام، درشت‌کردن نوشته، راهنمای نصب) | `src/features/contact-support/` و `src/features/text-size/` |
| میانبرهای بالای لیست قیمت (مدل‌ها و کد کشور) | `src/features/browse-products/ui/QuickFilters.tsx` |
| متن راهنمای نصب برنامه | `src/pages/install/ui/InstallPage.tsx` |
| منوی هدر و تب‌بار موبایل | `src/widgets/app-shell/model/navigation.ts` |
| رنگ‌ها، گوشه‌ها، فونت | `src/shared/ui/styles/tokens.css` |
| آدرس صفحات | `src/shared/config/routes.ts` |
| سرور (ورود، جدول‌ها، عکس‌ها، ایمیل) | `supabase/` و `src/shared/api/supabase.ts` |
| ایمیل، رمز و تأیید دو مرحله‌ای کاربر | `src/entities/account/` و `src/pages/account/` |
| نقش از سرور (مدیر، کارشناس، همکار) | `src/entities/session/` |
| فهرست کارشناس‌ها و همکاران، مسدودکردن (فقط ادمین) | `src/entities/staff/` |
| نام نمایشی، ایمیل و رمز، دو مرحله‌ای | `src/entities/account/` |
| وضعیت دستگاه (در انتظار، تأیید، رد) و تصمیم کارشناس | `src/entities/listing/` |
| حالت آزمایشی (نوار بالا، راهنمای تست) — برای انتشار نهایی `enabled` را false کنید | `src/shared/config/beta.ts` و `src/pages/beta/` |
| حذف خودکار پس‌زمینهٔ عکس‌ها (کارگر پایتون + اجرای زمان‌بندی‌شده) | `tools/photo-background/` و `.github/workflows/process-photos.yml` |
| خواندن عکس‌ها (اصلی و پردازش‌شده) در سایت | `src/entities/listing/model/photos.ts` |
| پنل ادمین (تعیین کارشناس) / پنل کارشناس (تأیید و رد) | `src/pages/admin/` و `src/pages/inspector/` |
| ردیف‌های جدول مشخصات / گزارش بازرسی | `src/entities/product/lib/describe.ts` |

### افزودن یک صفحهٔ جدید
1. پوشهٔ `src/pages/<name>/` با `ui/<Name>Page.tsx` و `index.ts` بسازید (خروجی: `export { NamePage } from './ui/NamePage'`).
2. مسیر را در `src/shared/config/routes.ts` تعریف کنید.
3. یک خط `lazy(...)` و یک `<Route>` در `src/app/router.tsx` اضافه کنید.

### افزودن فیلد جدید به محصول (مثلاً «ضدآب»)
`entities/product/model/types.ts` ← داده در `mock-products.ts` ← نمایش در `lib/describe.ts` (و در صورت نیاز فیلتر در `browse-products/model/filters.ts`). چون بقیهٔ برنامه فقط از `entities/product` استفاده می‌کند، جای دیگری لازم نیست دست بخورد.

## اتصال به سرور (نقاط جایگزینی)

برنامه امروز بدون سرور کار می‌کند؛ همهٔ «درزها» مشخص هستند:

| موضوع | محل | کار لازم |
|---|---|---|
| خواندن محصولات | `entities/product/api/product-repository.ts` | بدنهٔ متدها را با `fetch` عوض کنید و متدها را async کنید |
| ورود با پیامک | `entities/session/model/SessionProvider.tsx` + `features/auth-by-phone` | به‌جای ذخیرهٔ شماره، توکن بگیرید؛ interface (`phone`, `signIn`, `signOut`) ثابت می‌ماند |
| ثبت سفارش | `pages/cart/ui/CartPage.tsx` (`TODO(backend)`) | درخواست ثبت سفارش |
| نقش‌ها و کارشناس‌ها | `entities/staff/model/staff-store.ts` + `shared/config/staff.ts` | نقش را از `/me` بگیرید؛ توابع `addInspector` / `removeInspector` درخواست شوند |
| تأیید/رد کارشناس | `entities/listing/model/listing-store.ts` (`reviewListing`) | درخواست به سرور؛ دسترسی را سرور هم بررسی کند |
| ارسال آگهی و عکس‌ها | `features/list-device/ui/ListDeviceFlow.tsx` (`submit`) | آپلود عکس‌ها + حذف پس‌زمینه در سرور |

## استایل‌ها

- هر slice استایل خودش را کنار کامپوننت دارد (`ui/*.css`) و کامپوننت آن را import می‌کند، پس کد هر صفحه فقط همان CSS را بارگذاری می‌کند.
- همهٔ قانون‌ها داخل `@layer` هستند و ترتیب لایه‌ها = ترتیب معماری (`shared → entities → features → widgets → pages`، فایل `app/styles/layers.css`). یعنی ترتیب import هیچ‌وقت نتیجهٔ استایل را عوض نمی‌کند و استایل صفحه همیشه روی استایل پایه برنده است.
- کلاس‌های پایه (`btn`, `chip`, `panel`, `input`, `grid`, …) در `shared/ui/styles/` هستند. اگر کلاسی را در دو slice لازم دارید، آن را به `shared` ببرید، نه اینکه CSS یک slice را از slice دیگر استفاده کنید.

## کیفیت

```bash
npm run verify       # typecheck + lint + معماری + تست‌ها (قبل از هر commit)
npm run check:arch   # فقط قوانین معماری
npm test             # تست‌های واحد (vitest)
```

- منطق مهم (اعتبارسنجی، فیلتر، قالب‌بندی، ماسک اطلاعات تماس) در `model/` و `lib/` به‌صورت **تابع خالص** نوشته شده و کنارش فایل `*.test.ts` دارد. کامپوننت‌ها نازک هستند.
- هر تغییری در قوانین بالا، قبل از commit با `npm run verify` خطا می‌دهد.
