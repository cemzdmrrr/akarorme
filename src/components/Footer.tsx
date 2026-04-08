'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSettings } from '@/lib/admin-store';

interface FooterDict {
  nav: {
    home: string;
    about: string;
    collections: string;
    technology: string;
    references: string;
    contact: string;
  };
  footer: {
    copyright: string;
  };
}

export default function Footer({ locale, dict }: { locale: string; dict: FooterDict }) {
  const [footerText, setFooterText] = useState('');

  const navLinks = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/collections`, label: dict.nav.collections },
    { href: `/${locale}/technology`, label: dict.nav.technology },
    { href: `/${locale}/references`, label: dict.nav.references },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  useEffect(() => {
    const s = getSettings();
    if (s.footerText) setFooterText(s.footerText);
  }, []);

  return (
    <footer className="border-t border-white/10 bg-brand-green py-16">
      <div className="container-xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo-full.png"
              alt="AKAR ÖRME"
              width={120}
              height={32}
              className="h-8 w-auto brightness-0 invert"
              priority
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          {footerText || dict.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
        </div>
      </div>
    </footer>
  );
}
