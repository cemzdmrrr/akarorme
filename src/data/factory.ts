/* ===================================================
   Factory capability data — drives the dashboard
   =================================================== */

export interface FactoryMetric {
  id: string;
  label: string;
  value: number;
  suffix: string;
  icon: string; // SVG path d-attribute
  description: string;
}

export interface MachineType {
  id?: string;
  name: string;
  count: number;
  gauge: string;
  brand: string;
}

export interface ExportCountry {
  name: string;
  code: string;
  lat: number;
  lng: number;
  region: 'europe' | 'asia' | 'africa' | 'americas';
  active: boolean;
}

export interface GaugeCapability {
  id?: string;
  gauge: string;
  range: string;
  percentage: number;
  color: string;
}

export const factoryMetrics: FactoryMetric[] = [
  {
    id: 'machines',
    label: 'Knitting Machines',
    value: 128,
    suffix: '+',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    description: 'State-of-the-art circular and flat knitting machines',
  },
  {
    id: 'capacity',
    label: 'Daily Capacity',
    value: 25000,
    suffix: ' m',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
    description: 'Metres of premium fabric produced daily',
  },
  {
    id: 'gauges',
    label: 'Gauge Types',
    value: 14,
    suffix: '',
    icon: 'M12 22V2M2 12h20M7 7l10 10M17 7L7 17',
    description: 'From 3GG ultra-heavy to 28GG ultra-fine',
  },
  {
    id: 'yarns',
    label: 'Yarn Varieties',
    value: 200,
    suffix: '+',
    icon: 'M4 4c0 0 4 8 8 8s8-8 8-8M4 20c0 0 4-8 8-8s8 8 8 8',
    description: 'Natural, synthetic, and blended yarn options',
  },
  {
    id: 'countries',
    label: 'Export Countries',
    value: 32,
    suffix: '+',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10M12 2a15 15 0 00-4 10 15 15 0 004 10',
    description: 'Delivering to five continents worldwide',
  },
  {
    id: 'employees',
    label: 'Expert Staff',
    value: 350,
    suffix: '+',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    description: 'Skilled technicians, designers, and quality teams',
  },
];

export const machineTypes: MachineType[] = [
  { id: 'circular', name: 'Circular Knitting', count: 72, gauge: '18–28 GG', brand: 'Mayer & Cie' },
  { id: 'flat', name: 'Flat Knitting', count: 32, gauge: '3–14 GG', brand: 'Shima Seiki' },
  { id: 'jacquard', name: 'Jacquard', count: 14, gauge: '7–18 GG', brand: 'Stoll / Shima' },
  { id: 'seamless', name: 'Seamless (Whole Garment)', count: 10, gauge: '12–18 GG', brand: 'Shima Seiki' },
];

export const gaugeCapabilities: GaugeCapability[] = [
  { id: 'ultraFine', gauge: 'Ultra-Fine', range: '24–28 GG', percentage: 15, color: '#D4BC6A' },
  { id: 'fine', gauge: 'Fine', range: '18–22 GG', percentage: 35, color: '#C9A84C' },
  { id: 'medium', gauge: 'Medium', range: '12–16 GG', percentage: 30, color: '#A68B3C' },
  { id: 'heavy', gauge: 'Heavy', range: '7–10 GG', percentage: 15, color: '#1C4332' },
  { id: 'ultraHeavy', gauge: 'Ultra-Heavy', range: '3–5 GG', percentage: 5, color: '#153626' },
];

export const exportCountries: ExportCountry[] = [
  { name: 'Sweden', code: 'SE', lat: 62, lng: 15, region: 'europe', active: true },
  { name: 'Germany', code: 'DE', lat: 51, lng: 10, region: 'europe', active: true },
  { name: 'France', code: 'FR', lat: 46, lng: 2, region: 'europe', active: true },
  { name: 'United Kingdom', code: 'GB', lat: 54, lng: -2, region: 'europe', active: true },
  { name: 'Italy', code: 'IT', lat: 42, lng: 12, region: 'europe', active: true },
  { name: 'Spain', code: 'ES', lat: 40, lng: -4, region: 'europe', active: true },
  { name: 'Netherlands', code: 'NL', lat: 52, lng: 5, region: 'europe', active: true },
  { name: 'Belgium', code: 'BE', lat: 51, lng: 4, region: 'europe', active: true },
  { name: 'Denmark', code: 'DK', lat: 56, lng: 10, region: 'europe', active: true },
  { name: 'Finland', code: 'FI', lat: 64, lng: 26, region: 'europe', active: true },
  { name: 'Poland', code: 'PL', lat: 52, lng: 20, region: 'europe', active: true },
  { name: 'Portugal', code: 'PT', lat: 39, lng: -8, region: 'europe', active: true },
  { name: 'Austria', code: 'AT', lat: 47, lng: 14, region: 'europe', active: true },
  { name: 'Norway', code: 'NO', lat: 60, lng: 11, region: 'europe', active: true },
  { name: 'Greece', code: 'GR', lat: 39, lng: 22, region: 'europe', active: true },
  { name: 'Czech Republic', code: 'CZ', lat: 50, lng: 14, region: 'europe', active: true },
  { name: 'Romania', code: 'RO', lat: 46, lng: 25, region: 'europe', active: true },
  { name: 'Switzerland', code: 'CH', lat: 47, lng: 8, region: 'europe', active: true },
  { name: 'Ireland', code: 'IE', lat: 53, lng: -8, region: 'europe', active: true },
  { name: 'Hungary', code: 'HU', lat: 47, lng: 19, region: 'europe', active: true },
  { name: 'Russia', code: 'RU', lat: 56, lng: 38, region: 'europe', active: true },
  { name: 'Ukraine', code: 'UA', lat: 49, lng: 32, region: 'europe', active: true },
  { name: 'Israel', code: 'IL', lat: 31, lng: 35, region: 'asia', active: true },
  { name: 'UAE', code: 'AE', lat: 24, lng: 54, region: 'asia', active: true },
  { name: 'Saudi Arabia', code: 'SA', lat: 24, lng: 45, region: 'asia', active: true },
  { name: 'Japan', code: 'JP', lat: 36, lng: 140, region: 'asia', active: true },
  { name: 'South Korea', code: 'KR', lat: 36, lng: 128, region: 'asia', active: true },
  { name: 'USA', code: 'US', lat: 38, lng: -97, region: 'americas', active: true },
  { name: 'Canada', code: 'CA', lat: 56, lng: -96, region: 'americas', active: true },
  { name: 'Morocco', code: 'MA', lat: 32, lng: -5, region: 'africa', active: true },
  { name: 'Egypt', code: 'EG', lat: 27, lng: 30, region: 'africa', active: true },
  { name: 'South Africa', code: 'ZA', lat: -29, lng: 24, region: 'africa', active: true },
];

// Istanbul factory origin
export const FACTORY_COORDS = { lat: 41.1, lng: 28.78 };
