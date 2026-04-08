'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, localeNames, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLocale(newLocale: Locale) {
    // Replace current locale prefix with new locale
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
    setOpen(false);
  }

  const currentFlag = getFlagEmoji(locale);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 rounded-full border border-brand-sand px-3 py-1.5 text-xs font-medium text-brand-dark transition-all hover:border-brand-sand-dark hover:bg-brand-cream"
        aria-label="Dil se\u00e7"
      >
        <span className="text-sm">{currentFlag}</span>
        <span className="uppercase">{locale}</span>
        <svg className={cn('h-3 w-3 transition-transform', open && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-brand-sand bg-white shadow-lg">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchLocale(l)}
              className={cn(
                'flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors',
                l === locale
                  ? 'bg-brand-cream font-medium text-brand-green'
                  : 'text-brand-dark hover:bg-brand-cream/50',
              )}
            >
              <span className="text-base">{getFlagEmoji(l)}</span>
              <span>{localeNames[l as Locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getFlagEmoji(locale: string): string {
  const flags: Record<string, string> = {
    tr: '🇹🇷',
    en: '🇬🇧',
    ar: '🇸🇦',
    zh: '🇨🇳',
  };
  return flags[locale] || '🌐';
}
