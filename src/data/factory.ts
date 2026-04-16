/* ===================================================
   Factory capability data - drives the dashboard
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
    label: 'Örme Makineleri',
    value: 128,
    suffix: '+',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    description: 'Yeni nesil yuvarlak ve düz örme makine parkuru',
  },
  {
    id: 'capacity',
    label: 'Günlük Kapasite',
    value: 25000,
    suffix: ' m',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8',
    description: 'Günlük üretilen premium kumaş miktarı',
  },
  {
    id: 'gauges',
    label: 'İncelik Türü',
    value: 14,
    suffix: '',
    icon: 'M12 22V2M2 12h20M7 7l10 10M17 7L7 17',
    description: '3GG ağır gramajdan 28GG ultra ince yapıya kadar',
  },
  {
    id: 'yarns',
    label: 'İplik Çeşidi',
    value: 200,
    suffix: '+',
    icon: 'M4 4c0 0 4 8 8 8s8-8 8-8M4 20c0 0 4-8 8-8s8 8 8 8',
    description: 'Doğal, sentetik ve karışımlı iplik seçenekleri',
  },
  {
    id: 'countries',
    label: 'İhracat Ülkesi',
    value: 32,
    suffix: '+',
    icon: 'M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2a15 15 0 014 10 15 15 0 01-4 10M12 2a15 15 0 00-4 10 15 15 0 004 10',
    description: 'Dünya genelinde beş kıtaya teslimat',
  },
  {
    id: 'employees',
    label: 'Uzman Kadro',
    value: 350,
    suffix: '+',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    description: 'Deneyimli teknisyenler, tasarımcılar ve kalite ekipleri',
  },
];

export const machineTypes: MachineType[] = [
  { id: 'circular', name: 'Yuvarlak Örme', count: 72, gauge: '18-28 GG', brand: 'Mayer & Cie' },
  { id: 'flat', name: 'Düz Örme', count: 32, gauge: '3-14 GG', brand: 'Shima Seiki' },
  { id: 'jacquard', name: 'Jakarlı Örme', count: 14, gauge: '7-18 GG', brand: 'Stoll / Shima' },
  { id: 'seamless', name: 'Dikişsiz Örme (Whole Garment)', count: 10, gauge: '12-18 GG', brand: 'Shima Seiki' },
];

export const gaugeCapabilities: GaugeCapability[] = [
  { id: 'ultraFine', gauge: 'Ultra İnce', range: '24-28 GG', percentage: 15, color: '#D4BC6A' },
  { id: 'fine', gauge: 'İnce', range: '18-22 GG', percentage: 35, color: '#C9A84C' },
  { id: 'medium', gauge: 'Orta', range: '12-16 GG', percentage: 30, color: '#A68B3C' },
  { id: 'heavy', gauge: 'Kalın', range: '7-10 GG', percentage: 15, color: '#1C4332' },
  { id: 'ultraHeavy', gauge: 'Ultra Kalın', range: '3-5 GG', percentage: 5, color: '#153626' },
];

export const exportCountries: ExportCountry[] = [
  { name: 'İsveç', code: 'SE', lat: 62, lng: 15, region: 'europe', active: true },
  { name: 'Almanya', code: 'DE', lat: 51, lng: 10, region: 'europe', active: true },
  { name: 'Fransa', code: 'FR', lat: 46, lng: 2, region: 'europe', active: true },
  { name: 'Birleşik Krallık', code: 'GB', lat: 54, lng: -2, region: 'europe', active: true },
  { name: 'İtalya', code: 'IT', lat: 42, lng: 12, region: 'europe', active: true },
  { name: 'İspanya', code: 'ES', lat: 40, lng: -4, region: 'europe', active: true },
  { name: 'Hollanda', code: 'NL', lat: 52, lng: 5, region: 'europe', active: true },
  { name: 'Belçika', code: 'BE', lat: 51, lng: 4, region: 'europe', active: true },
  { name: 'Danimarka', code: 'DK', lat: 56, lng: 10, region: 'europe', active: true },
  { name: 'Finlandiya', code: 'FI', lat: 64, lng: 26, region: 'europe', active: true },
  { name: 'Polonya', code: 'PL', lat: 52, lng: 20, region: 'europe', active: true },
  { name: 'Portekiz', code: 'PT', lat: 39, lng: -8, region: 'europe', active: true },
  { name: 'Avusturya', code: 'AT', lat: 47, lng: 14, region: 'europe', active: true },
  { name: 'Norveç', code: 'NO', lat: 60, lng: 11, region: 'europe', active: true },
  { name: 'Yunanistan', code: 'GR', lat: 39, lng: 22, region: 'europe', active: true },
  { name: 'Çekya', code: 'CZ', lat: 50, lng: 14, region: 'europe', active: true },
  { name: 'Romanya', code: 'RO', lat: 46, lng: 25, region: 'europe', active: true },
  { name: 'İsviçre', code: 'CH', lat: 47, lng: 8, region: 'europe', active: true },
  { name: 'İrlanda', code: 'IE', lat: 53, lng: -8, region: 'europe', active: true },
  { name: 'Macaristan', code: 'HU', lat: 47, lng: 19, region: 'europe', active: true },
  { name: 'Rusya', code: 'RU', lat: 56, lng: 38, region: 'europe', active: true },
  { name: 'Ukrayna', code: 'UA', lat: 49, lng: 32, region: 'europe', active: true },
  { name: 'İsrail', code: 'IL', lat: 31, lng: 35, region: 'asia', active: true },
  { name: 'BAE', code: 'AE', lat: 24, lng: 54, region: 'asia', active: true },
  { name: 'Suudi Arabistan', code: 'SA', lat: 24, lng: 45, region: 'asia', active: true },
  { name: 'Japonya', code: 'JP', lat: 36, lng: 140, region: 'asia', active: true },
  { name: 'Güney Kore', code: 'KR', lat: 36, lng: 128, region: 'asia', active: true },
  { name: 'ABD', code: 'US', lat: 38, lng: -97, region: 'americas', active: true },
  { name: 'Kanada', code: 'CA', lat: 56, lng: -96, region: 'americas', active: true },
  { name: 'Fas', code: 'MA', lat: 32, lng: -5, region: 'africa', active: true },
  { name: 'Mısır', code: 'EG', lat: 27, lng: 30, region: 'africa', active: true },
  { name: 'Güney Afrika', code: 'ZA', lat: -29, lng: 24, region: 'africa', active: true },
];

// Istanbul factory origin
export const FACTORY_COORDS = { lat: 41.1, lng: 28.78 };
