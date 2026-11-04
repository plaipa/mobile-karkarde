import { toFa } from '@/shared/lib/format'
import type { Grade, Product, Sim } from '../model/types'

/**
 * Demo inventory. Delete this file when the real API is connected — only `product-repository.ts` imports it.
 * Codes follow the MK-#### scheme; `addedDays` is "days since listed".
 */

/** Compact phone builder: keeps the demo rows readable. Prices are in toman. */
function phone(
  n: number, brand: string, name: string, gb: number, region: string | undefined, sim: Sim, color: string,
  battery: number, grade: Grade, price: number, registered: boolean, warranty: boolean, addedDays: number, notes = 'بدون عیب',
): Product {
  const storage = gb >= 1024 ? `${gb / 1024} ترابایت` : `${gb} گیگابایت`
  return { code: `MK-${2100 + n}`, category: 'phone', brand, name, storage: storage.replace(/\d+/g, (d) => toFa(d)), storageGb: gb, region, sim, battery, grade, price, registered, warranty, color, addedDays, notes }
}

export const mockProducts: readonly Product[] = [
  phone(1, 'اپل', 'آیفون ۱۷ پرو مکس', 512, 'AE', 'esim', 'نارنجی کیهانی', 100, 'A', 118500000, true, true, 1),
  phone(2, 'اپل', 'آیفون ۱۷ پرو مکس', 256, 'CH', 'dual', 'آبی عمیق', 98, 'A', 104800000, true, false, 1),
  phone(3, 'اپل', 'آیفون ۱۷ پرو مکس', 256, 'ZA', 'physical-esim', 'نقره‌ای', 97, 'A', 105900000, true, false, 2),
  phone(4, 'اپل', 'آیفون ۱۷ پرو مکس', 1024, 'LL', 'esim', 'نارنجی کیهانی', 100, 'A', 132000000, false, false, 3),
  phone(5, 'اپل', 'آیفون ۱۷ پرو', 256, 'ZA', 'physical-esim', 'آبی عمیق', 96, 'A', 92500000, true, false, 2),
  phone(6, 'اپل', 'آیفون ۱۷ پرو', 256, 'CH', 'dual', 'نقره‌ای', 95, 'A', 90200000, true, false, 4),
  phone(7, 'اپل', 'آیفون ۱۷ پرو', 512, 'AE', 'esim', 'نارنجی کیهانی', 99, 'A', 101400000, true, true, 5),
  phone(8, 'اپل', 'آیفون ۱۷', 256, 'CH', 'dual', 'مشکی', 97, 'A', 68900000, true, false, 3),
  phone(9, 'اپل', 'آیفون ۱۷', 256, 'ZA', 'physical-esim', 'سبز مریمی', 96, 'A', 70400000, true, false, 6),
  phone(10, 'اپل', 'آیفون ایر', 256, 'CH', 'dual', 'مشکی فضایی', 96, 'A', 66500000, true, false, 4),
  phone(11, 'اپل', 'آیفون ۱۶ پرو مکس', 256, 'AE', 'esim', 'تیتانیوم صحرایی', 92, 'A', 81500000, true, false, 2),
  phone(12, 'اپل', 'آیفون ۱۶ پرو مکس', 256, 'CH', 'dual', 'تیتانیوم طبیعی', 90, 'B', 76800000, true, false, 5, 'خط‌وخش جزئی روی قاب'),
  phone(13, 'اپل', 'آیفون ۱۶ پرو مکس', 512, 'ZA', 'physical-esim', 'تیتانیوم مشکی', 94, 'A', 86200000, true, true, 3),
  phone(14, 'اپل', 'آیفون ۱۶ پرو', 128, 'CH', 'dual', 'تیتانیوم طبیعی', 91, 'A', 64900000, true, false, 6),
  phone(15, 'اپل', 'آیفون ۱۶ پرو', 256, 'ZA', 'physical-esim', 'تیتانیوم سفید', 93, 'A', 71800000, true, false, 4),
  phone(16, 'اپل', 'آیفون ۱۶ پرو', 256, 'LL', 'esim', 'تیتانیوم مشکی', 89, 'B', 68300000, false, false, 8, 'ضربهٔ کوچک گوشهٔ بدنه'),
  phone(17, 'اپل', 'آیفون ۱۶', 128, 'CH', 'dual', 'سبز مریمی', 92, 'A', 49800000, true, false, 5),
  phone(18, 'اپل', 'آیفون ۱۶', 256, 'AE', 'esim', 'صورتی', 94, 'A', 55600000, true, false, 7),
  phone(19, 'اپل', 'آیفون ۱۵ پرو مکس', 256, 'CH', 'dual', 'تیتانیوم آبی', 88, 'A', 60200000, true, false, 6),
  phone(20, 'اپل', 'آیفون ۱۵ پرو مکس', 256, 'ZA', 'physical-esim', 'تیتانیوم طبیعی', 86, 'B', 58400000, true, false, 9, 'خط‌وخش جزئی روی قاب'),
  phone(21, 'اپل', 'آیفون ۱۵ پرو', 128, 'CH', 'dual', 'تیتانیوم مشکی', 87, 'B', 47500000, true, false, 10),
  phone(22, 'اپل', 'آیفون ۱۵', 128, 'CH', 'dual', 'مشکی', 90, 'A', 38900000, true, false, 7),
  phone(23, 'اپل', 'آیفون ۱۴ پرو مکس', 256, 'LL', 'esim', 'بنفش تیره', 85, 'B', 44100000, true, false, 11),
  phone(24, 'اپل', 'آیفون ۱۴', 128, 'CH', 'dual', 'بنفش', 91, 'A', 30900000, true, false, 4),
  phone(25, 'اپل', 'آیفون ۱۳', 128, 'CH', 'dual', 'نیمه‌شب', 84, 'B', 23500000, true, false, 12),
  phone(26, 'اپل', 'آیفون ۱۳ پرو مکس', 256, 'ZA', 'physical-esim', 'سیرا بلو', 89, 'A', 42500000, true, false, 1, 'بدون خط‌وخش جدی'),
  phone(27, 'اپل', 'آیفون ۱۲', 128, 'CH', 'dual', 'مشکی', 85, 'C', 24800000, true, false, 8, 'خط‌وخش و ضربه روی قاب'),
  phone(28, 'سامسونگ', 'سامسونگ S25 اولترا', 256, undefined, 'physical-esim', 'تیتانیوم خاکستری', 96, 'A', 78500000, true, true, 2),
  phone(29, 'سامسونگ', 'سامسونگ S24 اولترا', 256, undefined, 'dual', 'مشکی تیتانیوم', 92, 'A', 61800000, true, true, 3),
  phone(30, 'سامسونگ', 'سامسونگ S23 اولترا', 256, undefined, 'dual', 'مشکی', 94, 'A', 38200000, true, true, 2, 'تمیز و بدون تعویض قطعه'),
  phone(31, 'سامسونگ', 'سامسونگ A54', 256, undefined, 'dual', 'سبز', 90, 'A', 13200000, true, true, 9),
  phone(32, 'شیائومی', 'شیائومی ۱۵ اولترا', 512, undefined, 'dual', 'مشکی', 95, 'A', 52000000, true, false, 5),
  phone(33, 'شیائومی', 'شیائومی ۱۳ تی پرو', 512, undefined, 'dual', 'آبی', 90, 'B', 19800000, true, false, 3, 'خط‌وخش جزئی روی قاب'),
  phone(34, 'گوگل', 'گوگل پیکسل ۹ پرو', 256, undefined, 'physical-esim', 'خاکستری', 93, 'A', 47500000, true, false, 6),
  phone(35, 'گوگل', 'گوگل پیکسل ۸', 128, undefined, 'physical-esim', 'خاکستری', 87, 'B', 24600000, true, false, 5, 'ضربهٔ کوچک گوشهٔ بدنه'),
  phone(36, 'آنر', 'آنر ماجیک ۶', 512, undefined, 'dual', 'سبز', 92, 'A', 27100000, true, true, 6),
  phone(37, 'هواوی', 'هواوی پی ۶۰', 256, undefined, 'dual', 'سفید', 88, 'B', 22400000, true, false, 7, 'خط‌وخش جزئی'),
  { code: 'MK-2060', category: 'watch', brand: 'اپل', name: 'اپل واچ سری ۸', storage: '۴۵ میلی‌متر', battery: 92, grade: 'A', price: 11900000, registered: false, warranty: false, color: 'نقره‌ای', addedDays: 2, notes: 'GPS · بند اصلی' },
  { code: 'MK-2061', category: 'watch', brand: 'سامسونگ', name: 'گلکسی واچ ۶', storage: '۴۴ میلی‌متر', battery: 90, grade: 'A', price: 8600000, registered: false, warranty: true, color: 'مشکی', addedDays: 4, notes: 'بلوتوث · بند اصلی' },
  { code: 'MK-2062', category: 'watch', brand: 'گارمین', name: 'گارمین فنیکس ۶', storage: '۴۷ میلی‌متر', battery: 86, grade: 'B', price: 14900000, registered: false, warranty: false, color: 'خاکستری', addedDays: 6, notes: 'GPS · خط‌وخش روی شیشه' },
  { code: 'MK-2070', category: 'speaker', brand: 'جی‌بی‌ال', name: 'جی‌بی‌ال Charge 5', battery: 93, grade: 'A', price: 6200000, registered: false, warranty: false, color: 'مشکی', addedDays: 1, notes: 'ضدآب · با کابل' },
  { code: 'MK-2071', category: 'speaker', brand: 'سونی', name: 'سونی SRS-XB43', battery: 88, grade: 'B', price: 5400000, registered: false, warranty: false, color: 'آبی', addedDays: 3, notes: 'خط‌وخش جزئی' },
  { code: 'MK-2072', category: 'speaker', brand: 'مارشال', name: 'مارشال Emberton II', battery: 91, grade: 'A', price: 7800000, registered: false, warranty: true, color: 'کرم', addedDays: 5, notes: 'بدون عیب' },
]
