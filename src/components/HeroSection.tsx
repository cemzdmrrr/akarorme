'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface HeroDict {
  label: string;
  heading1: string;
  heading2: string;
  highlight: string;
  description: string;
  cta1: string;
  cta2: string;
  scroll: string;
}

export default function HeroSection({ dict, locale }: { dict: HeroDict; locale: string }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white">
      {/* Soft warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-white to-brand-cream-dark" />

      {/* Subtle geometric pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(28,67,50,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(28,67,50,0.4) 1px,transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Decorative accent line */}
      <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

      {/* Soft radial glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/[0.04] blur-[120px]" />

      <div className="container-xl relative z-10 grid items-center gap-12 py-40 lg:grid-cols-2">
        {/* Text column */}
        <div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 font-body text-sm font-medium uppercase tracking-[0.25em] text-brand-accent-dark"
        >
          {dict.label}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display text-6xl font-bold leading-[1.05] tracking-tight text-brand-dark md:text-7xl lg:text-8xl xl:text-9xl"
        >
          {dict.heading1}
          <br />
          {dict.heading2} <span className="gradient-text">{dict.highlight}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-6 max-w-lg text-lg leading-relaxed text-brand-grey md:text-xl"
        >
          {dict.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            href={`/${locale}/collections`}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-green px-8 py-3.5 font-body text-sm font-semibold text-white transition-all hover:bg-brand-green-light hover:shadow-card-hover"
          >
            {dict.cta1}
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 rounded-full border border-brand-sand-dark px-8 py-3.5 font-body text-sm font-medium text-brand-dark-4 transition-all hover:border-brand-accent hover:text-brand-dark"
          >
            {dict.cta2}
          </Link>
        </motion.div>
        </div>

        {/* Hero image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/images/hero/hero-showcase.jpg"
              alt="Premium knit fabric texture close-up"
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 50vw, 0vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent" />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs tracking-widest text-brand-grey">{dict.scroll}</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-6 w-4 rounded-full border border-brand-sand-dark p-0.5"
            >
              <div className="mx-auto h-1.5 w-0.5 rounded-full bg-brand-grey" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
