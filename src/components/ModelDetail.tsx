'use client';

import Link from 'next/link';
import type { KnitwearModel } from '@/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealOnScroll } from '@/components/Motion';

interface ModelDetailDict {
  backToCollections: string;
  availableColours: string;
  requestProduction: string;
  orderSample: string;
  tabs: { overview: string; technical: string; gallery: string };
  overviewExtra: string;
}

export default function ModelDetail({
  model,
  dict,
  locale,
}: {
  model: KnitwearModel;
  dict: ModelDetailDict;
  locale: string;
}) {
  const [activeColor, setActiveColor] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'gallery'>('overview');

  // Determine which image to show based on selected color
  const activeImage = model.colors[activeColor]?.image || model.image;

  const tabs = ['overview', 'technical', 'gallery'] as const;

  return (
    <div className="container-xl section-padding">
      {/* Header row */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image area */}
        <RevealOnScroll>
          <div className="relative rounded-2xl overflow-hidden bg-brand-cream">
            {activeImage ? (
              <img
                src={activeImage}
                alt={model.name}
                className="w-full h-auto rounded-2xl transition-all duration-500"
                key={activeImage}
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-brand-grey text-lg">{model.name}</div>
            )}
            {/* Colour indicator ring */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-inset" style={{ '--tw-ring-color': model.colors[activeColor]?.hex } as React.CSSProperties} />
          </div>
        </RevealOnScroll>

        {/* Info */}
        <RevealOnScroll delay={0.15}>
          <Link
            href={`/${locale}/collections`}
            className="mb-4 inline-flex items-center gap-1 text-xs text-brand-grey transition-colors hover:text-brand-green"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {dict.backToCollections}
          </Link>

          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            {model.name}
          </h1>
          <p className="mt-1 text-brand-accent-dark">{model.tagline}</p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {model.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-brand-cream-dark px-3 py-1 text-xs uppercase tracking-wider text-brand-grey"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-6 leading-relaxed text-brand-grey">{model.description}</p>

          {/* Color swatches */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-grey-light">
              {dict.availableColours}
            </p>
            <div className="flex gap-3">
              {model.colors.map((c, i) => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(i)}
                  className={`group relative h-10 w-10 rounded-full border-2 transition-all ${
                    activeColor === i
                      ? 'border-brand-accent-dark scale-110'
                      : 'border-transparent hover:border-brand-sand-dark'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {activeColor === i && (
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-brand-grey-light whitespace-nowrap">
                      {c.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-accent-light hover:shadow-glow"
            >
              {dict.requestProduction}
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center rounded-full border border-brand-sand px-8 py-3.5 text-sm font-medium text-brand-dark transition-all hover:border-brand-sand-dark hover:text-brand-green"
            >
              {dict.orderSample}
            </Link>
          </div>
        </RevealOnScroll>
      </div>

      {/* Tabs */}
      <div className="mt-20">
        <div className="flex gap-8 border-b border-brand-sand">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? 'text-brand-dark' : 'text-brand-grey hover:text-brand-dark'
              }`}
            >
              {dict.tabs[tab]}
              {activeTab === tab && (
                <motion.div
                  layoutId="model-tab-underline"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-brand-accent-dark"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="pt-8"
          >
            {activeTab === 'overview' && (
              <div className="max-w-2xl space-y-4 text-brand-grey leading-relaxed">
                <p>{model.description}</p>
                <p>
                  {dict.overviewExtra}
                </p>
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="grid max-w-lg gap-4">
                {model.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between rounded-xl bg-brand-cream px-6 py-4"
                  >
                    <span className="text-sm text-brand-grey">{spec.label}</span>
                    <span className="font-display text-sm font-semibold text-brand-dark">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(model.gallery.length > 0
                  ? model.gallery
                  : [model.image]
                ).map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-cream"
                  >
                    {src && (
                      <img
                        src={src}
                        alt={`${model.name} ${i + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
