'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { PageContent } from '@/types/admin';
import type { Locale } from '@/i18n/config';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';

interface FooterDict {
  nav: {
    home: string;
    about: string;
    collections: string;
    technology: string;
    blog?: string;
    references: string;
    contact: string;
  };
  footer: {
    copyright: string;
  };
}

export default function Footer({ locale, dict }: { locale: Locale; dict: FooterDict }) {
  const [footerText, setFooterText] = useState('');
  const [navLabels, setNavLabels] = useState(dict.nav);
  const [logo, setLogo] = useState('/images/logo-full.png');

  const navLinks = [
    { href: `/${locale}`, label: navLabels.home },
    { href: `/${locale}/about`, label: navLabels.about },
    { href: `/${locale}/collections`, label: navLabels.collections },
    { href: `/${locale}/technology`, label: navLabels.technology },
    { href: `/${locale}/blog`, label: navLabels.blog ?? 'Blog' },
    { href: `/${locale}/references`, label: navLabels.references },
    { href: `/${locale}/contact`, label: navLabels.contact },
  ];

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetch('/api/pages', { cache: 'no-store' }).then((res) => (res.ok ? res.json() : null)),
      fetch('/api/settings', { cache: 'no-store' }).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([pages, settings]) => {
        if (cancelled) return;

        const footerPage = Array.isArray(pages)
          ? getPageBySlug(pages as PageContent[], 'footer')
          : null;
        const globalPage = Array.isArray(pages)
          ? getPageBySlug(pages as PageContent[], 'global')
          : null;
        const pageFooterText = getPageSectionContent(footerPage, 'copyright', locale, '');
        const resolvedText = pageFooterText || settings?.footerText || '';
        setLogo(getPageSectionContent(globalPage, 'site_logo', locale, '/images/logo-full.png'));

        if (resolvedText) {
          setFooterText(resolvedText);
        }

        setNavLabels({
          ...dict.nav,
          home: getPageSectionContent(globalPage, 'nav_home', locale, dict.nav.home),
          about: getPageSectionContent(globalPage, 'nav_about', locale, dict.nav.about),
          collections: getPageSectionContent(globalPage, 'nav_collections', locale, dict.nav.collections),
          technology: getPageSectionContent(globalPage, 'nav_technology', locale, dict.nav.technology),
          blog: getPageSectionContent(globalPage, 'nav_blog', locale, dict.nav.blog ?? 'Blog'),
          references: getPageSectionContent(globalPage, 'nav_references', locale, dict.nav.references),
          contact: getPageSectionContent(globalPage, 'nav_contact', locale, dict.nav.contact),
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [dict.nav, locale]);

  return (
    <footer className="border-t border-white/10 bg-brand-green py-16">
      <div className="container-xl">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src={logo}
              alt="AKAR ÖRME"
              width={120}
              height={32}
              className="h-8 w-auto brightness-0 invert"
              quality={100}
              unoptimized
              priority
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm text-white/60 transition-colors hover:text-white"
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
