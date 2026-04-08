import type { Reference, Stat } from '@/types';

export const references: Reference[] = [
  { initials: 'NM', name: 'NordMode', country: 'Sweden' },
  { initials: 'AM', name: 'Alta Moda', country: 'Italy' },
  { initials: 'TW', name: 'ThreadWorks', country: 'United Kingdom' },
  { initials: 'FL', name: 'FibreLink', country: 'Germany' },
  { initials: 'ÉT', name: 'Étoile Tricot', country: 'France' },
  { initials: 'VK', name: 'VelvetKnit', country: 'Netherlands' },
  { initials: 'LX', name: 'Luxana Group', country: 'Spain' },
  { initials: 'KZ', name: 'Kazmir Textiles', country: 'Poland' },
  { initials: 'WV', name: 'WaveWear', country: 'Denmark' },
  { initials: 'AR', name: 'ArcticRow', country: 'Finland' },
  { initials: 'SL', name: 'SoleLine', country: 'Portugal' },
  { initials: 'BK', name: 'BlueKnit Co.', country: 'Belgium' },
];

export const stats: Stat[] = [
  { value: 500, suffix: '+', label: 'Brand Partners' },
  { value: 32, label: 'Export Countries' },
  { value: 25, suffix: '+', label: 'Years of Trust' },
  { value: 12, suffix: 'M', label: 'Metres / Year' },
];
