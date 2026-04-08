'use client';

import { RevealOnScroll } from '@/components/Motion';

interface TimelineDict {
  label: string;
  heading: string;
  highlight: string;
}

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
}

export default function Timeline({
  dict,
  events,
}: {
  dict: TimelineDict;
  events: TimelineEvent[];
}) {
  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        <RevealOnScroll className="text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-brand-accent-dark">
            {dict.label}
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-brand-dark md:text-5xl">
            {dict.heading} <span className="accent">{dict.highlight}</span>
          </h2>
        </RevealOnScroll>

        <div className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-brand-accent/30 via-brand-accent/10 to-transparent md:left-1/2 md:block" />

          <div className="space-y-12 md:space-y-0">
            {events.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <RevealOnScroll
                  key={event.year}
                  delay={i * 0.05}
                  className="relative md:flex md:min-h-[140px]"
                >
                  {/* Left content */}
                  <div
                    className={`hidden w-1/2 md:block ${
                      isLeft ? 'pr-16 text-right' : ''
                    }`}
                  >
                    {isLeft && (
                      <TimelineCard year={event.year} title={event.title} description={event.description} />
                    )}
                  </div>

                  {/* Dot */}
                  <div className="absolute left-6 top-1 z-10 hidden md:left-1/2 md:block md:-translate-x-1/2">
                    <div className="relative flex h-4 w-4 items-center justify-center">
                      <div className="h-3 w-3 rounded-full bg-brand-accent" />
                      <div className="absolute h-4 w-4 animate-pulse-ring rounded-full border border-brand-accent/40" />
                    </div>
                  </div>

                  {/* Right content */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isLeft ? '' : 'md:pl-16'
                    }`}
                  >
                    {/* Always show on mobile, only show right items on desktop */}
                    <div className="md:hidden">
                      <TimelineCard year={event.year} title={event.title} description={event.description} />
                    </div>
                    {!isLeft && (
                      <div className="hidden md:block">
                        <TimelineCard year={event.year} title={event.title} description={event.description} />
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  year,
  title,
  description,
}: {
  year: number;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-sand/60 bg-brand-cream p-6 transition-all hover:border-brand-accent/20 hover:shadow-card-hover">
      <span className="font-display text-3xl font-bold text-brand-accent-dark">
        {year}
      </span>
      <h3 className="mt-2 font-display text-lg font-semibold text-brand-dark">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-grey">
        {description}
      </p>
    </div>
  );
}
