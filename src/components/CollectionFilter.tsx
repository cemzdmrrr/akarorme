'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { KnitwearModel, Tag } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { RevealOnScroll } from '@/components/Motion';

interface CollectionFilterDict {
  all: string;
  men: string;
  women: string;
  winter: string;
  summer: string;
  fine: string;
  heavy: string;
  viewDetails: string;
  noMatch: string;
}

export default function CollectionFilter({
  models,
  dict,
  locale,
}: {
  models: KnitwearModel[];
  dict: CollectionFilterDict;
  locale: string;
}) {
  const filterOptions: { label: string; value: Tag | 'all' }[] = [
    { label: dict.all, value: 'all' },
    { label: dict.men, value: 'men' },
    { label: dict.women, value: 'women' },
    { label: dict.winter, value: 'winter' },
    { label: dict.summer, value: 'summer' },
    { label: dict.fine, value: 'fine' },
    { label: dict.heavy, value: 'heavy' },
  ];
  const [active, setActive] = useState<Tag | 'all'>('all');

  const filtered =
    active === 'all'
      ? models
      : models.filter((m) => m.tags.includes(active));

  return (
    <>
      {/* Filter bar */}
      <RevealOnScroll className="mb-10 flex flex-wrap justify-center gap-3">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActive(opt.value)}
            className={`rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
              active === opt.value
                ? 'border-brand-accent bg-brand-accent/15 text-brand-accent-dark'
                : 'border-brand-sand text-brand-grey hover:border-brand-sand-dark hover:text-brand-dark'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </RevealOnScroll>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((model) => (
            <motion.div
              key={model.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Link
                href={`/${locale}/models/${model.slug}`}
                className="group block overflow-hidden rounded-2xl border border-brand-sand/60 bg-white transition-all duration-400 hover:border-brand-accent/20 hover:shadow-card-hover"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream">
                  {model.image && (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                    {model.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-dark backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-brand-accent px-5 py-2 text-xs font-semibold text-white">
                      {dict.viewDetails}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-brand-dark">
                    {model.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-brand-grey">
                    {model.tagline}
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    {model.colors.map((c) => (
                      <span
                        key={c.hex}
                        className="h-4 w-4 rounded-full border border-brand-sand"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-brand-grey">
          {dict.noMatch}
        </p>
      )}
    </>
  );
}
