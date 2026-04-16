import type { Reference, Stat } from '@/types';

export const references: Reference[] = [
  { initials: 'NM', name: 'NordMode', country: 'İsveç' },
  { initials: 'AM', name: 'Alta Moda', country: 'İtalya' },
  { initials: 'TW', name: 'ThreadWorks', country: 'Birleşik Krallık' },
  { initials: 'FL', name: 'FibreLink', country: 'Almanya' },
  { initials: 'ET', name: 'Etoile Tricot', country: 'Fransa' },
  { initials: 'VK', name: 'VelvetKnit', country: 'Hollanda' },
  { initials: 'LX', name: 'Luxana Group', country: 'İspanya' },
  { initials: 'KZ', name: 'Kazmir Textiles', country: 'Polonya' },
  { initials: 'WV', name: 'WaveWear', country: 'Danimarka' },
  { initials: 'AR', name: 'ArcticRow', country: 'Finlandiya' },
  { initials: 'SL', name: 'SoleLine', country: 'Portekiz' },
  { initials: 'BK', name: 'BlueKnit Co.', country: 'Belçika' },
];

export const stats: Stat[] = [
  { value: 500, suffix: '+', label: 'Marka Ortağı' },
  { value: 32, label: 'İhracat Ülkesi' },
  { value: 25, suffix: '+', label: 'Güven Yılı' },
  { value: 12, suffix: 'M', label: 'Metre / Yıl' },
];
