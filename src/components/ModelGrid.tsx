'use client';

import Link from 'next/link';
import type { KnitwearModel } from '@/types';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/Motion';

interface ModelGridDict {
  label: string;
  heading: string;
  highlight: string;
  description: string;
  viewDetails: string;
  viewAll: string;
}

export default function ModelGrid({ models, dict, locale }: { models: KnitwearModel[]; dict: ModelGridDict; locale: string }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        <RevealOnScroll>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-accent-dark">
            {dict.label}
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
            {dict.heading} <span className="accent">{dict.highlight}</span>
          </h2>
          <p className="mt-4 max-w-xl text-brand-grey">
            {dict.description}
          </p>
        </RevealOnScroll>

        <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {models.map((model) => (
            <StaggerItem key={model.slug}>
              <Link
                href={`/${locale}/models/${model.slug}`}
                className="group block overflow-hidden rounded-2xl border border-brand-sand/60 bg-brand-cream transition-all duration-400 hover:border-brand-accent/30 hover:shadow-card-hover"
              >
                {/* Image area */}
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-cream">
                  {model.image && (
                    <img
                      src={model.image}
                      alt={model.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  {/* Tag badges */}
                  <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                    {model.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-brand-dark-4 backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-green/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="rounded-full bg-brand-green px-5 py-2 text-xs font-semibold text-white">
                      {dict.viewDetails}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-display text-base font-semibold text-brand-dark">
                    {model.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-brand-grey">{model.tagline}</p>

                  {/* Color dots */}
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
            </StaggerItem>
          ))}
        </StaggerContainer>

        <RevealOnScroll className="mt-12 text-center">
          <Link
            href={`/${locale}/collections`}
            className="inline-flex items-center gap-2 rounded-full border border-brand-sand-dark px-8 py-3.5 font-body text-sm font-medium text-brand-dark-4 transition-all hover:border-brand-green hover:text-brand-green"
          >
            {dict.viewAll}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
