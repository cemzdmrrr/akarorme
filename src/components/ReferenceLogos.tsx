'use client';

import { useEffect, useState } from 'react';
import { references as staticRefs } from '@/data/references';
import { AnimatedCounter, RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/Motion';

interface ReferenceLogosDict {
  heading: string;
  highlight: string;
  description: string;
}

interface StatData {
  label: string;
  value: number;
  suffix?: string;
}

export default function ReferenceLogos({
  dict,
  statsData,
}: {
  dict: ReferenceLogosDict;
  statsData: StatData[];
}) {
  const [refs, setRefs] = useState(staticRefs);

  useEffect(() => {
    fetch('/api/references')
      .then((res) => res.ok ? res.json() : [])
      .then((cmsRefs) => {
        if (Array.isArray(cmsRefs) && cmsRefs.length > 0) {
          setRefs(cmsRefs.map((r: { initials: string; name: string; country: string }) => ({ initials: r.initials, name: r.name, country: r.country })));
        }
      })
      .catch(() => { /* keep static refs */ });
  }, []);
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-xl">
        {/* Stats */}
        <StaggerContainer className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="rounded-2xl border border-brand-sand/60 bg-white p-8 text-center">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix ?? ''}
                  className="font-display text-4xl font-bold text-brand-accent-dark"
                />
                <p className="mt-2 text-sm text-brand-grey">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <RevealOnScroll className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
            {dict.heading} <span className="accent">{dict.highlight}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-brand-grey">
            {dict.description}
          </p>
        </RevealOnScroll>

        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {refs.map((ref) => (
            <StaggerItem key={ref.name}>
              <div className="group flex flex-col items-center justify-center rounded-2xl border border-brand-sand/60 bg-white px-6 py-10 text-center transition-all duration-400 hover:border-brand-accent/20 hover:shadow-card-hover">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-brand-cream-dark font-display text-xl font-bold text-brand-grey transition-all group-hover:scale-110 group-hover:bg-brand-accent/10 group-hover:text-brand-accent-dark">
                  {ref.initials}
                </div>
                <p className="font-display text-sm font-semibold text-brand-dark">
                  {ref.name}
                </p>
                <p className="mt-0.5 text-xs text-brand-grey">{ref.country}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
