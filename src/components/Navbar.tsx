'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { Locale } from '@/i18n/config';
import type { PageContent } from '@/types/admin';
import { getPageBySlug, getPageSectionContent } from '@/data/page-content';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface NavDict {
  home: string;
  about: string;
  collections: string;
  technology: string;
  blog?: string;
  references: string;
  contact: string;
  toggleMenu: string;
}

export default function Navbar({ locale, dict }: { locale: string; dict: { nav: NavDict } }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navLabels, setNavLabels] = useState(dict.nav);

  const navLinks = [
    { href: `/${locale}`, label: navLabels.home },
    { href: `/${locale}/about`, label: navLabels.about },
    { href: `/${locale}/collections`, label: navLabels.collections },
    { href: `/${locale}/technology`, label: navLabels.technology },
    { href: `/${locale}/blog`, label: navLabels.blog ?? 'Blog' },
    { href: `/${locale}/references`, label: navLabels.references },
    { href: `/${locale}/contact`, label: navLabels.contact, cta: true },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/pages', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((pages) => {
        if (cancelled || !Array.isArray(pages)) return;

        const globalPage = getPageBySlug(pages as PageContent[], 'global');
        setNavLabels({
          ...dict.nav,
          home: getPageSectionContent(globalPage, 'nav_home', locale as Locale, dict.nav.home),
          about: getPageSectionContent(globalPage, 'nav_about', locale as Locale, dict.nav.about),
          collections: getPageSectionContent(globalPage, 'nav_collections', locale as Locale, dict.nav.collections),
          technology: getPageSectionContent(globalPage, 'nav_technology', locale as Locale, dict.nav.technology),
          blog: getPageSectionContent(globalPage, 'nav_blog', locale as Locale, dict.nav.blog ?? 'Blog'),
          references: getPageSectionContent(globalPage, 'nav_references', locale as Locale, dict.nav.references),
          contact: getPageSectionContent(globalPage, 'nav_contact', locale as Locale, dict.nav.contact),
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [dict.nav, locale]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled ? 'bg-white py-3 shadow-md' : 'bg-white py-5',
        )}
      >
        <nav className="container-xl flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo-full.png"
              alt="AKAR ÖRME"
              width={120}
              height={32}
              className="h-8 w-auto"
              quality={100}
              unoptimized
              priority
            />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const active =
                link.href === `/${locale}`
                  ? pathname === `/${locale}` || pathname === `/${locale}/`
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative font-body text-sm font-medium tracking-wide transition-colors duration-300',
                    link.cta
                      ? 'rounded-full border border-brand-green bg-brand-green px-5 py-2 text-white hover:bg-brand-green-light'
                      : active
                        ? 'text-brand-green'
                        : 'text-brand-dark-4 hover:text-brand-green',
                  )}
                >
                  {link.label}
                  {active && !link.cta && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-brand-accent"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
            <LanguageSwitcher locale={locale} />
          </div>

          <button
            className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={dict.nav.toggleMenu}
          >
            <span
              className={cn(
                'h-0.5 w-6 rounded transition-all duration-300',
                mobileOpen ? 'translate-y-2 rotate-45 bg-brand-dark-4' : 'bg-brand-dark-4',
              )}
            />
            <span
              className={cn(
                'h-0.5 w-6 rounded transition-all duration-300',
                mobileOpen ? 'scale-x-0 opacity-0 bg-brand-dark-4' : 'bg-brand-dark-4',
              )}
            />
            <span
              className={cn(
                'h-0.5 w-6 rounded transition-all duration-300',
                mobileOpen ? '-translate-y-2 -rotate-45 bg-brand-dark-4' : 'bg-brand-dark-4',
              )}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-white/95 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 font-display text-2xl font-semibold tracking-wide text-brand-dark transition-colors hover:text-brand-green"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * navLinks.length }}
            >
              <LanguageSwitcher locale={locale} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
