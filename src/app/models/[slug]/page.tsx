import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

export default function Page({ params }: { params: { slug: string } }) {
  redirect(`/${defaultLocale}/models/${params.slug}`);
}
