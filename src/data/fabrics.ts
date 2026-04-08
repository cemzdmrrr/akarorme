import type { Fabric } from '@/types';

export const fabrics: Fabric[] = [
  {
    id: 'single-jersey',
    name: 'Single Jersey',
    gauge: '28 GG',
    composition: '100% Supima Cotton',
    weight: '140–180 g/m²',
    description:
      'Ultra-fine single jersey with exceptional softness and drape. Bio-polished for a clean surface and reduced pilling.',
    image: '/images/fabrics/single-jersey.jpg',
  },
  {
    id: 'interlock',
    name: 'Interlock',
    gauge: '24 GG',
    composition: '100% Compact Cotton',
    weight: '180–240 g/m²',
    description:
      'Double-face interlock with a smooth, stable hand-feel on both sides. Ideal for premium T-shirts and layering pieces.',
    image: '/images/fabrics/interlock.jpg',
  },
  {
    id: 'pique',
    name: 'Piqué Knit',
    gauge: '14 GG',
    composition: '100% Long-Staple Cotton',
    weight: '200–240 g/m²',
    description:
      'Classic waffle-textured piqué with diamond patterns. The open structure provides breathability for warm-weather garments.',
    image: '/images/fabrics/pique.jpg',
  },
  {
    id: 'french-terry',
    name: 'French Terry',
    gauge: '20 GG',
    composition: '80% Cotton / 20% Polyester',
    weight: '280–350 g/m²',
    description:
      'Looped-back terry knit with a smooth exterior. Brushed options available for heavier applications.',
    image: '/images/fabrics/french-terry.jpg',
  },
  {
    id: 'milano-rib',
    name: 'Milano Rib',
    gauge: '12 GG',
    composition: '50% Merino / 50% Acrylic',
    weight: '260–320 g/m²',
    description:
      'Dense double-knit with a compact, firm hand. Excellent shape retention for structured silhouettes.',
    image: '/images/fabrics/milano-rib.jpg',
  },
  {
    id: 'cable-jacquard',
    name: 'Cable & Jacquard',
    gauge: '7 GG',
    composition: '80% Wool / 20% Nylon',
    weight: '350–480 g/m²',
    description:
      'Heavy-gauge cable and jacquard patterns with deep texture definition. Knitted on Stoll CMS flatbeds for design flexibility.',
    image: '/images/fabrics/cable-jacquard.jpg',
  },
];
