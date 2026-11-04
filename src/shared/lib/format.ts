const FA = '۰۱۲۳۴۵۶۷۸۹'

/** 12 -> ۱۲ */
export const toFa = (v: number | string) => String(v).replace(/\d/g, (d) => FA[+d])

/** Persian / Arabic-Indic digits -> ASCII digits, so user input can be validated with plain regexes. */
export const toEn = (v: string) =>
  v.replace(/[۰-۹]/g, (d) => String(FA.indexOf(d))).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))

export const money = (n: number) => `${n.toLocaleString('fa-IR')} تومان`
export const count = (n: number) => n.toLocaleString('fa-IR')
