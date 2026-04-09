"use client";
import { useClientModels } from '@/hooks/useClientModels';
import type { KnitwearModel } from '@/types';
import ModelGrid from './ModelGrid';

interface ModelGridClientProps {
  staticModels: KnitwearModel[];
  dict: any;
  locale: string;
  onlyFeatured?: boolean;
}

export default function ModelGridClient({ staticModels, dict, locale, onlyFeatured = false }: ModelGridClientProps) {
  const models = useClientModels(staticModels, onlyFeatured);
  return <ModelGrid models={models} dict={dict} locale={locale} />;
}
