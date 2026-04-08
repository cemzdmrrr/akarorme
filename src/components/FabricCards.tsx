'use client';

import Image from 'next/image';
import { RevealOnScroll, StaggerContainer, StaggerItem } from '@/components/Motion';

interface FabricDict {
  label: string;
  heading: string;
  highlight: string;
  description: string;
}

interface FabricData {
  name: string;
  gauge: string;
  composition: string;
  description: string;
}

const FABRIC_IMAGES: Record<string, string> = {
  'Süprem': '/images/fabrics/single-jersey.jpg',
  'Single Jersey': '/images/fabrics/single-jersey.jpg',
  '单面针织': '/images/fabrics/single-jersey.jpg',
  'جيرسي أحادي': '/images/fabrics/single-jersey.jpg',
  'İnterlok': '/images/fabrics/interlock.jpg',
  'Interlock': '/images/fabrics/interlock.jpg',
  '双面针织': '/images/fabrics/interlock.jpg',
  'إنترلوك': '/images/fabrics/interlock.jpg',
  'Pike Örme': '/images/fabrics/pique.jpg',
  'Piqué Knit': '/images/fabrics/pique.jpg',
  '珠地网眼': '/images/fabrics/pique.jpg',
  'بيكيه': '/images/fabrics/pique.jpg',
  'Üç İplik': '/images/fabrics/french-terry.jpg',
  'French Terry': '/images/fabrics/french-terry.jpg',
  '毛圈布': '/images/fabrics/french-terry.jpg',
  'فرنش تيري': '/images/fabrics/french-terry.jpg',
  'Milano Ribana': '/images/fabrics/milano-rib.jpg',
  'Milano Rib': '/images/fabrics/milano-rib.jpg',
  '米兰诺罗纹': '/images/fabrics/milano-rib.jpg',
  'ميلانو ريب': '/images/fabrics/milano-rib.jpg',
  'Jakarlı Örgü': '/images/fabrics/cable-jacquard.jpg',
  'Cable & Jacquard': '/images/fabrics/cable-jacquard.jpg',
  '绞花提花': '/images/fabrics/cable-jacquard.jpg',
  'كيبل وجاكار': '/images/fabrics/cable-jacquard.jpg',
};

export default function FabricCards({ dict, fabrics }: { dict: FabricDict; fabrics: FabricData[] }) {
  return (
    <section className="section-padding bg-brand-cream">
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

        <StaggerContainer className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {fabrics.map((fabric) => (
            <StaggerItem key={fabric.name}>
              <div className="group rounded-2xl border border-brand-sand/60 bg-white p-6 transition-all duration-400 hover:border-brand-accent/30 hover:shadow-card-hover">
                {/* Fabric image */}
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl bg-brand-cream-dark">
                  <Image
                    src={FABRIC_IMAGES[fabric.name] || '/images/fabrics/single-jersey.jpg'}
                    alt={fabric.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />
                </div>

                <h3 className="font-display text-lg font-semibold text-brand-dark">
                  {fabric.name}
                </h3>
                <p className="mt-1 text-xs text-brand-accent-dark">
                  {fabric.gauge} &middot; {fabric.composition}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-brand-grey">
                  {fabric.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {fabric.composition.split('/').map((comp) => (
                    <span
                      key={comp}
                      className="rounded-full bg-brand-cream-dark px-3 py-1 text-xs text-brand-dark-4"
                    >
                      {comp.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
