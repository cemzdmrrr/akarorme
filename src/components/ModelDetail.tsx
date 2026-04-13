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
  const [colorImageIdx, setColorImageIdx] = useState(0);

  // Get all images for the active color
  const colorImages = model.colors[activeColor]?.images ?? 
    (model.colors[activeColor]?.image ? [model.colors[activeColor].image!] : []);
  
  // Determine which image to show based on selected color and image index
  const activeImage = colorImages[colorImageIdx] || model.colors[activeColor]?.image || model.image;

  const handleColorChange = (idx: number) => {
    setActiveColor(idx);
    setColorImageIdx(0);
  };

  const tabs = ['overview', 'technical', 'gallery'] as const;

  return (
    <div className="container-xl section-padding">
      {/* Header row */}
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Image area */}
        <RevealOnScroll>
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-brand-cream">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={model.name}
                      className="w-full h-auto rounded-2xl"
                    />
                  ) : (
                    <div className="aspect-square flex items-center justify-center text-brand-grey text-lg">{model.name}</div>
                  )}
                </motion.div>
              </AnimatePresence>
              {/* Colour indicator ring */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-inset" style={{ '--tw-ring-color': model.colors[activeColor]?.hex } as React.CSSProperties} />

              {/* Prev / Next arrows */}
              {colorImages.length > 1 && (
                <>
                  <button
                    onClick={() => setColorImageIdx((prev) => (prev - 1 + colorImages.length) % colorImages.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm p-3 shadow-md text-brand-dark hover:bg-white transition-colors"
                    aria-label="Önceki görsel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setColorImageIdx((prev) => (prev + 1) % colorImages.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm p-3 shadow-md text-brand-dark hover:bg-white transition-colors"
                    aria-label="Sonraki görsel"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  {/* Image counter */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-xs text-white font-medium">
                    {colorImageIdx + 1} / {colorImages.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail strip for color images */}
            {colorImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {colorImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setColorImageIdx(idx)}
                    className={`shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all ${
                      colorImageIdx === idx
                        ? 'border-brand-accent-dark ring-1 ring-brand-accent'
                        : 'border-transparent hover:border-brand-sand-dark opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
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
                  onClick={() => handleColorChange(i)}
                  className={`group relative h-11 w-11 rounded-full border-2 transition-all ${
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
              className={`relative pb-3 pt-3 text-sm font-medium capitalize transition-colors ${
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
              <div className="grid max-w-3xl gap-4 sm:grid-cols-2">
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
                {model.specs.length === 0 && (
                  <p className="text-sm text-brand-grey col-span-2">Teknik bilgi henüz eklenmemiş.</p>
                )}
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
