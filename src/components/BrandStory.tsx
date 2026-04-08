'use client';

import Image from 'next/image';
import Link from 'next/link';
import { RevealOnScroll } from '@/components/Motion';

interface BrandStoryDict {
  label: string;
  heading: string;
  highlight: string;
  paragraph1: string;
  paragraph2: string;
  link: string;
}

export default function BrandStory({ dict, locale }: { dict: BrandStoryDict; locale: string }) {
  return (
    <section className="section-padding bg-white">
      <div className="container-xl grid items-center gap-16 lg:grid-cols-2">
        <RevealOnScroll>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-accent-dark">
            {dict.label}
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-brand-dark md:text-5xl">
            {dict.heading}
            <br />
            <span className="accent">{dict.highlight}</span>
          </h2>
          <p className="mt-6 text-brand-grey leading-relaxed">
            {dict.paragraph1}
          </p>
          <p className="mt-4 text-brand-grey leading-relaxed">
            {dict.paragraph2}
          </p>
          <Link
            href={`/${locale}/about`}
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-green transition-colors hover:text-brand-green-light"
          >
            {dict.link}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/brand/brand-1.jpg"
                alt="Colorful yarn spools and thread bobbins"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </div>
            <div className="relative aspect-[3/4] translate-y-8 overflow-hidden rounded-2xl">
              <Image
                src="/images/brand/brand-2.jpg"
                alt="Industrial textile knitting machine"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            </div>
            <div className="relative col-span-2 aspect-[2/1] overflow-hidden rounded-2xl">
              <Image
                src="/images/brand/brand-3.jpg"
                alt="Rows of finished fabric rolls in factory"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
