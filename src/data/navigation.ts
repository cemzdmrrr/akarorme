import type { NavLink } from '@/types';

export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/collections', label: 'Collections' },
  { href: '/technology', label: 'Technology' },
  { href: '/references', label: 'References' },
  { href: '/contact', label: 'Contact', cta: true },
];
