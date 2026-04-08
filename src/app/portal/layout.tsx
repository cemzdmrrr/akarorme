import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s — AKAR ÖRME B2B Portal',
    default: 'B2B Portal — AKAR ÖRME',
  },
  description: 'AKAR ÖRME B2B Customer Portal — Access collections, request samples, and manage production.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
