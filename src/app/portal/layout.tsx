import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s — AKAR ÖRME B2B Portalı',
    default: 'B2B Portalı — AKAR ÖRME',
  },
  description: 'AKAR ÖRME B2B müşteri portalı — koleksiyonlara erişin, numune talep edin ve üretim sürecinizi yönetin.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
