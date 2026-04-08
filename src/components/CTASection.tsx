'use client';

import Link from 'next/link';
import { RevealOnScroll } from '@/components/Motion';

interface CTADict {
  label: string;
  heading: string;
  highlight: string;
  description: string;
  button1: string;
  button2: string;
}

export default function CTASection({ dict, locale }: { dict: CTADict; locale: string }) {
  return (
    <section className="relative overflow-hidden bg-brand-green py-28">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.5) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Ambient gold glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/[0.06] blur-[100px]" />

      <div className="container-xl relative z-10 text-center">
        <RevealOnScroll>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-accent-light">
            {dict.label}
          </p>
          <h2 className="mx-auto max-w-2xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            {dict.heading}
            <br />
            <span className="text-brand-accent-light">{dict.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/70">
            {dict.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-2 rounded-full bg-brand-accent px-8 py-3.5 font-body text-sm font-semibold text-white transition-all hover:bg-brand-accent-light hover:shadow-glow"
            >
              {dict.button1}
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href={`/${locale}/references`}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 font-body text-sm font-medium text-white/90 transition-all hover:border-white/40 hover:text-white"
            >
              {dict.button2}
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
