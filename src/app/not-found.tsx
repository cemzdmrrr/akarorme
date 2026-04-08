import Link from 'next/link';
import { defaultLocale } from '@/i18n/config';

const messages: Record<string, { text: string; cta: string }> = {
  tr: { text: 'Arad\u0131\u011f\u0131n\u0131z sayfa bulunamad\u0131.', cta: 'Ana Sayfa' },
  en: { text: "The page you're looking for doesn't exist.", cta: 'Back to Home' },
  ar: { text: '\u0627\u0644\u0635\u0641\u062d\u0629 \u0627\u0644\u062a\u064a \u062a\u0628\u062d\u062b \u0639\u0646\u0647\u0627 \u063a\u064a\u0631 \u0645\u0648\u062c\u0648\u062f\u0629.', cta: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u0631\u0626\u064a\u0633\u064a\u0629' },
  zh: { text: '\u60a8\u8981\u67e5\u627e\u7684\u9875\u9762\u4e0d\u5b58\u5728\u3002', cta: '\u8fd4\u56de\u9996\u9875' },
};

export default function NotFound() {
  const m = messages[defaultLocale] ?? messages.en;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-cream px-4 text-center">
      <h1 className="font-display text-7xl font-bold text-brand-accent-dark">404</h1>
      <p className="mt-4 text-lg text-brand-grey">{m.text}</p>
      <Link
        href={`/${defaultLocale}`}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-brand-green-light"
      >
        {m.cta}
      </Link>
    </div>
  );
}
