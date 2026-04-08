import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — AKAR ÖRME CMS',
  description: 'Content management system for AKAR ÖRME website.',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
