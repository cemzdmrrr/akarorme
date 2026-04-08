export const locales = ['en', 'tr', 'ar', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'tr';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  tr: 'Türkçe',
  ar: 'العربية',
  zh: '中文',
};

/** RTL locales */
export const rtlLocales: Locale[] = ['ar'];

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
