import type { Locale } from './config';

const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((m) => m.default),
  tr: () => import('@/dictionaries/tr.json').then((m) => m.default),
  ar: () => import('@/dictionaries/ar.json').then((m) => m.default),
  zh: () => import('@/dictionaries/zh.json').then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return (dictionaries[locale] ?? dictionaries.en)();
}
